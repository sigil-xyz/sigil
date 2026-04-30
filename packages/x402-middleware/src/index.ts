export { createSigilMiddleware } from "./middleware";
export { verifySigilRequest } from "./verifier";
export type { SigilMiddlewareConfig, SigilPaymentHeaders, PaymentRequired } from "./types";
export type { VerifyResult } from "./verifier";

/**
 * Helper to build the signed request headers an agent needs to attach.
 * Requires the agent's full Keypair (has secretKey).
 *
 * @example
 * ```ts
 * import { buildSigilHeaders } from "@sigil-xyz/x402";
 * import { Keypair } from "@solana/web3.js";
 * import BN from "bn.js";
 *
 * const headers = buildSigilHeaders({
 *   agentKeypair: myAgentKeypair,
 *   method: "POST",
 *   path: "/api/generate",
 *   spendAmount: new BN(50_000),
 * });
 * // Attach headers to your fetch call
 * ```
 */
export { buildSigilHeaders } from "./agent";
