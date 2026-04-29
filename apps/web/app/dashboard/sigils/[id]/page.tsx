"use client";

import { use } from "react";
import { AppShell } from "@/components/app/AppShell";
import { SigilDetailView } from "./_components/SigilDetailView";
import { useSigils } from "@/hooks/useSigils";
import { useWallet } from "@solana/wallet-adapter-react";
import { MOCK_SIGILS } from "@/data/mock";
import { sigilAccountToUi } from "@/lib/sigil/accountToUi";

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
