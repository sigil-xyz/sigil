import { NextRequest, NextResponse } from "next/server";
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
    network: config.network ?? "devnet",
    docs: "https://docs.sigil.xyz/x402",
  };
}

type NextRouteHandler = (
  req: NextRequest & { sigilAgent?: string },
  ctx: { params: Promise<Record<string, string>> }
) => Promise<NextResponse | Response>;

/**
 * Next.js App Router wrapper.
 *
 * @example
 * ```ts
 * // app/api/generate/route.ts
 * import { withSigilAuth } from "@sigil/x402/next";
 *
 * export const POST = withSigilAuth(
 *   async (req) => {
 *     // req.sigilAgent is the verified agent pubkey
 *     return NextResponse.json({ result: "..." });
 *   },
 *   { connection, serverWallet, requiredCapability: "image-generation", spendAmount: new BN(50_000) }
 * );
 * ```
 */
export function withSigilAuth(handler: NextRouteHandler, config: SigilMiddlewareConfig): NextRouteHandler {
  return async function (req, ctx) {
    const url = new URL(req.url);
    const headersObj: Record<string, string> = {};
    req.headers.forEach((value, key) => { headersObj[key] = value; });

    const result = await verifySigilRequest(req.method, url.pathname, headersObj, config);

    if (!result.ok) {
      return NextResponse.json(paymentRequiredBody(config, result.reason ?? "Authorization failed"), {
        status: 402,
      });
    }

    (req as NextRequest & { sigilAgent?: string }).sigilAgent = result.agentPubkey!.toBase58();
    return handler(req, ctx);
  };
}
