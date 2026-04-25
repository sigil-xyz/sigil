"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { SigilLogo } from "@/components/landing/SigilLogo";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { href: "#protocol", label: "Protocol" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#integrations", label: "Integrations" },
  {
    href: "https://github.com/sigil-xyz/sigil",
    label: "Docs",
    external: true,
  },
];

const sections = [
  { id: "protocol", label: "Protocol" },
  { id: "how-it-works", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "integrations", label: "Integrations" },
];

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

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

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 60);
    setPastHero(y > 400);
  });

  const activeLabel = pastHero
    ? sections.find((s) => s.id === activeSection)?.label
    : undefined;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          backgroundColor: scrolled
            ? "var(--header-bg)"
            : "var(--header-bg-zero)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          borderBottomColor: scrolled
            ? "var(--header-border)"
            : "var(--header-border-zero)",
        }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-10 h-[84px] flex items-center justify-between relative">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 group shrink-0 relative z-10"
          >
            <SigilLogo
              width={24}
              height={28}
              className="text-foreground shrink-0 transition-opacity group-hover:opacity-60"
            />
            <span className="hero-display text-[2.2rem] leading-none text-foreground tracking-tighter">
              sigil
            </span>
          </Link>

          {/* Breadcrumb — current section (Visible when space allows) */}
          <div className="hidden min-[1140px]:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 z-0">
            <AnimatePresence mode="wait">
              {activeLabel && (
                <motion.div
                  key={activeLabel}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase"
                >
                  <span className="opacity-30">sigil</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
                  <span className="text-foreground font-medium">
                    {activeLabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions Cluster */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="hidden sm:flex items-center gap-4">
              {/* GitHub */}
              <Link
                href="https://github.com/sigil-xyz/sigil"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-foreground/30 hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                </svg>
              </Link>

              {/* Launch App */}
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full px-6 h-10 text-[13px] font-semibold bg-foreground text-background hover:opacity-90 transition-opacity",
                )}
              >
                Launch app
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -mr-2 hover:opacity-60 transition-opacity"
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
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[84px] left-0 right-0 z-40 bg-background/96 backdrop-blur-xl border-b border-border"
          >
            <nav className="max-w-7xl mx-auto px-8 py-10 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-[18px] font-medium text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
