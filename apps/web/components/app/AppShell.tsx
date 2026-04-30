"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { SigilLogo } from "@/components/landing/SigilLogo";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { LogOut, User, ChevronRight, ShieldAlert, Wallet } from "lucide-react";
import { usePrincipal } from "@/providers/PrincipalProvider";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/registry", label: "Registry" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "https://sigil-10dddbf2.mintlify.app/introduction", label: "Docs", external: true },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-[5px] w-5">
      <motion.span
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px w-full bg-foreground origin-center"
      />
      <motion.span
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px w-full bg-foreground origin-center"
      />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { publicKey, connected, disconnect } = useWallet();
  const { principal } = usePrincipal();

  const base58 = publicKey?.toBase58();
  const addressShort = base58 
    ? `${base58.slice(0, 4)}…${base58.slice(-4)}`
    : null;

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  const menuVariants: Variants = {
    closed: { opacity: 0, y: -12, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } },
    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
        animate={{
          backgroundColor: scrolled
            ? "var(--header-bg)"
            : "var(--header-bg-zero)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderBottomColor: scrolled
            ? "var(--header-border)"
            : "transparent",
          borderBottomWidth: scrolled ? 1 : 0,
        }}
        style={{ borderBottomStyle: "solid" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-[84px] flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0 relative z-10">
            <SigilLogo
              width={22}
              height={26}
              className="text-foreground shrink-0 transition-opacity group-hover:opacity-60"
            />
            <span className="hero-display text-[2.2rem] leading-none text-foreground tracking-tighter">
              sigil
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 p-1.5 rounded-full border border-border/40 bg-foreground/[0.02] backdrop-blur-md">
            {navLinks.map((link) => {
              const isExternal = "external" in link && link.external;
              const isProfileLink = link.href === "/dashboard/profile";
              const isDashboardLink = link.href === "/dashboard";
              
              // Logic: 
              // 1. Profile link is active only if exact match.
              // 2. Dashboard link is active if it starts with /dashboard BUT NOT on the profile page.
              // 3. Other links use standard prefix matching.
              const active = !isExternal && (
                pathname === link.href || 
                (isDashboardLink ? (pathname.startsWith("/dashboard") && pathname !== "/dashboard/profile") : 
                 !isProfileLink && pathname.startsWith(link.href + "/"))
              );

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={cn(
                    "relative px-5 py-2 text-[14px] font-medium transition-colors duration-300 rounded-full",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    {isExternal && <ChevronRight size={12} className="-rotate-45 opacity-50" />}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-6 relative z-10">
            {!connected && (
              <div className="hidden min-[1200px]:flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/40 bg-foreground/[0.01] text-muted-foreground/40">
                <ShieldAlert size={12} className="shrink-0 opacity-40" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] leading-none">
                  Node Status: Demo
                </span>
              </div>
            )}

            <div className="hidden lg:flex items-center">
              {connected ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={cn(
                      "flex items-center gap-4 pl-5 pr-2 py-2 rounded-2xl border border-border/40 transition-all duration-500 hover:bg-foreground/[0.02] group",
                      dropdownOpen ? "bg-foreground/[0.02] border-border/60" : "bg-transparent"
                    )}
                  >
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[10px] text-foreground font-bold tracking-[0.1em] uppercase leading-none">
                        {principal.name}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground/30 leading-none mt-1.5 uppercase tracking-tighter">
                        {addressShort}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/40 bg-muted grayscale group-hover:grayscale-0 transition-all duration-700 shadow-inner flex items-center justify-center">
                      {principal.avatarUrl ? (
                        <img 
                          src={principal.avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <User size={20} className="text-muted-foreground/40" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setDropdownOpen(false)}
                          className="fixed inset-0 z-[-1]"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute right-0 mt-2 w-56 bg-background border border-border/60 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl"
                        >
                          <div className="p-2 border-b border-border/40 bg-foreground/[0.02]">
                             <div className="px-3 py-2">
                               <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-1">Principal</p>
                               <p className="font-mono text-[12px] text-foreground font-medium truncate">{principal.name}</p>
                             </div>
                          </div>
                          <div className="p-1">
                            <Link 
                              href="/dashboard/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
                            >
                              <User size={16} className="text-muted-foreground group-hover:text-foreground" />
                              <span className="text-[13px] font-medium">Edit Profile</span>
                            </Link>
                            <button 
                              onClick={() => {
                                disconnect();
                                setDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/5 text-destructive transition-colors group text-left"
                            >
                              <LogOut size={16} />
                              <span className="text-[13px] font-medium">Terminate Session</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <WalletMultiButton className="!bg-foreground !text-background !border-none !font-mono !font-bold !text-[11px] !tracking-[0.2em] !uppercase !h-11 !px-8 !rounded-2xl !transition-all hover:!opacity-90 active:!scale-95 !shadow-xl !shadow-foreground/5" />
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:opacity-60 transition-opacity relative z-[60]"
              aria-label="Toggle menu"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 lg:hidden flex flex-col"
            style={{ top: 84 }}
          >
            <div className="absolute inset-0 bg-background/96 backdrop-blur-xl border-b border-border shadow-2xl" />
            
            <nav className="relative z-10 max-w-7xl mx-auto w-full px-8 py-10 flex flex-col gap-1.5 flex-1">
              {!connected && (
                <div className="mb-8 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/40 bg-foreground/[0.02] text-muted-foreground/40 w-fit">
                  <ShieldAlert size={12} className="shrink-0 opacity-40" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] leading-none">
                    Node Status: Demo
                  </span>
                </div>
              )}

              {navLinks.map((link, i) => {
                const isExternal = "external" in link && link.external;
                const active = !isExternal && (pathname === link.href || pathname.startsWith(link.href + "/"));
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={cn(
                        "flex items-center justify-between p-5 rounded-2xl transition-all duration-300",
                        active
                          ? "bg-foreground/[0.03] text-foreground border border-border/40"
                          : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.01]"
                      )}
                    >
                      <span className="font-mono text-[14px] uppercase tracking-[0.2em] font-bold">{link.label}</span>
                      <ChevronRight size={18} className={cn("transition-all duration-300", active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2")} />
                    </Link>
                  </motion.div>
                );
              })}
              
              <div className="mt-auto pb-12 pt-8 border-t border-border/40">
                {connected ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-foreground/[0.02] rounded-2xl border border-border/40">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-border/40 bg-muted flex items-center justify-center">
                         {principal.avatarUrl ? (
                           <img src={principal.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                         ) : (
                           <User size={24} className="text-muted-foreground/40" />
                         )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest leading-none mb-1">Active Principal</span>
                        <span className="font-mono text-[14px] text-foreground font-medium">{principal.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground/40 mt-1">{addressShort}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        disconnect();
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-destructive/5 text-destructive font-medium transition-colors"
                    >
                      <LogOut size={18} />
                      Terminate Session
                    </button>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <div className="flex flex-col items-center text-center gap-2 mb-6">
                      <Wallet size={32} className="text-muted-foreground/20" />
                      <p className="text-[13px] text-muted-foreground max-w-[200px]">Connect your Solana wallet to access your agent ledger.</p>
                    </div>
                    <WalletMultiButton className="!w-full !bg-foreground !text-background !border-none !font-semibold !text-[15px] !h-14 !px-8 !rounded-2xl !transition-all hover:!opacity-90 active:!scale-95 !shadow-xl !shadow-foreground/5" />
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-[84px]">
        {children}
      </main>
    </div>
  );
}
