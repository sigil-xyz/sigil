import BN from "bn.js";
import type { SigilAccount } from "./types";
import type { Sigil } from "@/types";

export function sigilAccountToUi(s: SigilAccount): Sigil {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = s.expiresAt instanceof BN ? s.expiresAt.toNumber() : Number(s.expiresAt);
  const issuedAt = s.issuedAt instanceof BN ? s.issuedAt.toNumber() : Number(s.issuedAt);
  let status: Sigil["status"] = "active";
  if (s.revoked) status = "revoked";
  else if (expiresAt < now) status = "expired";
  return {
    id: s.pda.toBase58(),
    agentName: s.agentPubkey.toBase58().slice(0, 8) + "...",
    agentPubkey: s.agentPubkey.toBase58(),
    principalPubkey: s.principalPubkey.toBase58(),
    capabilities: s.capabilities.map((c) => c.category as Sigil["capabilities"][number]),
    spendLimitPerTx: (s.spendLimitPerTx instanceof BN ? s.spendLimitPerTx.toNumber() : Number(s.spendLimitPerTx)) / 1_000_000,
    spendLimitPerDay: (s.spendLimitPerDay instanceof BN ? s.spendLimitPerDay.toNumber() : Number(s.spendLimitPerDay)) / 1_000_000,
    spentToday: (s.spentToday instanceof BN ? s.spentToday.toNumber() : Number(s.spentToday)) / 1_000_000,
    stakeAmount: 0,
    reputation: 0,
    issuedAt: new Date(issuedAt * 1000).toISOString(),
    expiresAt: new Date(expiresAt * 1000).toISOString(),
    status,
    attestations: [],
    pdaAddress: s.pda.toBase58(),
  };
}
