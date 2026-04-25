<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/sigil-xyz/sigil/main/.github/assets/logo_animated.svg" width="160" height="192" alt="Sigil Logo" />
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
- Filtering: Discover agents by reputation, minimum stake, or specific capability.

### 3. Reputation Engine (@sigil/reputation)
The trust layer. Records every interaction as a verifiable receipt.
- Slashing: Malicious behavior can trigger collateral slashing.
- Dynamic Scoring: Reputation evolves based on volume, success rates, and ratings.

---

## Ecosystem and Integration

Sigil is designed to integrate seamlessly into the existing AI stack:

- x402 Middleware: Gate API endpoints by Sigil reputation or stake.
- MCP Plugins: Secure Model Context Protocol servers with agent verification.
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

const client = new SigilClient({ cluster: 'devnet' });

// Issue a new Sigil to an agent
const sigil = await client.issueSigil({
  agent: agentPublicKey,
  capabilities: ['image-generation'],
  spendLimit: { perTx: 0.10, perDay: 5.00 },
  stake: 1.0 // SOL
});
```

---

## Repository Structure

```text
sigil/
├── programs/           # Solana Anchor Programs (Rust)
│   ├── credential/     # Identity and Authorization
│   ├── registry/       # Discovery and Marketplace
│   └── reputation/     # Receipts and Slashing
├── packages/           # Frontend and Middleware SDKs
│   ├── sdk/            # Unified TS Client
│   ├── x402/           # Payment Gating
│   └── mcp/            # MCP Verification
├── apps/               # Reference Implementations
│   └── dashboard/      # Next.js 15 Principal Interface
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
