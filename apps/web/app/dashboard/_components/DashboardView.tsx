"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpRight, Activity, Shield, Clock, Hash, Database, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapabilityBadge } from "@/components/app/CapabilityBadge";
import { SectionReveal } from "@/components/app/SectionReveal";
import { IssueSigilDialog } from "./IssueSigilDialog";
import { SpendBar } from "./SpendBar";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);
import { useSigils } from "@/hooks/useSigils";
import type { SigilAccount } from "@/lib/sigil/types";
import BN from "bn.js";
import { MOCK_PRINCIPAL, MOCK_SIGILS } from "@/data/mock";
import type { Sigil } from "@/types";
import { cn } from "@/lib/utils";

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

function StatusIndicator({ status }: { status: Sigil["status"] }) {
  const isOnline = status === "active";
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-2 w-2">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isOnline ? "bg-emerald-500" : status === "revoked" ? "bg-destructive" : "bg-muted-foreground/40"
          )}
        ></span>
      </div>
      <span className={cn(
        "font-mono text-[10px] tracking-[0.15em] uppercase",
        isOnline ? "text-emerald-600" : status === "revoked" ? "text-destructive" : "text-muted-foreground/60"
      )}>
        {status}
      </span>
    </div>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      onAnimationComplete={() => setTimeout(onDone, 2500)}
      className="fixed bottom-10 right-10 z-50 bg-foreground text-background text-[11px] font-mono tracking-widest uppercase px-6 py-4 rounded-none border border-foreground/10 shadow-2xl flex items-center gap-4"
    >
      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
      {message}
    </motion.div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-foreground/5 rounded-md", className)} />
  );
}

