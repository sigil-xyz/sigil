"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ArrowUpRight, Globe, Zap, Cpu, Activity, ShieldCheck, Database } from "lucide-react";
import { CapabilityBadge } from "@/components/app/CapabilityBadge";
import { ReputationStars } from "@/components/app/ReputationStars";
import { SectionReveal } from "@/components/app/SectionReveal";
import { MOCK_AGENTS } from "@/data/mock";
import type { Agent, CapabilityType, PricingModel } from "@/types";
import { cn } from "@/lib/utils";

const ALL_CAPABILITIES: CapabilityType[] = [
  "image-generation",
  "code-review",
  "translation",
  "data-analysis",
  "ocr",
  "audio-transcription",
  "web-search",
  "document-processing",
];

const ALL_PRICING: PricingModel[] = ["per-call", "subscription", "per-token"];

const SORT_OPTIONS = [
  { value: "reputation", label: "Reputation Score" },
  { value: "stake", label: "Protocol Stake" },
  { value: "price", label: "Compute Cost" },
  { value: "activity", label: "Node Activity" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

function AgentNode({ agent, index }: { agent: Agent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      layout
    >
      <Link href={`/registry/agents/${agent.id}`}>
        <div className="group border-b border-border/40 p-6 md:p-8 hover:bg-foreground/[0.015] transition-all cursor-pointer relative">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Identity Column */}
            <div className="md:col-span-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/60 uppercase flex items-center gap-2">
                  <Cpu size={12} strokeWidth={2} className="text-foreground/40" />
                  {agent.id.slice(0, 8)}
                </span>
                {agent.sigilId && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <h3 className="hero-display text-[2rem] leading-[1] tracking-tight text-foreground group-hover:text-foreground/80 transition-colors">
                {agent.name}
              </h3>
            </div>

            {/* Description & Capabilities Column */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <p className="text-[13px] text-muted-foreground/80 leading-relaxed line-clamp-2 pr-4 font-serif italic">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {agent.capabilities.slice(0, 3).map((cap) => (
                  <CapabilityBadge key={cap} capability={cap} className="bg-transparent border-border/40 text-[9px] uppercase tracking-widest" />
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="font-mono text-[9px] text-muted-foreground/40 px-2 py-0.5">
                    +{agent.capabilities.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics Column */}
            <div className="md:col-span-3 flex flex-col items-start md:items-end gap-4 md:pr-10">
              <div className="flex items-center gap-6 text-left md:text-right">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/60 uppercase mb-1 flex items-center md:justify-end gap-1.5">
                    <Activity size={12} strokeWidth={2} className="text-foreground/40" />
                    Reputation
                  </span>
                  <span className="font-mono text-[16px] text-foreground tabular-nums">
                    {agent.reputation.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/60 uppercase mb-1 flex items-center md:justify-end gap-1.5">
                    <ShieldCheck size={12} strokeWidth={2} className="text-foreground/40" />
                    Stake
                  </span>
                  <span className="font-mono text-[16px] text-foreground tabular-nums">
                    {agent.stakeAmount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                <Database size={12} strokeWidth={2} className="text-muted-foreground/50" />
                <span className="text-muted-foreground/60">Cost:</span>
                <span className="text-foreground font-medium">
                  {agent.pricingModel === "subscription"
                    ? `$${agent.pricingAmount}/mo`
                    : agent.pricingModel === "per-call"
                    ? `$${agent.pricingAmount}/call`
                    : `$${agent.pricingAmount}/tok`}
                </span>
              </div>
            </div>
            
            <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-border/40 bg-background">
               <ArrowUpRight size={14} strokeWidth={1.5} className="text-foreground/50" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function RegistryView() {
  const [query, setQuery] = useState("");
  const [selectedCaps, setSelectedCaps] = useState<Set<CapabilityType>>(new Set());
  const [selectedPricing, setSelectedPricing] = useState<Set<PricingModel>>(new Set());
  const [minReputation, setMinReputation] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("reputation");
  const [filtersOpen, setFiltersOpen] = useState(false);

  function toggleCap(cap: CapabilityType) {
    setSelectedCaps((prev) => {
      const next = new Set(prev);
      next.has(cap) ? next.delete(cap) : next.add(cap);
      return next;
    });
  }

  function togglePricing(p: PricingModel) {
    setSelectedPricing((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  }

  function resetFilters() {
    setQuery("");
    setSelectedCaps(new Set());
    setSelectedPricing(new Set());
    setMinReputation(0);
    setSortKey("reputation");
  }

  const filtered = useMemo(() => {
    const agents = MOCK_AGENTS.filter((a) => {
      if (query && !a.name.toLowerCase().includes(query.toLowerCase()) &&
          !a.description.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCaps.size > 0 && !a.capabilities.some((c) => selectedCaps.has(c))) return false;
      if (selectedPricing.size > 0 && !selectedPricing.has(a.pricingModel)) return false;
      if (a.reputation < minReputation) return false;
      return true;
    });

    agents.sort((a, b) => {
      if (sortKey === "reputation") return b.reputation - a.reputation;
      if (sortKey === "stake") return b.stakeAmount - a.stakeAmount;
      if (sortKey === "price") return a.pricingAmount - b.pricingAmount;
      if (sortKey === "activity") return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      return 0;
    });

    return agents;
  }, [query, selectedCaps, selectedPricing, minReputation, sortKey]);

  const hasFilters = query || selectedCaps.size > 0 || selectedPricing.size > 0 || minReputation > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Structural Top Border */}
      <div className="h-px w-full bg-border/40 mb-12" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Cinematic Header */}
        <SectionReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                  Global State
                </span>
                <div className="w-1 h-1 rounded-full bg-foreground/20" />
                <span className="font-mono text-[9px] tracking-[0.25em] text-foreground/60 uppercase flex items-center gap-2">
                  <Globe size={12} strokeWidth={2} className="text-foreground/40" />
                  Node Directory
                </span>
              </div>
              <h1 className="hero-display text-[clamp(3.5rem,6vw,5.5rem)] text-foreground leading-[0.95] tracking-tight">
                Permissionless<br />
                <span className="italic text-muted-foreground/60">Marketplace.</span>
              </h1>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-2 text-left lg:text-right">
              <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                Active Nodes
              </div>
              <div className="font-mono text-[2rem] font-light text-foreground tabular-nums leading-none flex items-center gap-4 lg:justify-end">
                <Activity size={24} strokeWidth={1.5} className="text-emerald-500 animate-pulse" />
                1,402
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Command Palette Style Search */}
        <SectionReveal delay={0.04}>
          <div className="flex flex-col lg:flex-row gap-0 border border-border/40 bg-foreground/[0.01] mb-12 relative z-20 shadow-sm">
            <div className="relative flex-1 group border-b lg:border-b-0 lg:border-r border-border/40">
              <Search size={18} strokeWidth={2} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-foreground transition-colors" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Query nodes by signature, capability, or provider..."
                className="w-full h-16 md:h-20 pl-16 pr-6 bg-transparent text-foreground text-[13px] md:text-[14px] font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.02] transition-colors"
              />
            </div>
            <div className="flex divide-x divide-border/40">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={cn(
                  "flex-1 lg:flex-none h-16 md:h-20 px-6 md:px-10 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors",
                  filtersOpen || hasFilters
                    ? "bg-foreground/5 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02]"
                )}
              >
                <SlidersHorizontal size={16} strokeWidth={2} />
                <span className="hidden sm:inline">Parameters</span>
                {hasFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
              <div className="flex-1 lg:flex-none relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="w-full h-16 md:h-20 pl-6 md:pl-10 pr-12 bg-transparent text-foreground text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] focus:outline-none hover:bg-foreground/[0.02] transition-colors appearance-none cursor-pointer font-bold"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <X size={14} className="rotate-45" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Filter Matrix (Expanded) */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mb-12 -mt-12 relative z-10"
            >
              <div className="pt-12 border-x border-b border-border/40 bg-foreground/[0.005] p-8 md:p-10 space-y-10">
                <div className="flex items-center justify-between border-b border-border/20 pb-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                    Configuration Matrix
                  </span>
                  {hasFilters && (
                    <button
                      onClick={resetFilters}
                      className="font-mono text-[9px] text-muted-foreground/60 hover:text-foreground transition-colors flex items-center gap-2 uppercase tracking-widest"
                    >
                      <X size={14} strokeWidth={2.5} /> Reset Matrix
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
                      Compute Capabilities
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CAPABILITIES.map((cap) => (
                        <button
                          key={cap}
                          onClick={() => toggleCap(cap)}
                          className={cn(
                            "font-mono text-[10px] tracking-wide px-4 py-2 border transition-all uppercase",
                            selectedCaps.has(cap) 
                              ? "border-foreground/40 bg-foreground/10 text-foreground font-bold" 
                              : "border-border/40 text-muted-foreground/50 hover:border-border hover:text-muted-foreground"
                          )}
                        >
                          {cap.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 space-y-4">
                    <div className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
                      Cost Structure
                    </div>
                    <div className="flex flex-col gap-2">
                      {ALL_PRICING.map((p) => (
                        <button
                          key={p}
                          onClick={() => togglePricing(p)}
                          className={cn(
                            "font-mono text-[10px] px-5 py-2.5 border transition-all uppercase tracking-widest text-left",
                            selectedPricing.has(p)
                              ? "border-foreground/40 bg-foreground/10 text-foreground font-bold"
                              : "border-border/40 text-muted-foreground/50 hover:border-border hover:text-muted-foreground"
                          )}
                        >
                          {p.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
                        Min Reputation
                      </div>
                      <span className="font-mono text-[12px] text-foreground tabular-nums font-bold">
                        {minReputation.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={minReputation}
                      onChange={(e) => setMinReputation(parseFloat(e.target.value))}
                      className="w-full accent-foreground h-1 bg-border/40 appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List Display */}
        <div className="border-t border-border/40">
          {filtered.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center bg-foreground/[0.005]">
              <Zap size={48} strokeWidth={1} className="text-muted-foreground/10 mb-8" />
              <span className="font-mono text-[12px] text-muted-foreground/60 mb-4 tracking-widest uppercase">
                NULL_RESULT_SET
              </span>
              <h3 className="hero-display text-[2.5rem] text-foreground mb-8">
                No active nodes found.
              </h3>
              <button
                onClick={resetFilters}
                className="font-mono text-[11px] text-foreground hover:text-foreground/70 transition-colors uppercase tracking-[0.3em] border-b-2 border-foreground/20 pb-1 font-bold"
              >
                Clear Matrix Parameters
              </button>
            </div>
          ) : (
            <motion.div layout className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {filtered.map((agent, i) => (
                  <AgentNode key={agent.id} agent={agent} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
