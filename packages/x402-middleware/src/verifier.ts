import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import BN from "bn.js";
import { SigilClient } from "@sigil-xyz/sdk";
import type { SigilMiddlewareConfig } from "./types";

export interface VerifyResult {
  ok: boolean;
  agentPubkey?: PublicKey;
  reason?: string;
}

function buildMessage(timestamp: string, method: string, path: string, spendAmount: BN): Uint8Array {
  return new TextEncoder().encode(
    `${timestamp}:${method.toUpperCase()}:${path}:${spendAmount.toString()}`
  );
}

export async function verifySigilRequest(
  method: string,
  path: string,
  headers: Record<string, string | string[] | undefined>,
  config: SigilMiddlewareConfig,
): Promise<VerifyResult> {
  const get = (h: string) => {
    const v = headers[h];
    return Array.isArray(v) ? v[0] : v;
  };

  const agentStr = get("x-sigil-agent");
  const principalStr = get("x-sigil-principal");
  const timestampStr = get("x-sigil-timestamp");
  const sigStr = get("x-sigil-signature");

  if (!agentStr || !principalStr || !timestampStr || !sigStr) {
    return {
      ok: false,
      reason: "Missing required headers: x-sigil-agent, x-sigil-principal, x-sigil-timestamp, x-sigil-signature",
    };
  }

  // 1. Parse agent and principal pubkeys
  let agentPubkey: PublicKey;
  let principalPubkey: PublicKey;
  try {
    agentPubkey = new PublicKey(agentStr);
    principalPubkey = new PublicKey(principalStr);
  } catch {
    return { ok: false, reason: "Invalid x-sigil-agent or x-sigil-principal: not a valid Solana public key" };
  }

  // 2. Check timestamp freshness
  const requestTime = parseInt(timestampStr, 10);
  const maxAge = config.maxRequestAgeMs ?? 60_000;
  if (isNaN(requestTime) || Math.abs(Date.now() - requestTime) > maxAge) {
    return { ok: false, reason: "Request timestamp is expired or invalid" };
  }

  // 3. Verify ed25519 signature
  const spendAmount = config.spendAmount ?? new BN(0);
  const message = buildMessage(timestampStr, method, path, spendAmount);

  let sigBytes: Uint8Array;
  try {
    sigBytes = bs58.decode(sigStr);
  } catch {
    return { ok: false, reason: "Invalid x-sigil-signature encoding" };
  }

  if (!nacl.sign.detached.verify(message, sigBytes, agentPubkey.toBytes())) {
    return { ok: false, reason: "Signature verification failed" };
  }

  // 4. Verify on-chain Sigil
  const client = new SigilClient({ connection: config.connection, wallet: config.serverWallet });

  const isValid = await client.verifySigil(agentPubkey, {
    principal: principalPubkey,
    requiredCapability: config.requiredCapability,
    maxSpendAmount: spendAmount.isZero() ? undefined : spendAmount,
  });

  if (!isValid) {
    return {
      ok: false,
      reason: config.requiredCapability
        ? `Agent Sigil is invalid, revoked, expired, or lacks the '${config.requiredCapability}' capability`
        : "Agent Sigil is invalid, revoked, or expired",
    };
  }

  // 5. Record the spend on-chain
  if (!spendAmount.isZero()) {
    try {
      await client.recordSpend(agentPubkey, spendAmount, principalPubkey);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, reason: `record_spend failed: ${msg}` };
    }
  }

  return { ok: true, agentPubkey };
}
