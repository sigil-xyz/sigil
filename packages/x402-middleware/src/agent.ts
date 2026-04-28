import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import BN from "bn.js";

interface BuildHeadersArgs {
  agentKeypair: Keypair;
  method: string;
  path: string;
  spendAmount?: BN;
}

/**
 * Builds the x-sigil-* headers an agent must attach to every authenticated request.
 * Call this in the agent's HTTP client before sending a request.
 */
export function buildSigilHeaders(args: BuildHeadersArgs): Record<string, string> {
  const { agentKeypair, method, path, spendAmount = new BN(0) } = args;
  const timestamp = Date.now().toString();
  const message = new TextEncoder().encode(
    `${timestamp}:${method.toUpperCase()}:${path}:${spendAmount.toString()}`
  );
  const signature = nacl.sign.detached(message, agentKeypair.secretKey);

  return {
    "x-sigil-agent": agentKeypair.publicKey.toBase58(),
    "x-sigil-timestamp": timestamp,
    "x-sigil-signature": bs58.encode(signature),
  };
}
