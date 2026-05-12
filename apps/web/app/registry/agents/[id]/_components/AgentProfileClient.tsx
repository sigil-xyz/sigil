"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Connection } from "@solana/web3.js";
import { SigilClient } from "@/lib/sigil/client";
import { AgentProfileView } from "./AgentProfileView";
import { MOCK_AGENTS, MOCK_TRANSACTIONS, MOCK_REPUTATION_SERIES } from "@/data/mock";
import type { Agent, Transaction, ReputationPoint, CapabilityType } from "@/types";
import type { AgentListingAccount, PricingModel as OnChainPricingModel } from "@/lib/sigil/types";
import BN from "bn.js";

function listingToAgent(l: AgentListingAccount): Agent {
  const pricingModelMap: Record<OnChainPricingModel["kind"], import("@/types").PricingModel> = {
    perCall: "per-call",
    perToken: "per-token",
    subscription: "subscription",
  };
  const m = l.pricingModel;
  const pricingModel = pricingModelMap[m.kind];
  const pricingAmount =
    m.kind === "subscription"
      ? (m.monthly instanceof BN ? m.monthly.toNumber() : Number(m.monthly)) / 1_000_000
      : (m.amount instanceof BN ? m.amount.toNumber() : Number(m.amount)) / 1_000_000;

  const totalTx = l.totalTransactions instanceof BN ? l.totalTransactions.toNumber() : Number(l.totalTransactions);
  const successTx = l.successfulTransactions instanceof BN ? l.successfulTransactions.toNumber() : Number(l.successfulTransactions);
  const lastActive = l.lastActive instanceof BN ? l.lastActive.toNumber() : Number(l.lastActive);

  return {
    id: l.pda.toBase58(),
    name: l.agent.toBase58().slice(0, 8) + "…",
    description: "On-chain verified agent",
    capabilities: l.capabilities.filter(Boolean) as CapabilityType[],
    pricingModel,
    pricingAmount,
    reputation: l.reputationScore / 2000,
    totalTx,
    successRate: totalTx > 0 ? (successTx / totalTx) * 100 : 100,
    avgRating: 0,
    stakeAmount: 0,
    lastActive: lastActive > 0 ? new Date(lastActive * 1000).toISOString() : new Date().toISOString(),
    sigilId: l.sigil.toBase58(),
  };
}

function createReadonlyClient(connection: Connection) {
  const dummy = Keypair.generate();
  return new SigilClient({
    connection,
    wallet: {
      publicKey: dummy.publicKey,
      signTransaction: async <T,>(tx: T) => tx,
      signAllTransactions: async <T,>(txs: T[]) => txs,
    } as never,
  });
}

async function fetchTxHistory(
  connection: Connection,
  sigilPda: PublicKey,
  agentId: string,
  capability: CapabilityType,
  pricePerCall: number,
): Promise<Transaction[]> {
  try {
    const sigs = await connection.getSignaturesForAddress(sigilPda, { limit: 25 });
    return sigs
      .filter((s) => !s.err)
      .map((s) => ({
        id: s.signature,
        agentId,
        capability,
        amount: pricePerCall,
        successful: true,
        rating: null,
        timestamp: new Date((s.blockTime ?? Date.now() / 1000) * 1000).toISOString(),
      }));
  } catch {
    return [];
  }
}

export function AgentProfileClient({ id }: { id: string }) {
  const { connection } = useConnection();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reputationSeries] = useState<ReputationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Check mock agents first
    const mock = MOCK_AGENTS.find((a) => a.id === id);
    if (mock) {
      setAgent(mock);
      setTransactions(MOCK_TRANSACTIONS.filter((t) => t.agentId === mock.id));
      setLoading(false);
      return;
    }

    // Fetch from on-chain registry
    async function fetchFromChain() {
      try {
        const client = createReadonlyClient(connection);
        const listings = await client.discover({ activeOnly: false });
        const match = listings.find((l) => l.pda.toBase58() === id);
        if (match) {
          const mappedAgent = listingToAgent(match);
          setAgent(mappedAgent);

          // Fetch real tx history — Agent A signs every record_spend as authority,
          // so querying Agent A's pubkey returns all calls it served.
          const capability = mappedAgent.capabilities[0] ?? "data-analysis" as CapabilityType;
          const txs = await fetchTxHistory(
            connection,
            match.agent,
            mappedAgent.id,
            capability,
            mappedAgent.pricingAmount,
          );
          setTransactions(txs);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchFromChain();
  }, [id, connection]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground/40 uppercase animate-pulse">
          Resolving node...
        </span>
      </div>
    );
  }

  if (notFound || !agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground/40 uppercase">
          Node not found
        </span>
        <a
          href="/registry"
          className="font-mono text-[11px] text-foreground uppercase tracking-widest border-b border-foreground/20 pb-0.5"
        >
          Back to Registry
        </a>
      </div>
    );
  }

  const repData = reputationSeries.length > 0
    ? reputationSeries
    : (MOCK_REPUTATION_SERIES[agent.id] ?? []);

  return (
    <AgentProfileView
      agent={agent}
      transactions={transactions}
      reputationSeries={repData}
    />
  );
}
