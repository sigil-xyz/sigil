"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LineReveal } from "@/components/landing/LineReveal";

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden border-t border-border snap-start bg-background pt-20 pb-12 md:py-0"
    >
      {/* Animated dot grid background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-40px] dot-grid opacity-[0.12] pointer-events-none"
      />

      {/* Dynamic Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-emerald-500/[0.04] blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] bg-blue-500/[0.04] blur-[100px] rounded-full animate-pulse [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center w-full">
        <div className="flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-muted-foreground/50 uppercase block mb-6 md:mb-8"
          >
            Get started
          </motion.span>

          <h2 className="hero-display text-[clamp(2.4rem,6vw,5.5rem)] text-foreground leading-[1.05] mb-8 md:mb-10 tracking-tight">
            <LineReveal delay={0.1}>Ready to trust</LineReveal>
            <br />
            <LineReveal delay={0.25} className="italic">
              your agents?
            </LineReveal>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-[1rem] md:text-[1.15rem] text-muted-foreground leading-relaxed max-w-[540px] mb-10 md:mb-12 px-4"
          >
            Issue your first Sigil in minutes. One SDK call. No infrastructure
            to run. Works with any Solana wallet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-5 w-full sm:w-auto"
          >
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-8 md:px-10 h-14 md:h-16 text-[14px] md:text-[15px] font-medium gap-2 group shadow-lg shadow-foreground/5 hover:shadow-foreground/10 transition-all w-full sm:w-auto"
              )}
            >
              Issue your first Sigil
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/registry"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 md:px-10 h-14 md:h-16 text-[14px] md:text-[15px] font-medium bg-background/40 backdrop-blur-sm hover:bg-background transition-colors w-full sm:w-auto"
              )}
            >
              Browse agents
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-16 md:mt-20 text-[10px] md:text-[11px] font-mono tracking-wider text-muted-foreground/50 uppercase"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/10" />
              Free to start
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/10" />
              No custodial keys
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/10" />
              Open source SDK
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
