/**
 * Setup — run this once to:
 *   1. Fund Agent A and Agent B keypairs (from principal wallet)
 *   2. Issue a Sigil credential to Agent A and Agent B
 *   3. Register Agent A in the on-chain registry
 *
 * Usage: bun run setup
 */

import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { Wallet, BN } from "@coral-xyz/anchor";
import { SigilClient } from "../../packages/sdk/src/index";
import fs from "fs";
import path from "path";
import os from "os";

const DEVNET = "https://api.devnet.solana.com";
const AGENT_A_PATH = path.join(__dirname, "agent-a-keypair.json");
const AGENT_B_PATH = path.join(__dirname, "agent-b-keypair.json");
const PRINCIPAL_PATH = process.env.PRINCIPAL_KEYPAIR ?? path.join(os.homedir(), ".config/solana/id.json");

function loadOrCreate(filePath: string): Keypair {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Keypair.fromSecretKey(Uint8Array.from(raw));
  } catch {
    const kp = Keypair.generate();
    fs.writeFileSync(filePath, JSON.stringify(Array.from(kp.secretKey)));
    console.log(`Generated new keypair → ${filePath}`);
    return kp;
  }
}

async function fundIfNeeded(
  connection: Connection,
  from: Keypair,
  to: Keypair,
  minLamports = 0.1 * LAMPORTS_PER_SOL
) {
  const balance = await connection.getBalance(to.publicKey);
  if (balance >= minLamports) return;
  const needed = minLamports - balance;
  console.log(`  Funding ${to.publicKey.toBase58().slice(0, 8)}... with ${(needed / LAMPORTS_PER_SOL).toFixed(3)} SOL`);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: needed,
    })
  );
  await sendAndConfirmTransaction(connection, tx, [from]);
}

async function main() {
  const connection = new Connection(DEVNET, "confirmed");

  const principal = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(PRINCIPAL_PATH, "utf-8")))
  );
  const agentA = loadOrCreate(AGENT_A_PATH);
  const agentB = loadOrCreate(AGENT_B_PATH);

  console.log("\n── Sigil Demo Setup ──────────────────────────────────────");
  console.log(`Principal : ${principal.publicKey.toBase58()}`);
  console.log(`Agent A   : ${agentA.publicKey.toBase58()}`);
  console.log(`Agent B   : ${agentB.publicKey.toBase58()}`);

  const principalBalance = await connection.getBalance(principal.publicKey);
  console.log(`\nPrincipal balance: ${(principalBalance / LAMPORTS_PER_SOL).toFixed(3)} SOL`);

  if (principalBalance < 0.5 * LAMPORTS_PER_SOL) {
    console.error("Principal wallet needs at least 0.5 SOL. Top up at faucet.solana.com");
    process.exit(1);
  }

  // Fund agents
  console.log("\nFunding agents...");
  await fundIfNeeded(connection, principal, agentA);
  await fundIfNeeded(connection, principal, agentB);

  // Principal client — issues Sigils
  const principalClient = new SigilClient({
    connection,
    wallet: new Wallet(principal),
  });

  const expiresAt = Math.floor(Date.now() / 1000) + 86_400 * 30; // 30 days

  // Issue Sigil to Agent A
  console.log("\nIssuing Sigil to Agent A (data-analysis provider)...");
  try {
    const txA = await principalClient.issueSigil({
      agent: agentA.publicKey,
      capabilities: [{ category: "data-analysis", allowedDomains: [] }],
      spendLimits: {
        perTx: new BN(100_000),
        perDay: new BN(10_000_000),
      },
      expiresAt,
    });
    console.log(`  tx: ${txA}`);
  } catch (e: any) {
    if (e?.message?.includes("already in use")) {
      console.log("  Sigil already exists, skipping.");
    } else throw e;
  }

  // Issue Sigil to Agent B
  console.log("\nIssuing Sigil to Agent B (caller agent)...");
  try {
    const txB = await principalClient.issueSigil({
      agent: agentB.publicKey,
      capabilities: [{ category: "data-analysis", allowedDomains: [] }],
      spendLimits: {
        perTx: new BN(50_000),
        perDay: new BN(5_000_000),
      },
      expiresAt,
    });
    console.log(`  tx: ${txB}`);
  } catch (e: any) {
    if (e?.message?.includes("already in use")) {
      console.log("  Sigil already exists, skipping.");
    } else throw e;
  }

  // Register Agent A in the registry — must use Agent A's wallet as signer
  const [sigilAPda] = principalClient.sigilPda(agentA.publicKey, principal.publicKey);

  const agentAClient = new SigilClient({
    connection,
    wallet: new Wallet(agentA),
  });

  console.log("\nRegistering Agent A in on-chain registry...");
  try {
    const txReg = await agentAClient.listAgent({
      sigil: sigilAPda,
      capabilities: ["data-analysis"],
      pricingModel: { kind: "perCall", amount: new BN(10_000) },
      endpointUrl: "http://localhost:3001/api/analyze",
    });
    console.log(`  tx: ${txReg}`);
  } catch (e: any) {
    if (e?.message?.includes("already in use")) {
      console.log("  Listing already exists, skipping.");
    } else throw e;
  }

  console.log("\n── Setup complete ────────────────────────────────────────");
  console.log("Next steps:");
  console.log("  1. bun run server   (start Agent A's protected API)");
  console.log("  2. bun run agent    (run Agent B to call Agent A)");
  console.log("──────────────────────────────────────────────────────────\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