export function DashboardView() {
  const { publicKey, connected } = useWallet();
  const { sigils: onChainSigils, loading, refetch } = useSigils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const sigils = connected && onChainSigils.length > 0
    ? onChainSigils.map(sigilAccountToUi)
    : connected && !loading ? [] : MOCK_SIGILS;

  const principal = connected && publicKey
    ? { ...MOCK_PRINCIPAL, walletAddress: publicKey.toBase58() }
    : MOCK_PRINCIPAL;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12">
        {/* Cinematic Header */}
        <SectionReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="px-3 py-1 border border-border/60 rounded-full flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", connected ? "bg-emerald-500" : "bg-muted-foreground/30")} />
                  <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/60 uppercase">
                    {connected ? "Node Active" : "Node Inactive"}
                  </span>
                </div>
                {connected && (
                  <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                    {publicKey?.toBase58().slice(0, 4)}…{publicKey?.toBase58().slice(-4)}
                  </span>
                )}
              </div>
              <h1 className="hero-display text-[clamp(3.5rem,6vw,5.5rem)] text-foreground leading-[0.95] tracking-tight">
                Principal<br />
                <span className="italic text-muted-foreground/60">Command.</span>
              </h1>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-6">
              <div className="text-left lg:text-right">
                <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase mb-2">
                  Network Status
                </div>
                <div className="font-mono text-[12px] text-foreground font-medium">
                  {connected ? (
                    <span className="flex items-center gap-2 lg:justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      SYNCED — SOLANA DEVNET
                    </span>
                  ) : "NOT CONNECTED"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WalletMultiButton className="!bg-white !text-black !border !border-black/10 !rounded-none !h-14 !text-[11px] !font-mono !tracking-[0.2em] !uppercase !transition-all hover:!bg-black/[0.02] hover:!border-black/20 active:!scale-[0.98]" />
                {connected && (
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="rounded-none bg-white border border-black/10 hover:border-black/20 hover:bg-black/[0.02] text-black px-8 h-14 text-[11px] font-mono tracking-[0.2em] uppercase gap-3 transition-all"
                  >
                    <Plus size={14} strokeWidth={2} />
                    Provision Sigil
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Structural Grid for Stats */}
        <SectionReveal delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-border/40 divide-x divide-y md:divide-y-0 divide-border/40 mb-16 md:mb-24">
            {[
              { label: "Total Issued", value: principal.totalIssued, icon: Activity, loading: connected && loading },
              { label: "Active Nodes", value: principal.activeCount, icon: Shield, loading: connected && loading },
              { label: "Revoked", value: principal.revokedCount, icon: Clock, loading: connected && loading },
              { label: "Total Exposure", value: "$4.2M", icon: Database, loading: false },
            ].map((stat, i) => (
              <div key={stat.label} className="p-6 md:p-8 lg:p-10 relative group overflow-hidden bg-background hover:bg-foreground/[0.01] transition-colors border-border/40">
                <stat.icon size={16} strokeWidth={2} className="text-foreground/40 absolute top-6 right-6 md:top-8 md:right-8" />
                <div className="font-mono text-[2rem] md:text-[3rem] lg:text-[4rem] font-light text-foreground tabular-nums leading-none tracking-tighter mb-4">
                  {stat.loading ? <Skeleton className="h-[3rem] md:h-[4rem] w-24" /> : stat.value}
                </div>
                <div className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Ledger / Sigil List */}
        <div className="space-y-8">
          <SectionReveal delay={0.08}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="hero-display text-[2.5rem] leading-none text-foreground mb-2">
                  Active Ledger
                </h2>
                {!connected && (
                  <p className="font-mono text-[10px] text-amber-600 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={10} /> Viewing Public Demo Data
                  </p>
                )}
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase flex items-center gap-2">
                <Hash size={12} className="text-foreground/40" />
                {loading ? <Skeleton className="h-4 w-12" /> : <>{sigils.length} Records Found</>}
              </div>
            </div>
          </SectionReveal>

          <div className="border-t border-border/40">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 py-4 px-6 border-b border-border/20 bg-foreground/[0.01]">
              <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Agent Node</div>
              <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Capabilities</div>
              <div className="col-span-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Exposure (24H)</div>
              <div className="col-span-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Status</div>
              <div className="col-span-1 text-right font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Rep</div>
            </div>

            {/* Empty State */}
            {connected && !loading && sigils.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center border-b border-border/20">
                <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                  <Shield size={24} className="text-muted-foreground/40" />
                </div>
                <h3 className="hero-display text-[1.5rem] text-foreground mb-2">No Active Sigils</h3>
                <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest max-w-xs mx-auto">
                  Your principal address has not issued any agent credentials yet.
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="mt-8 rounded-none font-mono text-[10px] tracking-[0.2em] uppercase"
                >
                  Issue First Sigil
                </Button>
              </div>
            )}

            {/* Table Rows */}
            {sigils.map((sigil, i) => (
              <motion.div
                key={sigil.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/dashboard/sigils/${sigil.id}`}>
                  <div className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 p-6 border-b border-border/20 hover:bg-foreground/[0.02] transition-all cursor-pointer items-center relative overflow-hidden">
                    {/* Hover indicator line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-foreground scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />

                    {/* Agent Info */}
                    <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2 lg:hidden mb-1">
                         <StatusIndicator status={sigil.status} />
                         <span className="w-1 h-1 rounded-full bg-foreground/10" />
                         <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest truncate">
                            {sigil.id.slice(0, 12)}
                         </span>
                      </div>
                      <span className="hidden lg:inline font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={10} className="text-foreground/30" />
                        {sigil.id.slice(0, 12)}
                      </span>
                      <span className="font-medium text-[16px] text-foreground">
                        {sigil.agentName}
                      </span>
                    </div>

                    {/* Capabilities */}
                    <div className="col-span-1 lg:col-span-3 flex flex-wrap gap-1.5">
                      {sigil.capabilities.slice(0, 2).map((cap) => (
                        <CapabilityBadge key={cap} capability={cap} className="bg-transparent border-border/40" />
                      ))}
                      {sigil.capabilities.length > 2 && (
                        <span className="font-mono text-[9px] text-muted-foreground/40 px-2 py-0.5">
                          +{sigil.capabilities.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Spend Limit */}
                    <div className="col-span-1 lg:col-span-3 lg:pr-8 flex items-center gap-3">
                       <Zap size={14} className={cn("text-amber-500/40", sigil.status !== 'active' && "grayscale opacity-30")} />
                       {sigil.status === "active" ? (
                         <div className="w-full max-w-[200px]">
                           <SpendBar spent={sigil.spentToday} limit={sigil.spendLimitPerDay} />
                         </div>
                       ) : (
                         <span className="font-mono text-[11px] text-muted-foreground/40">NO_ACTIVE_STREAM</span>
                       )}
                    </div>

                    {/* Status (Hidden on Mobile, shown in info block) */}
                    <div className="hidden lg:block col-span-1 lg:col-span-2">
                      <StatusIndicator status={sigil.status} />
                    </div>

                    {/* Rep & Action */}
                    <div className="col-span-1 lg:col-span-1 flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-border/10 pt-4 lg:pt-0">
                       <div className="flex flex-col lg:items-end">
                          <span className="lg:hidden font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest mb-1">Reputation</span>
                          <span className="font-mono text-[15px] text-foreground tabular-nums">
                            {sigil.reputation.toFixed(1)}
                          </span>
                       </div>
                       <ArrowUpRight size={18} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dialogOpen && (
          <IssueSigilDialog
            onClose={() => setDialogOpen(false)}
            onSuccess={() => {
              setDialogOpen(false);
              setToast("SIGIL_PROVISIONED_SUCCESSFULLY");
              refetch();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
