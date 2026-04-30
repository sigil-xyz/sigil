# Audit Bug Fix Plan

## Batch 1 — Config / Infrastructure
- [ ] .gitignore: add .claude/, test-ledger/, fix bun.lock entry
- [ ] Add "license": "MIT" to root, sdk, x402, web package.json
- [ ] Fix Anchor version mismatch: align to ^0.31.0 in x402 package.json

## Batch 2 — TypeScript SDK
- [ ] Create encodeString128 utility in packages/sdk/src/utils.ts
- [ ] Use encodeString128 for endpointUrl in listAgent + updateListing
- [ ] Mirror the fix in apps/web/lib/sigil/client.ts
- [ ] Add recordSpend wrapper method to SigilClient
- [ ] Fix BN.toNumber() → BN comparison in verifySigil expiry check
- [ ] Fix decodePricingModel: add explicit guard + throw for unknown variants
- [ ] Fix as never casts → typed BN

## Batch 3 — x402 Middleware
- [ ] Add x-sigil-principal to buildSigilHeaders in agent.ts
- [ ] Fix hardcoded "devnet" → derive from config in middleware.ts + next.ts
- [ ] Add network field to SigilMiddlewareConfig type
- [ ] Fix file: path issue in package.json (note: don't break local dev, add comment)

## Batch 4 — Rust Programs
- [ ] Fix .unwrap() → .ok_or(error)? in record_spend.rs and update_stats.rs
- [ ] Add ArithmeticOverflow error variant to error.rs files
- [ ] Fix test PDA seeds in test_credential.rs (add principal seed)
- [ ] Add expires_at check to update_sigil.rs

## Batch 5 — Web App
- [ ] Fix SpendBar division-by-zero
- [ ] Extract sigilAccountToUi to shared lib file, remove duplication
- [ ] Fix sitemap.ts — remove dynamic mock routes
- [ ] Fix registry mock fallback — don't show mock during loading
- [ ] Fix PrincipalProvider — don't init from MOCK_PRINCIPAL
- [ ] Add Backpack + Solflare wallet adapters
- [ ] Add error.tsx + global-error.tsx
- [ ] Fix listingToAgent — don't use endpointUrl as description
- [ ] Fix OG image — remove fake stats
- [ ] Fix DashboardView "$4.2M" hardcoded stat

## Batch 6 — Docs & Content
- [x] Fix README Quick Usage example (constructor, args, return type) — expiresAt was BN, now number
- [x] Fix README repo structure (add apps/docs, remove packages/mcp) — already correct
- [x] Fix README tagline "Built for the 2026 Agent Economy" — removed year
- [x] Fix concepts/registry.mdx: endpointUrl 64→128 bytes — already correct
- [x] Fix concepts/registry.mdx: reputationScore u16→u32 — already correct
- [x] Label slashing/staking as roadmap in docs/introduction.mdx + concepts/reputation.mdx — already done
- [x] Label MCP as coming soon or remove from README — already removed
- [x] Fix x402/overview.mdx: add x-sigil-principal to headers table — already present
- [x] Fix AGENTS.md: remove invalid node_modules/next/dist/docs/ path — already clean
- [x] Fix Footer links: Blog, Privacy, Terms — Blog→GitHub discussions, Privacy/Terms→email, all valid
- [x] Fix update_stats.rs comment re: demo shortcut — comment already accurate
- [x] Fix StatsSection fake stat descriptions ("live on mainnet" → "at scale")
- [x] Update README links to vercel/mintlify URLs

## Status
- Started: 2026-04-29
