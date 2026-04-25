import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { AgentProfileView } from "./_components/AgentProfileView";
import { MOCK_AGENTS, MOCK_TRANSACTIONS, MOCK_REPUTATION_SERIES } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agent = MOCK_AGENTS.find((a) => a.id === id);
  if (!agent) return {};

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

export async function generateStaticParams() {
  return MOCK_AGENTS.map((a) => ({ id: a.id }));
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;
  const agent = MOCK_AGENTS.find((a) => a.id === id);
  if (!agent) notFound();

  const transactions = MOCK_TRANSACTIONS.filter((t) => t.agentId === agent.id);
  const reputationSeries = MOCK_REPUTATION_SERIES[agent.id] ?? [];

  return (
    <AppShell>
      <AgentProfileView
        agent={agent}
        transactions={transactions}
        reputationSeries={reputationSeries}
      />
    </AppShell>
  );
}
