"use client";

import { use } from "react";
import { AppShell } from "@/components/app/AppShell";
import { SigilDetailView } from "./_components/SigilDetailView";
import { useSigils } from "@/hooks/useSigils";
import { useWallet } from "@solana/wallet-adapter-react";
import { MOCK_SIGILS } from "@/data/mock";
import BN from "bn.js";
import type { SigilAccount } from "@/lib/sigil/types";
import type { Sigil } from "@/types";

function sigilAccountToUi(s: SigilAccount): Sigil {
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

interface Props {
  params: Promise<{ id: string }>;
}

export default function SigilDetailPage({ params }: Props) {
  const { id } = use(params);
  const { connected } = useWallet();
  const { sigils: onChainSigils, loading } = useSigils();

  if (connected) {
    if (loading) {
      return (
        <AppShell>
          <div className="max-w-7xl mx-auto px-6 py-24 flex items-center justify-center">
            <span className="font-mono text-[11px] text-muted-foreground/40 uppercase tracking-widest animate-pulse">
              Fetching sigil…
            </span>
          </div>
        </AppShell>
      );
    }

    const account = onChainSigils.find((s) => s.pda.toBase58() === id);
    if (account) {
      return (
        <AppShell>
          <SigilDetailView sigil={sigilAccountToUi(account)} />
        </AppShell>
      );
    }
  }

  // Fallback: mock lookup for demo / disconnected state
  const sigil = MOCK_SIGILS.find((s) => s.id === id);
  if (!sigil) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-6 py-24 flex items-center justify-center">
          <span className="font-mono text-[11px] text-muted-foreground/40 uppercase tracking-widest">
            Sigil not found
          </span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <SigilDetailView sigil={sigil} />
    </AppShell>
  );
}
