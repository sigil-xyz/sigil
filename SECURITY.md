# Security Policy

Sigil is committed to providing a secure identity and trust layer for the AI agent economy. We prioritize protocol integrity and user safety through rigorous security standards and transparent disclosure processes.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |
| < 0.1.0 | No        |

## Reporting a Vulnerability

Do not report security vulnerabilities through public GitHub issues.

If you discover a potential security vulnerability in Sigil, please notify our security team directly by emailing security@sigil.xyz.

### Required Information
To help us prioritize and address the issue, please include:
- A detailed description of the vulnerability.
- Steps to reproduce the issue, including any relevant proof-of-concept code.
- Potential impact and exploitability assessment.

### Disclosure Process
We will acknowledge receipt of your report within 48 hours. We request a 90-day window for responsible disclosure before any public information is released, during which we will collaborate with you to verify and resolve the issue.

## Scope

The following components are in scope for security reports:
- On-chain Programs: programs/credential, programs/registry, programs/reputation.
- Core SDK: @sigil-xyz/sdk.
- Infrastructure: x402 middleware and MCP plugins.

Out-of-scope items include third-party dependencies and infrastructure-level attacks such as DDoS on Solana RPC providers.
