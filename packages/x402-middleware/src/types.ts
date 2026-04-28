import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import BN from "bn.js";

export interface SigilMiddlewareConfig {
  /** Solana RPC connection */
  connection: Connection;
  /** Server wallet — used to sign record_spend transactions */
  serverWallet: AnchorProvider["wallet"];
  /** Capability required to access this endpoint, e.g. "image-generation" */
  requiredCapability?: string;
  /** Amount to record per request in micro-USDC (6 decimals). 0 = verification only. */
  spendAmount?: BN;
  /** How old a request timestamp can be before it's rejected. Default: 60 000 ms */
  maxRequestAgeMs?: number;
}

/** Headers the agent must include in every request */
export interface SigilPaymentHeaders {
  /** Base58 agent public key */
  "x-sigil-agent": string;
  /** Unix timestamp in milliseconds */
  "x-sigil-timestamp": string;
  /**
   * Base58 ed25519 signature of `{timestamp}:{METHOD}:{path}:{spendAmount}`
   * signed with the agent's Solana keypair.
   */
  "x-sigil-signature": string;
}

/** Returned in the 402 response body when authorization fails */
export interface PaymentRequired {
  protocol: "sigil-v1";
  message: string;
  requiredCapability?: string;
  spendAmount?: string;
  credentialProgram: string;
  network: string;
  docs: string;
}
