# @sigil-xyz/sdk

TypeScript SDK for the [Sigil protocol](https://sigil-three.vercel.app) — cryptographic identity and trust infrastructure for AI agents on Solana.

## Install

```bash
bun add @sigil-xyz/sdk
# or
npm install @sigil-xyz/sdk
```

**Peer dependencies**

```bash
bun add @coral-xyz/anchor @solana/web3.js bn.js
```

## Usage

```ts
import { SigilClient } from '@sigil-xyz/sdk';
import { Connection } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

const client = new SigilClient({
  connection: new Connection('https://api.devnet.solana.com'),
  wallet: principalWallet, // AnchorProvider-compatible wallet
});

// Issue a Sigil credential to an agent
const tx = await client.issueSigil({
  agent: agentPublicKey,
  capabilities: [{ category: 'image-generation', allowedDomains: [] }],
  spendLimits: {
    perTx: new BN(100_000),   // micro-USDC per transaction
    perDay: new BN(5_000_000), // micro-USDC per day
  },
  expiresAt: Math.floor(Date.now() / 1000) + 86_400 * 30, // 30 days
});

// Verify an agent's credential
const valid = await client.verifySigil(agentPublicKey, {
  principal: principalPublicKey,
  requiredCapability: 'image-generation',
});

// Discover agents from the on-chain registry
const agents = await client.discover({
  capability: 'image-generation',
  minReputationScore: 7000,
});
```

## API

### `new SigilClient(config)`

| Param | Type | Description |
|-------|------|-------------|
| `connection` | `Connection` | Solana RPC connection |
| `wallet` | `AnchorProvider['wallet']` | Principal wallet (signs transactions) |

### Credential methods

| Method | Description |
|--------|-------------|
| `issueSigil(args)` | Issue a new Sigil credential to an agent |
| `revokeSigil(agent)` | Revoke an agent's credential |
| `updateSigil(args)` | Update spend limits or expiry |
| `verifySigil(agent, opts?)` | Verify a credential on-chain, returns `boolean` |
| `recordSpend(agent, amount)` | Record a spend against the agent's daily limit |

### Registry methods

| Method | Description |
|--------|-------------|
| `listAgent(args)` | Register an agent in the on-chain directory |
| `updateListing(args)` | Update an existing listing |
| `deactivateListing(sigil)` | Hide an agent from discovery |
| `discover(opts?)` | Fetch and filter all active listings |

## Programs (devnet)

| Program | Address |
|---------|---------|
| Credential | `ZFK63KBXDhGCYm5orVo5QiTBaBhWD4PUcUDBG6fjTkH` |
| Registry | `Ecmeikh16PZNtNUY5ZTQAKLSdkQWpx6uRo6gUTkoBURW` |

## Links

- [Dashboard](https://sigil-three.vercel.app/dashboard)
- [Documentation](https://sigil-10dddbf2.mintlify.app/introduction)
- [GitHub](https://github.com/sigil-xyz/sigil)
