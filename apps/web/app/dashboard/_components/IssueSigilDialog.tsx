"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, ShieldCheck, Zap, Globe, Clock, ChevronRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { SigilClient } from "@/lib/sigil/client";
import type { CapabilityType } from "@/types";
import { cn } from "@/lib/utils";

const ALL_CAPABILITIES: { value: CapabilityType; label: string; description: string }[] = [
  { value: "image-generation", label: "Image Generation", description: "Synthesize visual assets via neural models" },
  { value: "code-review", label: "Code Analysis", description: "Verify security and logic of source code" },
  { value: "translation", label: "Lingual Translation", description: "Real-time natural language processing" },
  { value: "data-analysis", label: "Data Synthesis", description: "Extract patterns from complex datasets" },
  { value: "ocr", label: "Optical Recognition", description: "Parse text from raw visual inputs" },
  { value: "audio-transcription", label: "Audio Intelligence", description: "Convert acoustic signals to text" },
  { value: "web-search", label: "Real-time Discovery", description: "Search and index the live web" },
  { value: "document-processing", label: "Doc Synthesis", description: "Automate structured data extraction" },
];

interface IssueSigilDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function IssueSigilDialog({ onClose, onSuccess }: IssueSigilDialogProps) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [capabilities, setCapabilities] = useState<CapabilityType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const agentRef = useRef<HTMLInputElement>(null);
  const perTxRef = useRef<HTMLInputElement>(null);
  const perDayRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);

  function toggleCapability(cap: CapabilityType) {
    setCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!wallet) { setError("Connect your wallet first"); return; }

    const agentKey = agentRef.current?.value.trim();
    const perTx = perTxRef.current?.value;
    const perDay = perDayRef.current?.value;
    const expiry = expiryRef.current?.value;

    if (!agentKey || !perTx || !perDay || !expiry) return;

    let agentPubkey: PublicKey;
    try {
      agentPubkey = new PublicKey(agentKey);
    } catch {
      setError("Invalid agent public key");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const client = new SigilClient({ connection, wallet });
      // convert USDC to micro-USDC (6 decimals)
      const toMicro = (v: string) => new BN(Math.round(parseFloat(v) * 1_000_000));
      await client.issueSigil({
        agent: agentPubkey,
        capabilities: capabilities.map((c) => ({ category: c, allowedDomains: [] })),
        spendLimits: { perTx: toMicro(perTx), perDay: toMicro(perDay) },
        expiresAt: Math.floor(new Date(expiry).getTime() / 1000),
      });
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Cinematic Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/10 backdrop-blur-md"
      />

      {/* The Provisioning Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full md:max-w-2xl bg-background border-l border-border/40 shadow-2xl flex flex-col overflow-hidden h-full"
      >
        {/* Technical Header */}
        <div className="p-6 md:p-8 border-b border-border/40 flex items-start justify-between bg-foreground/[0.01]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 rounded text-[9px] font-mono text-emerald-600 uppercase tracking-widest">
                PRTCL_PROVISION_V2
              </div>
              <span className="hidden sm:inline font-mono text-[10px] text-muted-foreground/30 uppercase tracking-[0.25em]">
                Secure Channel 01
              </span>
            </div>
            <h2 className="hero-display text-[2.5rem] md:text-[3.5rem] leading-[0.9] text-foreground tracking-tight">
              Issue<br />
              <span className="italic text-muted-foreground/60">New Sigil.</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-border/40 hover:bg-foreground/5 transition-all group"
          >
            <X size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 md:p-12 space-y-10 md:space-y-12">
            
            {/* Step 1: Target Node */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-foreground font-bold">01</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/40 uppercase">Identify Target Node</span>
                <div className="flex-1 h-px bg-border/20" />
              </div>
              
              <div className="space-y-2">
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-foreground/40 transition-colors">
                      <Globe size={18} />
                   </div>
                   <input
                    ref={agentRef}
                    type="text"
                    required
                    placeholder="ENTER SOLANA PUBLIC KEY..."
                    className="w-full h-14 md:h-16 pl-12 pr-6 bg-foreground/[0.01] border border-border/40 text-foreground font-mono text-[12px] md:text-[13px] placeholder:text-muted-foreground/20 focus:outline-none focus:border-foreground/20 transition-all uppercase tracking-widest"
                  />
                </div>
                <p className="text-[9px] md:text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest px-1">
                  Agent must be registered in the global directory to receive credentials.
                </p>
              </div>
            </div>

            {/* Step 2: Permissions Matrix */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-foreground font-bold">02</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/40 uppercase">Define Permission Matrix</span>
                <div className="flex-1 h-px bg-border/20" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {ALL_CAPABILITIES.map((cap) => {
                  const selected = capabilities.includes(cap.value);
                  return (
                    <button
                      key={cap.value}
                      type="button"
                      onClick={() => toggleCapability(cap.value)}
                      className={cn(
                        "group flex items-center gap-4 p-4 border transition-all text-left relative overflow-hidden",
                        selected
                          ? "border-foreground/20 bg-foreground/[0.02]"
                          : "border-border/40 hover:border-foreground/10 bg-transparent"
                      )}
                    >
                      {/* Selection accent */}
                      <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-[3px] bg-foreground transition-transform origin-center",
                        selected ? "scale-y-100" : "scale-y-0"
                      )} />

                      <div className={cn(
                        "w-10 h-10 flex items-center justify-center border rounded-lg transition-all",
                        selected ? "border-foreground/20 bg-foreground text-background" : "border-border/40 text-muted-foreground/40"
                      )}>
                        <ShieldCheck size={18} strokeWidth={selected ? 2.5 : 1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "font-mono text-[11px] uppercase tracking-[0.1em]",
                          selected ? "text-foreground font-bold" : "text-muted-foreground/60"
                        )}>
                          {cap.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground/40 font-serif italic">
                          {cap.description}
                        </div>
                      </div>
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        selected ? "bg-foreground border-foreground" : "border-border/40"
                      )}>
                        {selected && <div className="w-1 h-1 bg-background rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Economic Parameters */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-foreground font-bold">03</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/40 uppercase">Economic Constraints</span>
                <div className="flex-1 h-px bg-border/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 mb-2">
                     <Zap size={12} className="text-amber-500/40" />
                     <label className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Max / Transaction (USDC)</label>
                   </div>
                   <input
                    ref={perTxRef}
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="w-full h-12 px-4 bg-foreground/[0.01] border border-border/40 text-foreground font-mono text-[14px] focus:outline-none focus:border-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 mb-2">
                     <Zap size={12} className="text-amber-500/40" />
                     <label className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Max / Day (USDC)</label>
                   </div>
                   <input
                    ref={perDayRef}
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="w-full h-12 px-4 bg-foreground/[0.01] border border-border/40 text-foreground font-mono text-[14px] focus:outline-none focus:border-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 mb-2">
                     <Clock size={12} className="text-foreground/20" />
                     <label className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">Node Expiry (UTC)</label>
                   </div>
                   <input
                    ref={expiryRef}
                    type="date"
                    required
                    className="w-full h-12 px-4 bg-foreground/[0.01] border border-border/40 text-foreground font-mono text-[13px] focus:outline-none focus:border-foreground/20"
                  />
                </div>
              </div>

              <div className="p-6 border border-border/40 bg-foreground/[0.005] space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Database size={12} className="text-foreground/30" />
                       <span className="font-mono text-[9px] tracking-widest text-muted-foreground/40 uppercase">Protocol Stake Required</span>
                    </div>
                    <span className="font-mono text-[12px] text-foreground">1.50 SOL</span>
                 </div>
                 <div className="h-[2px] bg-foreground/5 rounded-full overflow-hidden">
                    <div className="w-[45%] h-full bg-foreground/20" />
                 </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 md:p-12 pt-0 sticky bottom-0 bg-background/80 backdrop-blur-md">
            {error && (
              <p className="text-[10px] font-mono text-destructive uppercase tracking-widest mb-4 px-1">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={submitting || capabilities.length === 0 || !wallet}
              className="w-full rounded-none h-14 md:h-16 bg-foreground text-background font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase text-[12px] md:text-[13px] group relative overflow-hidden"
            >
              {submitting ? (
                 <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-background rounded-full animate-ping" />
                    <span>Signing...</span>
                 </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>Sign & Provision Node</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            <p className="text-[8px] md:text-[9px] font-mono text-center text-muted-foreground/30 uppercase tracking-[0.2em] mt-4 md:mt-6">
               COST: 0.000005 SOL — ID: SIGIL_7X...
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
