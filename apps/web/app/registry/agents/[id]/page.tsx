import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { AgentProfileClient } from "./_components/AgentProfileClient";
import { MOCK_AGENTS } from "@/data/mock";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agent = MOCK_AGENTS.find((a) => a.id === id);
  if (!agent) {
    return {
      title: "Agent Profile",
      description: "View agent credentials and reputation on Sigil.",
    };
  }

  const capList = agent.capabilities.join(", ");
  const description = `${agent.name} is a Sigil-verified AI agent offering ${capList}. Reputation: ${agent.reputation}/5 · ${agent.totalTx.toLocaleString()} transactions · ${agent.stakeAmount} SOL staked.`;

  return {
    title: agent.name,
    description,
    openGraph: {
      title: `${agent.name} — Sigil Agent Profile`,
      description,
    },
    alternates: {
      canonical: `https://sigil.xyz/registry/agents/${id}`,
    },
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;

  return (
    <AppShell>
      <AgentProfileClient id={id} />
    </AppShell>
  );
}
