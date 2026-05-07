# @sigil-xyz/x402

HTTP middleware for gating API endpoints with [Sigil](https://sigil-three.vercel.app) credentials. Verifies that incoming requests come from credentialed, in-budget AI agents — no separate auth service needed.

## Install

```bash
bun add @sigil-xyz/x402
# or
npm install @sigil-xyz/x402
```

## How it works

Agents attach four signed headers to every request. The middleware verifies the ed25519 signature, checks the on-chain Sigil credential, and records the spend — all in a single call.

```
Agent ──── x-sigil-* headers ────► Your API ◄──── on-chain verification
```

## Express

```ts
import express from 'express';
import { createSigilMiddleware } from '@sigil-xyz/x402';
import { Connection } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

const app = express();

app.post(
  '/api/generate',
  createSigilMiddleware({
    connection: new Connection('https://api.devnet.solana.com'),
    serverWallet,                         // signs recordSpend transactions
    requiredCapability: 'image-generation',
    spendAmount: new BN(50_000),          // 0.05 USDC per request
    network: 'devnet',
  }),
  (req, res) => {
    // req.sigilAgent — verified agent public key (base58)
    res.json({ result: '...' });
  }
);
```

## Next.js (App Router)

```ts
// app/api/generate/route.ts
import { withSigilAuth } from '@sigil-xyz/x402/next';
import { BN } from '@coral-xyz/anchor';

export const POST = withSigilAuth(
  async (req) => {
    return Response.json({ result: '...' });
  },
  {
    connection,
    serverWallet,
    requiredCapability: 'image-generation',
    spendAmount: new BN(50_000),
  }
);
```

## Agent side — building signed headers

```ts
import { buildSigilHeaders } from '@sigil-xyz/x402';
import { BN } from '@coral-xyz/anchor';

const headers = buildSigilHeaders({
  agentKeypair,        // agent's full Keypair (has secretKey)
  principalPubkey,     // the principal that issued the agent's Sigil
  method: 'POST',
  path: '/api/generate',
  spendAmount: new BN(50_000),
});

await fetch('https://api.example.com/api/generate', {
  method: 'POST',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: '...' }),
});
```

## Required headers

| Header | Value |
|--------|-------|
| `x-sigil-agent` | Base58 agent public key |
| `x-sigil-principal` | Base58 principal public key |
| `x-sigil-timestamp` | Unix timestamp in milliseconds |
| `x-sigil-signature` | Base58 ed25519 signature |

## Config

```ts
interface SigilMiddlewareConfig {
  connection: Connection;
  serverWallet: AnchorProvider['wallet'];
  requiredCapability?: string;
  spendAmount?: BN;                                   // default: 0 (verify only)
  maxRequestAgeMs?: number;                           // default: 60_000
  network?: 'devnet' | 'mainnet-beta' | 'testnet';   // default: 'devnet'
}
```

Set `spendAmount` to `0` or omit it to verify credentials without recording a spend.

## Links

- [Documentation](https://sigil-10dddbf2.mintlify.app/x402/overview)
- [GitHub](https://github.com/sigil-xyz/sigil)
- [Dashboard](https://sigil-three.vercel.app/dashboard)
