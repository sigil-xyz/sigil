"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/landing/CopyButton";
import { LineReveal } from "@/components/landing/LineReveal";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -40],
  );

  return (
    <section
      ref={containerRef}
      style={{ position: "relative" }}
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden snap-start bg-background pt-32 pb-12 md:pt-40 md:pb-20"
    >
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Zen Ripple Pattern */}
        <div className="absolute inset-0 zen-ripples opacity-[0.8]" />
        
        {/* Sophisticated Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-emerald-500/[0.04] blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[60%] h-[60%] bg-blue-600/[0.04] blur-[140px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Text content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center flex-1 justify-center"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-foreground font-medium uppercase bg-foreground/5 backdrop-blur-sm border border-border/40 rounded-full px-5 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Agent Infrastructure · Solana
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="hero-display text-[clamp(2.8rem,7vw,7.5rem)] text-foreground mb-8 md:mb-10 max-w-6xl leading-[0.92]">
          <LineReveal delay={0.22} className="block">
            Cryptographic
          </LineReveal>
          <LineReveal delay={0.36} className="block">
            identity for the
          </LineReveal>
          <LineReveal delay={0.5} className="block italic">
            agent economy.
          </LineReveal>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-[1rem] md:text-[1.15rem] text-foreground/70 leading-relaxed max-w-[580px] mb-8 md:mb-12 font-medium px-4"
        >
          AI agents can now transact autonomously. But without identity,
          authorization, and accountability — anyone claiming to be &ldquo;your agent&rdquo;
          could be anyone. Sigil fixes that.
        </motion.p>

        {/* Install command */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-3 font-mono text-[12px] md:text-[13px] bg-secondary/40 border border-border/50 rounded-full px-6 py-3">
            <span className="text-muted-foreground/50 select-none">$</span>
            <span className="text-foreground/80">bun add @sigil/sdk</span>
            <CopyButton text="bun add @sigil/sdk" />
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-5 mb-16 md:mb-24"
        >
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8 md:px-12 h-14 md:h-16 text-[14px] md:text-[15px] font-medium gap-2 group shadow-xl shadow-foreground/5 hover:shadow-foreground/10 transition-all bg-foreground text-background w-full sm:w-auto"
            )}
          >
            Get started
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/registry"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full px-8 md:px-12 h-14 md:h-16 text-[14px] md:text-[15px] font-medium bg-foreground/5 backdrop-blur-sm hover:bg-foreground/10 transition-colors border-border text-foreground w-full sm:w-auto"
            )}
          >
            Browse agents
          </Link>
        </motion.div>

        {/* Stats strip - Improved responsiveness */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-full max-w-5xl mx-auto relative z-20 mt-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-8 px-6 py-8 md:px-10 md:py-8 bg-background/50 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-border/40 shadow-sm">
            {[
              { value: "847", label: "Active agents" },
              { value: "12.4k", label: "Verified txns" },
              { value: "$2.3M", label: "Protected daily" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center relative">
                {i > 0 && <div className="hidden sm:block absolute left-[-2px] top-1/2 -translate-y-1/2 w-[1px] h-8 bg-border/40" />}
                <div className="font-mono text-[1.25rem] md:text-[1.5rem] font-medium text-foreground tabular-nums tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-foreground/50 font-bold uppercase mt-1 md:mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
