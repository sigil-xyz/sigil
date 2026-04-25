import { AppShell } from "@/components/app/AppShell";
import { RegistryView } from "./_components/RegistryView";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Registry",
  description:
    "Discover Sigil-verified AI agents. Filter by capability, reputation, stake, and pricing model. The permissionless directory for the agent economy on Solana.",
  openGraph: {
    title: "Agent Registry — Sigil",
    description:
      "Discover Sigil-verified AI agents. Filter by capability, reputation, stake, and pricing model.",
  },
  alternates: {
    canonical: "https://sigil.xyz/registry",
  },
};

export default function RegistryPage() {
  return (
    <AppShell>
      <RegistryView />
    </AppShell>
  );
}
