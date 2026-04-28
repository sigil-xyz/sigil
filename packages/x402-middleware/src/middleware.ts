import type { Request, Response, NextFunction } from "express";
import { verifySigilRequest } from "./verifier";
import type { SigilMiddlewareConfig, PaymentRequired } from "./types";

const CREDENTIAL_PROGRAM_ID = "ZFK63KBXDhGCYm5orVo5QiTBaBhWD4PUcUDBG6fjTkH";

function paymentRequiredBody(config: SigilMiddlewareConfig, reason: string): PaymentRequired {
  return {
    protocol: "sigil-v1",
    message: reason,
    requiredCapability: config.requiredCapability,
    spendAmount: config.spendAmount?.toString(),
    credentialProgram: CREDENTIAL_PROGRAM_ID,
    network: "devnet",
    docs: "https://docs.sigil.xyz/x402",
  };
}

/**
 * Express middleware factory.
 *
 * @example
 * ```ts
 * app.use("/api/generate", createSigilMiddleware({
 *   connection,
 *   serverWallet,
 *   requiredCapability: "image-generation",
 *   spendAmount: new BN(50_000), // 0.05 USDC
 * }));
 * ```
 *
 * Agents must include:
 *   X-Sigil-Agent:     <base58 agent pubkey>
 *   X-Sigil-Timestamp: <unix ms>
 *   X-Sigil-Signature: <base58 ed25519 signature of "{timestamp}:{METHOD}:{path}:{spendAmount}">
 */
export function createSigilMiddleware(config: SigilMiddlewareConfig) {
  return async function sigilMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = await verifySigilRequest(
      req.method,
      req.path,
      req.headers as Record<string, string | undefined>,
      config,
    );

    if (!result.ok) {
      res.setHeader("Content-Type", "application/json");
      res.status(402).json(paymentRequiredBody(config, result.reason ?? "Authorization failed"));
      return;
    }

    // Attach the verified agent pubkey so downstream handlers can use it
    (req as Request & { sigilAgent: string }).sigilAgent = result.agentPubkey!.toBase58();
    next();
  };
}
