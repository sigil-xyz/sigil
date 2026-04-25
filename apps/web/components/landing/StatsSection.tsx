"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: 847,
    suffix: "",
    label: "Active agents",
    description: "Sigil-verified agents live on mainnet",
    decimals: 0,
  },
  {
    value: 12450,
    suffix: "",
    label: "Transactions verified",
    description: "On-chain verifications since launch",
    decimals: 0,
  },
  {
    prefix: "$",
    value: 2.3,
    suffix: "M",
    label: "Protected daily",
    description: "Total value transacted through Sigil agents",
    decimals: 1,
  },
  {
    value: 99.97,
    suffix: "%",
    label: "Verification accuracy",
    description: "Correct credential checks",
    decimals: 2,
  },
];

function useCounter(target: number, duration: number, start: boolean, decimals = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // More luxurious quintic easing
      const eased = 1 - Math.pow(1 - progress, 5);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration, decimals]);
  return count;
}

function StatItem({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCounter(stat.value, 2.4, isInView, stat.decimals);

  const display =
    stat.decimals > 0
      ? count.toFixed(stat.decimals)
      : Math.round(count).toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 md:gap-4 py-12 md:py-16 px-6 md:px-8 border-b sm:border-b-0 sm:border-r border-background/10 last:border-b-0 sm:last:border-r-0"
    >
      <div className="hero-display text-[clamp(2.4rem,5vw,5.5rem)] leading-none text-background italic tabular-nums tracking-tight">
        {"prefix" in stat ? stat.prefix : ""}
        {display}
        {stat.suffix}
      </div>
      <div>
        <div className="font-medium text-[14px] md:text-[15px] text-background/90 mb-1 md:mb-1.5 tracking-wide">
          {stat.label}
        </div>
        <div className="text-[11px] md:text-[12px] text-background/50 leading-relaxed max-w-[180px] md:max-w-[200px]">
          {stat.description}
        </div>
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="min-h-[70vh] md:min-h-screen flex flex-col border-t border-border snap-start bg-background">
      <div
        ref={ref}
        className="flex-1 bg-foreground overflow-hidden flex flex-col justify-center relative"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-emerald-500/[0.05] blur-[120px] rounded-full pointer-events-none" />

        {/* Heading row */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-16 md:pt-20 pb-8 md:pb-12 border-b border-background/10">
            <div className="flex flex-col gap-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8 }}
                className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-background/40 uppercase"
              >
                Traction
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display italic text-[1.5rem] md:text-[2rem] text-background leading-tight"
              >
                Growth that speaks for itself.
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, x: 10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-mono text-[11px] md:text-[12px] text-background/30 max-w-[240px] md:text-right"
            >
              Real-time protocol metrics from the Sigil registry.
            </motion.p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full pb-16 md:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <StatItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
