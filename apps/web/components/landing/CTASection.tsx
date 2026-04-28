"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LineReveal } from "@/components/landing/LineReveal";

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden border-t border-border snap-start bg-background pt-24 pb-16 md:py-0"
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
            className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-muted-foreground/50 uppercase block mb-8 md:mb-10"
          >
            Get started
          </motion.span>

          <h2 className="hero-display text-[clamp(2.4rem,6vw,5.5rem)] text-foreground leading-[1.05] mb-8 md:mb-10 tracking-tight">
            <LineReveal delay={0.1}>Ready to trust</LineReveal>
            <br />
            <LineReveal delay={0.25} className="italic text-foreground/90">
              your agents?
            </LineReveal>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-[1.1rem] md:text-[1.2rem] text-muted-foreground/70 leading-relaxed max-w-[560px] mb-12 md:mb-16 px-4 font-medium"
          >
            Issue your first Sigil in minutes. One SDK call. No infrastructure
            to run. Works with any Solana wallet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col items-center gap-8 w-full"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8 md:px-12 h-14 md:h-16 text-[14px] md:text-[15px] font-semibold gap-2 group shadow-xl shadow-foreground/5 hover:shadow-foreground/10 transition-all w-full sm:w-auto"
                )}
              >
                Issue your first Sigil
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/registry"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-8 md:px-12 h-14 md:h-16 text-[14px] md:text-[15px] font-semibold bg-background/40 backdrop-blur-sm hover:bg-background transition-colors w-full sm:w-auto border-border/60"
                )}
              >
                Browse agents
              </Link>
            </div>

            <Link
              href="https://docs.sigil.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground hover:text-foreground uppercase font-bold transition-colors mt-2"
            >
              Explore the documentation
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-20 md:mt-24 text-[10px] md:text-[11px] font-mono tracking-widest text-muted-foreground/40 uppercase font-bold"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/5" />
              Free to start
            </span>
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/5" />
              No custodial keys
            </span>
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/5" />
              Open source SDK
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
