"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Save, Globe, Mail, Building, User, ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/app/SectionReveal";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePrincipal } from "@/providers/PrincipalProvider";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

export function ProfileView() {
  const { publicKey, connected, disconnect } = useWallet();
  const { principal, updatePrincipal } = usePrincipal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: principal.name || "",
    email: principal.email || "",
    company: principal.company || "",
    bio: principal.bio || "",
    avatarUrl: principal.avatarUrl || "https://api.dicebear.com/7.x/shapes/svg?seed=sigil",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      updatePrincipal(formData);
      setSaving(false);
      setToast("IDENTITY_SYNCHRONIZED_SUCCESSFULLY");
    }, 1200);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      setToast("AVATAR_PREVIEW_LOADED");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="h-px w-full bg-border/40 mb-12" />

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <div className="mb-16">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Return to Command</span>
            </Link>

            <h1 className="hero-display text-[4rem] text-foreground leading-none tracking-tight mb-4">
              Principal<br />
              <span className="italic text-muted-foreground/60">Identity.</span>
            </h1>
            <p className="font-mono text-[12px] text-muted-foreground/60 tracking-wider uppercase">
              Configure your on-chain presence and institutional metadata.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Avatar Section */}
          <div className="md:col-span-4">
            <SectionReveal delay={0.1}>
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div
                  onClick={handleImageClick}
                  className="aspect-square bg-foreground/5 border border-border/40 overflow-hidden relative cursor-pointer"
                >
                  <img 
                    src={formData.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                  />                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-foreground">
                      <Camera size={24} strokeWidth={1.5} />
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase">Update Image</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase">Connected Wallet</span>
                  <span className="font-mono text-[11px] text-foreground break-all">
                    {publicKey?.toBase58() || principal.walletAddress}
                  </span>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Form Section */}
          <div className="md:col-span-8">
            <SectionReveal delay={0.15}>
              <div className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase flex items-center gap-2">
                      <User size={12} className="text-foreground/20" />
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-border/40 py-2 font-mono text-[13px] focus:border-foreground transition-colors outline-none"
                      placeholder="Principal Name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase flex items-center gap-2">
                      <Building size={12} className="text-foreground/20" />
                      Organization
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-transparent border-b border-border/40 py-2 font-mono text-[13px] focus:border-foreground transition-colors outline-none"
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase flex items-center gap-2">
                    <Mail size={12} className="text-foreground/20" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-border/40 py-2 font-mono text-[13px] focus:border-foreground transition-colors outline-none"
                    placeholder="ops@organization.io"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase flex items-center gap-2">
                    <Globe size={12} className="text-foreground/20" />
                    Strategic Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-transparent border border-border/40 p-4 font-mono text-[13px] focus:border-foreground transition-colors outline-none resize-none"
                    placeholder="Describe your role in the agent economy..."
                  />
                </div>

                <div className="pt-8 flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-none bg-white border border-black/10 hover:border-black/20 hover:bg-black/[0.02] text-black px-12 h-14 text-[11px] font-mono tracking-[0.2em] uppercase transition-all flex items-center gap-3"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {saving ? "Synchronizing..." : "Update Identity"}
                  </Button>
                </div>
              </div>
            </SectionReveal>

            {/* Wallet Management Section */}
            <SectionReveal delay={0.2}>
              <div className="mt-20 pt-12 border-t border-border/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-2">
                    <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase flex items-center gap-2">
                      <ShieldCheck size={12} className="text-emerald-500/60" />
                      Security & Access
                    </div>
                    <h3 className="hero-display text-[1.5rem] text-foreground">
                      Principal Wallet
                    </h3>
                    <p className="font-mono text-[11px] text-muted-foreground/60 max-w-md">
                      Your identity is cryptographically tied to this Solana address. Disconnecting will end your current session.
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="px-4 py-2 bg-foreground/[0.02] border border-border/40 rounded-lg flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", connected ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/20")} />
                      <span className="font-mono text-[11px] text-foreground">
                        {publicKey ? (
                          <>{publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}</>
                        ) : (
                          "NOT CONNECTED"
                        )}
                      </span>
                    </div>

                    {connected && (
                      <Button
                        onClick={() => disconnect()}
                        variant="ghost"
                        className="font-mono text-[10px] tracking-[0.15em] uppercase text-destructive hover:text-destructive hover:bg-destructive/5 gap-2 px-4"
                      >
                        <LogOut size={14} />
                        Terminate Session
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
