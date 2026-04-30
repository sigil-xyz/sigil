/**
 * Agent B — Caller Agent
 *
 * Demonstrates an agent using its Sigil credential to authenticate
 * and pay for a request to Agent A's protected endpoint.
 *
 * Usage: bun run agent
 */

import { Connection, Keypair } from "@solana/web3.js";
import { Wallet, BN } from "@coral-xyz/anchor";
import { buildSigilHeaders } from "../../packages/x402-middleware/src/agent";
import { SigilClient } from "../../packages/sdk/src/index";
import fs from "fs";
import path from "path";
import os from "os";

const DEVNET = "https://api.devnet.solana.com";
const AGENT_A_URL = process.env.AGENT_A_URL ?? "http://localhost:3001";
const AGENT_B_PATH = path.join(__dirname, "agent-b-keypair.json");
const PRINCIPAL_PATH = process.env.PRINCIPAL_KEYPAIR ?? path.join(os.homedir(), ".config/solana/id.json");
const SPEND_AMOUNT = new BN(10_000);

async function main() {
  if (!fs.existsSync(AGENT_B_PATH)) {
    console.error("Agent B keypair not found. Run `bun run setup` first.");
    process.exit(1);
  }

  const agentB = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(AGENT_B_PATH, "utf-8")))
  );
  const principal = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(PRINCIPAL_PATH, "utf-8")))
  );

  const connection = new Connection(DEVNET, "confirmed");
  const client = new SigilClient({
    connection,
    wallet: new Wallet(principal),
  });

  console.log("\n── Agent B — Caller Agent ──────────────────────────────────");
  console.log(`  Agent B   : ${agentB.publicKey.toBase58()}`);
  console.log(`  Principal : ${principal.publicKey.toBase58()}`);

  // Step 1: Verify Sigil is valid before making the request
  console.log("\n  Verifying Sigil credential on-chain...");
  try {
    await client.verifySigil(agentB.publicKey, {
      principal: principal.publicKey,
      requiredCapability: "data-analysis",
      maxSpendAmount: SPEND_AMOUNT,
    });
    console.log("  ✓ Sigil valid — identity confirmed, capability granted");
  } catch (e: any) {
    console.error(`  ✗ Sigil verification failed: ${e.message}`);
    console.error("  Run `bun run setup` to issue credentials first.");
    process.exit(1);
  }

  // Step 2: Build signed headers
  const method = "POST";
  const path_ = "/api/analyze";
  const headers = buildSigilHeaders({
    agentKeypair: agentB,
    principalPubkey: principal.publicKey,
    method,
    path: path_,
    spendAmount: SPEND_AMOUNT,
  });

  console.log("\n  Signed request headers:");
  Object.entries(headers).forEach(([k, v]) =>
    console.log(`    ${k}: ${v.slice(0, 20)}...`)
  );

  // Step 3: Call Agent A's protected endpoint
  const payload = {
    text: "Analyze the adoption curve of autonomous AI agents in decentralized finance. What are the key trust barriers and how does cryptographic identity help overcome them?",
  };

  console.log(`\n  Calling ${AGENT_A_URL}${path_}...`);
  const response = await fetch(`${AGENT_A_URL}${path_}`, {
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("\n  ✗ Request rejected (HTTP 402):");
    console.error("  ", JSON.stringify(err, null, 2));
    process.exit(1);
  }

  const result = await response.json() as {
    result: string;
    provider: string;
    cost: string;
    verified: boolean;
  };

  console.log("\n  ✓ Response received:");
  console.log("  ┌──────────────────────────────────────────────────────");
  console.log(`  │ ${result.result}`);
  console.log(`  │ Provider : ${result.provider.slice(0, 20)}...`);
  console.log(`  │ Cost     : ${result.cost}`);
  console.log(`  │ Verified : ${result.verified}`);
  console.log("  └──────────────────────────────────────────────────────");
  console.log("\n── Done ────────────────────────────────────────────────────\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
