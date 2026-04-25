"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { CapabilityBadge } from "@/components/app/CapabilityBadge";
import { ReputationStars } from "@/components/app/ReputationStars";
import { SectionReveal } from "@/components/app/SectionReveal";
import { ReputationChart } from "./ReputationChart";
import type { Agent, Transaction, ReputationPoint } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface AgentProfileViewProps {
  agent: Agent;
  transactions: Transaction[];
  reputationSeries: ReputationPoint[];
}

export function AgentProfileView({ agent, transactions, reputationSeries }: AgentProfileViewProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const pageTxs = transactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <SectionReveal>
        <Link
          href="/registry"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/50 hover:text-foreground/60 transition-colors mb-8"
        >
          <ChevronLeft size={12} />
          Registry
        </Link>
      </SectionReveal>

      {/* Hero */}
      <SectionReveal delay={0.03}>
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="hero-display text-[clamp(2rem,4vw,3rem)] text-foreground leading-none">
              {agent.name}
            </h1>
            {agent.sigilId && (
              <span className="font-mono text-[10px] tracking-wider px-3 py-1 rounded-full border border-green-500/20 bg-green-500/6 text-green-600 shrink-0 mt-1">
                Sigil Verified
              </span>
            )}
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl mb-4">
            {agent.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <CapabilityBadge key={cap} capability={cap} />
            ))}
          </div>
        </div>
      </SectionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          {/* Reputation chart */}
          <SectionReveal delay={0.06}>
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase">
                  30-Day Reputation
                </div>
                <ReputationStars score={agent.reputation} />
              </div>
              <ReputationChart data={reputationSeries} />
            </div>
          </SectionReveal>

          {/* Transaction history */}
          <SectionReveal delay={0.1}>
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase">
                  Transaction History
                </div>
                <span className="font-mono text-[11px] text-muted-foreground/40 tabular-nums">
                  {transactions.length} total
                </span>
              </div>

              {pageTxs.length === 0 ? (
                <div className="px-5 py-8 text-center text-[13px] text-muted-foreground/50">
                  No transactions
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pageTxs.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="px-5 py-3.5 flex items-center gap-4"
                    >
                      <div className="shrink-0">
                        {tx.successful ? (
                          <CheckCircle size={14} className="text-green-500" />
                        ) : (
                          <XCircle size={14} className="text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CapabilityBadge capability={tx.capability} />
                          <span className="font-mono text-[11px] text-muted-foreground/40 tabular-nums">
                            ${tx.amount.toFixed(4)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {tx.rating && (
                          <div className="font-mono text-[11px] text-muted-foreground/60 tabular-nums">
                            ★ {tx.rating.toFixed(1)}
                          </div>
                        )}
                        <div className="font-mono text-[10px] text-muted-foreground/30">
                          {formatDate(tx.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="font-mono text-[11px] text-muted-foreground/50 hover:text-foreground/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <span className="font-mono text-[11px] text-muted-foreground/40 tabular-nums">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="font-mono text-[11px] text-muted-foreground/50 hover:text-foreground/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </SectionReveal>
        </div>

        {/* Right — stats */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <SectionReveal delay={0.05}>
              <div className="border border-border rounded-xl p-6 bg-card space-y-5">
                <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase">
                  Stats
                </div>

                {[
                  { label: "Total Tx", value: agent.totalTx.toLocaleString() },
                  { label: "Success Rate", value: `${agent.successRate}%` },
                  { label: "Avg Rating", value: agent.avgRating.toFixed(1) },
                  { label: "Stake", value: `${agent.stakeAmount} SOL` },
                  { label: "Last Active", value: formatRelative(agent.lastActive) },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground/40 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <span className="font-mono text-[13px] text-foreground/80 tabular-nums">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.08}>
              <div className="border border-border rounded-xl p-6 bg-card">
                <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase mb-4">
                  Pricing
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[1.8rem] font-medium text-foreground tabular-nums leading-none">
                    ${agent.pricingAmount}
                  </span>
                  <span className="font-mono text-[12px] text-muted-foreground/50">
                    {agent.pricingModel === "subscription"
                      ? "/ month"
                      : agent.pricingModel === "per-call"
                      ? "/ call"
                      : "/ token"}
                  </span>
                </div>
                <div
                  className={cn(
                    "mt-3 font-mono text-[10px] px-2 py-0.5 rounded-full border w-fit",
                    "border-border text-muted-foreground/50"
                  )}
                >
                  {agent.pricingModel}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
