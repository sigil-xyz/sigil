<div align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/sigil-xyz/sigil/main/apps/docs/logo/dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/sigil-xyz/sigil/main/apps/docs/logo/light.svg">
    <img src="https://raw.githubusercontent.com/sigil-xyz/sigil/main/apps/docs/logo/light.svg" width="165" height="48" alt="Sigil Logo" />
  </picture>
  <br />
  <h1>SIGIL</h1>
  <p align="center">
    <strong>The Cryptographic Identity and Trust Layer for the AI Agent Economy</strong>
  </p>

  <p align="center">
    <a href="https://sigil.xyz"><strong>Website</strong></a> |
    <a href="https://dashboard.sigil.xyz"><strong>Dashboard</strong></a> |
    <a href="https://docs.sigil.xyz"><strong>Documentation</strong></a>
  </p>

  <div align="center">
    <img src="https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-6B46C1?style=for-the-badge" />
    <img src="https://img.shields.io/badge/TypeScript-SDK-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Status-Alpha-F59E0B?style=for-the-badge" />
  </div>
  <br />
</div>

---

### Every agent needs a Sigil.

In the rapidly expanding autonomous economy, AI agents can pay, but they cannot yet verify trust. Sigil provides the essential primitives for the agentic era: Identity, Authorization, and Reputation.

Inspired by the magical seals of antiquity, a Sigil is a cryptographically signed credential on Solana that binds an agent to its principal, defines its operational boundaries, and stakes collateral against its integrity.

---

## The KYA Primitive (Know Your Agent)

Sigil addresses the critical bottlenecks of the agent economy as identified in recent industry theses:

*   Identity Crisis: Cryptographically prove an agent belongs to a known principal (human or company).
*   Discovery Problem: An on-chain directory for agents to advertise capabilities and get discovered.
*   Reputation Vacuum: Verifiable transaction history and deterministic trust scores.
*   Liability Uncertainty: Bounded spending limits and staked collateral for dispute resolution.

---

## Technical Architecture

Sigil is built as a modular protocol on Solana, consisting of three core programs:

### 1. Sigil Credentials (@sigil/credential)
The identity core. Issues on-chain PDAs that store agent metadata, principal links, and cryptographic attestations.
- Spend Limits: Hard-coded constraints for per-transaction and daily volume.
- Capability Scoping: Restricts agent authority to specific domains or toolsets.

### 2. Sigil Registry (@sigil/registry)
The discovery layer. A public marketplace where agents list their services, pricing models, and endpoints.
- Filtering: Discover agents by reputation score, pricing model, or specific capability.

### 3. Reputation Engine (@sigil/reputation)
The trust layer. Records every interaction as a verifiable receipt.
- Dynamic Scoring: Reputation score updates on every verified transaction (success rate based).
- Slashing and staked collateral: On the roadmap.

---

## Ecosystem and Integration

Sigil is designed to integrate seamlessly into the existing AI stack:

- x402 Middleware: Gate API endpoints by Sigil credential and spend limits.
- TypeScript SDK: A unified client for issuing, discovering, and verifying Sigils.

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/sigil-xyz/sigil && cd sigil

# Install workspace dependencies
bun install

# Build Anchor programs
anchor build
```

### Quick Usage (SDK)

```typescript
import { SigilClient } from '@sigil/sdk';
import { Connection } from '@solana/web3.js';
import BN from 'bn.js';

const client = new SigilClient({
  connection: new Connection('https://api.devnet.solana.com'),
  wallet: principalWallet,
});

// Issue a new Sigil to an agent
const txSig = await client.issueSigil({
  agent: agentPublicKey,
  capabilities: [{ category: 'image-generation', allowedDomains: [] }],
  spendLimits: {
    perTx: new BN(100_000),  // 0.10 USDC (6 decimals)
    perDay: new BN(5_000_000), // 5.00 USDC
  },
  expiresAt: new BN(Math.floor(Date.now() / 1000) + 86_400 * 30), // 30 days
});
```

---

## Repository Structure

```text
sigil/
├── programs/           # Solana Anchor Programs (Rust)
│   ├── credential/     # Identity and Authorization
│   ├── registry/       # Discovery and Marketplace
│   └── reputation/     # Receipts (in development)
├── packages/           # SDKs and Middleware
│   ├── sdk/            # Unified TypeScript Client
│   └── x402-middleware/ # Express / Next.js Payment Gating
├── apps/               # Reference Implementations
│   ├── web/            # Next.js Principal Dashboard + Landing
│   └── docs/           # Mintlify documentation site
└── Anchor.toml         # Program configuration
```

---

<div align="center">
  <p>Built for the 2026 Agent Economy by Sigil Protocol.</p>
  <p>
    <a href="https://sigil.xyz">sigil.xyz</a> | 
    <a href="https://twitter.com/sigilprotocol">Twitter</a> | 
    <a href="https://github.com/sigil-xyz">GitHub</a>
  </p>
</div>
