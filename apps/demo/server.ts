/**
 * Agent A — Protected Data Analysis API
 *
 * Exposes a single endpoint gated by the Sigil x402 middleware.
 * Any agent with a valid Sigil credential and `data-analysis` capability
 * can call it; the spend is recorded on-chain per request.
 *
 * Usage: bun run server
 */

import express from "express";
import { Connection, Keypair } from "@solana/web3.js";
import { Wallet, BN } from "@coral-xyz/anchor";
import { createSigilMiddleware } from "../../packages/x402-middleware/src/index";
import fs from "fs";
import path from "path";

const DEVNET = "https://api.devnet.solana.com";
const PORT = 3001;
const KEYPAIR_PATH = path.join(__dirname, "agent-a-keypair.json");
const SPEND_PER_CALL = new BN(10_000); // 0.01 USDC

if (!fs.existsSync(KEYPAIR_PATH)) {
  console.error("Agent A keypair not found. Run `bun run setup` first.");
  process.exit(1);
}

const agentA = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8")))
);

const connection = new Connection(DEVNET, "confirmed");
const serverWallet = new Wallet(agentA);

const app = express();
app.use(express.json());

// ── Protected endpoint ───────────────────────────────────────────────────────
app.post(
  "/api/analyze",
  createSigilMiddleware({
    connection,
    serverWallet,
    requiredCapability: "data-analysis",
    spendAmount: SPEND_PER_CALL,
    network: "devnet",
  }),
  (req, res) => {
    const agentPubkey = (req as express.Request & { sigilAgent: string }).sigilAgent;
    const { text = "No input provided." } = req.body as { text?: string };

    console.log(`\n  ✓ Authorized — agent: ${agentPubkey}`);
    console.log(`  Input: "${text.slice(0, 60)}"`);

    // Simulated analysis result
    const wordCount = text.trim().split(/\s+/).length;
    const sentiment = wordCount > 10 ? "neutral" : "insufficient data";

    res.json({
      result: `Processed ${wordCount} tokens. Sentiment: ${sentiment}.`,
      provider: agentA.publicKey.toBase58(),
      capability: "data-analysis",
      cost: `${SPEND_PER_CALL.toNumber() / 1_000_000} USDC`,
      verified: true,
      timestamp: new Date().toISOString(),
    });
  }
);

// ── Health check (unprotected) ───────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "online",
    agent: agentA.publicKey.toBase58(),
    capability: "data-analysis",
    endpoint: `http://localhost:${PORT}/api/analyze`,
    costPerCall: `${SPEND_PER_CALL.toNumber() / 1_000_000} USDC`,
  });
});

app.listen(PORT, () => {
  console.log("\n── Agent A — Data Analysis API ────────────────────────────");
  console.log(`  Pubkey    : ${agentA.publicKey.toBase58()}`);
  console.log(`  Endpoint  : POST http://localhost:${PORT}/api/analyze`);
  console.log(`  Capability: data-analysis`);
  console.log(`  Cost      : ${SPEND_PER_CALL.toNumber() / 1_000_000} USDC / call`);
  console.log("  Waiting for requests...\n");
});
