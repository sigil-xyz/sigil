"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapabilityBadge } from "@/components/app/CapabilityBadge";
import { SectionReveal } from "@/components/app/SectionReveal";
import { RevokeDialog } from "./RevokeDialog";
import type { Sigil } from "@/types";
import { cn } from "@/lib/utils";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={copy}
      className="p-1 rounded-md hover:bg-foreground/6 text-muted-foreground/40 hover:text-foreground/60 transition-colors"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function StatusPill({ status }: { status: Sigil["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide px-2.5 py-0.5 rounded-full border",
        status === "active"
          ? "border-green-500/20 bg-green-500/8 text-green-600"
          : status === "revoked"
          ? "border-destructive/20 bg-destructive/8 text-destructive"
          : "border-border text-muted-foreground/60"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "active" ? "bg-green-500" : status === "revoked" ? "bg-destructive" : "bg-muted-foreground/40"
        )}
      />
      {status}
    </span>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setTimeout(onDone, 2400)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-[13px] font-mono px-5 py-3 rounded-full shadow-lg shadow-foreground/20"
    >
      {message}
    </motion.div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncate(s: string, n = 12) {
  return s.slice(0, n) + "…" + s.slice(-6);
}

interface SigilDetailViewProps {
  sigil: Sigil;
}

export function SigilDetailView({ sigil }: SigilDetailViewProps) {
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revoked, setRevoked] = useState(sigil.status === "revoked");
  const [toast, setToast] = useState<string | null>(null);

  const spendPct = Math.min(100, (sigil.spentToday / sigil.spendLimitPerDay) * 100);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <SectionReveal>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/50 hover:text-foreground/60 transition-colors mb-8"
        >
          <ChevronLeft size={12} />
          Dashboard
        </Link>
      </SectionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — main content */}
        <div className="lg:col-span-3 space-y-6">
          <SectionReveal>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="hero-display text-[clamp(2rem,4vw,3rem)] text-foreground leading-none mb-2">
                  {sigil.agentName}
                </h1>
                <div className="flex items-center gap-3">
                  <StatusPill status={revoked ? "revoked" : sigil.status} />
                  <span className="font-mono text-[11px] text-muted-foreground/40">
                    {truncate(sigil.agentPubkey)}
                  </span>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Spend section */}
          <SectionReveal delay={0.06}>
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase mb-5">
                Daily Spend
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <span className="font-mono text-[2.5rem] font-medium text-foreground tabular-nums leading-none">
                    ${sigil.spentToday}
                  </span>
                  <span className="font-mono text-[14px] text-muted-foreground/40 ml-2">
                    / ${sigil.spendLimitPerDay}
                  </span>
                </div>
                <span className="font-mono text-[12px] text-muted-foreground/50">
                  {spendPct.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-foreground/6 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    spendPct >= 90 ? "bg-destructive" : spendPct >= 70 ? "bg-amber-500" : "bg-foreground/50"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${spendPct}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground/30 mt-2">
                <span>Per Tx limit: ${sigil.spendLimitPerTx}</span>
                <span>Resets at midnight UTC</span>
              </div>
            </div>
          </SectionReveal>

          {/* Capabilities */}
          <SectionReveal delay={0.1}>
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase mb-4">
                Capabilities
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sigil.capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="border border-border/60 rounded-lg px-3 py-2.5 bg-foreground/2"
                  >
                    <CapabilityBadge capability={cap} />
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Attestations */}
          <SectionReveal delay={0.14}>
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase mb-5">
                Attestations
              </div>
              <div className="relative">
                <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-5 pl-8">
                  {sigil.attestations.map((att) => (
                    <div key={att.id}>
                      <div className="absolute left-0 w-5 h-5 rounded-full border border-border bg-background flex items-center justify-center -translate-x-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                      </div>
                      <div className="font-mono text-[10px] tracking-widest text-muted-foreground/40 uppercase mb-0.5">
                        {att.type} · {formatDate(att.issuedAt)}
                      </div>
                      <div className="text-[13px] text-foreground/80 mb-0.5">
                        {att.description}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground/40">
                        Issued by {att.issuer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Right — sticky metadata */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <SectionReveal delay={0.04}>
              <div className="border border-border rounded-xl p-6 bg-card space-y-4">
                <div className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase">
                  Sigil Details
                </div>

                {[
                  { label: "PDA Address", value: truncate(sigil.pdaAddress), full: sigil.pdaAddress, mono: true },
                  { label: "Principal", value: truncate(sigil.principalPubkey), full: sigil.principalPubkey, mono: true },
                  { label: "Issued", value: formatDate(sigil.issuedAt), full: null, mono: false },
                  { label: "Expires", value: formatDate(sigil.expiresAt), full: null, mono: false },
                  { label: "Stake", value: `${sigil.stakeAmount} SOL`, full: null, mono: true },
                  { label: "Reputation", value: sigil.reputation.toFixed(1), full: null, mono: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground/40 uppercase tracking-wider shrink-0">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1 min-w-0">
                      <span
                        className={cn(
                          "text-[12px] text-foreground/70 truncate",
                          item.mono ? "font-mono" : ""
                        )}
                      >
                        {item.value}
                      </span>
                      {item.full && <CopyButton text={item.full} />}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>

            {!revoked && sigil.status !== "expired" && (
              <SectionReveal delay={0.08}>
                <Button
                  variant="destructive"
                  className="w-full rounded-xl h-10"
                  onClick={() => setRevokeOpen(true)}
                >
                  Revoke Sigil
                </Button>
              </SectionReveal>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {revokeOpen && (
          <RevokeDialog
            agentName={sigil.agentName}
            onClose={() => setRevokeOpen(false)}
            onConfirm={() => {
              setRevokeOpen(false);
              setRevoked(true);
              setToast("Sigil revoked");
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
