"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { LineReveal } from "@/components/landing/LineReveal";

const problems = [
  {
    number: "01",
    title: "Identity\ncrisis.",
    body: "An agent claiming to be customer service for Company X could be anyone. There is no way to cryptographically prove an agent's principal — or verify what it is actually authorized to do.",
    aside: "No provable identity",
  },
  {
    number: "02",
    title: "Discovery\nproblem.",
    body: "Agents can't find each other. There is no marketplace, no directory. Only $28K in daily x402 volume — not demand-limited, discovery-limited. The pipes exist but no one can find the faucet.",
    aside: "No agent directory",
  },
  {
    number: "03",
    title: "Reputation\nvacuum.",
    body: "No way to know if an agent is reliable. No consequences for bad behavior. No incentive for good behavior. Trust bootstrapping requires out-of-band coordination that doesn't scale.",
    aside: "No accountability",
  },
  {
    number: "04",
    title: "Liability\nuncertainty.",
    body: "When an agent misbehaves — who pays? No collateral model. No dispute resolution. The principal is fully exposed with zero on-chain recourse. This breaks at enterprise scale.",
    aside: "No liability model",
  },
];

function ProblemSlide({
  problem,
  index,
  total,
  smoothProgress,
}: {
  problem: (typeof problems)[0];
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
}) {
  // Offset everything by one "beat" to allow the header its own space
  const beat = 1 / (total + 1);
  const enterStart = (index + 1) * beat;
  const enterEnd = (index + 1) * beat + beat * 0.5;
  const leaveStart = (index + 2) * beat;

  // Cinematic Y motion - all slides now enter from below
  const y = useTransform(
    smoothProgress,
    [enterStart - beat, enterStart, enterEnd, leaveStart, leaveStart + beat * 0.2],
    [1000, 1000, 0, 0, -100]
  );

  const rotateX = useTransform(
    smoothProgress,
    [enterStart - beat, enterStart, enterEnd, leaveStart],
    [25, 25, 0, 0]
  );

  const scale = useTransform(
    smoothProgress,
    [enterStart - beat, enterStart, enterEnd, leaveStart, 1],
    [
      0.8, 
      0.8, 
      1, 
      1, 
      0.9 - (total - 1 - index) * 0.03
    ]
  );

  const opacity = useTransform(
    smoothProgress,
    [enterStart - beat * 0.5, enterStart, enterEnd, leaveStart, leaveStart + beat * 0.2],
    [0, 1, 1, 1, 0]
  );

  // Parallax effect for internal content
  const contentY = useTransform(
    smoothProgress,
    [enterStart, enterEnd, leaveStart, leaveStart + beat * 0.2],
    [80, 0, 0, -40]
  );

  const contentOpacity = useTransform(
    smoothProgress,
    [enterStart, enterEnd, leaveStart, leaveStart + beat * 0.2],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ 
        y,
        scale,
        opacity,
        rotateX,
        zIndex: index,
        perspective: 1500,
      }}
      className="absolute inset-0 flex items-center justify-center px-4 md:px-12 pointer-events-none"
    >
      <div className="relative w-full max-w-5xl h-[70vh] sm:h-[65vh] md:h-[70vh] flex flex-col justify-center rounded-[2.5rem] md:rounded-[3rem] border border-black/[0.06] bg-zinc-50/90 backdrop-blur-md shadow-[0_60px_120px_rgba(0,0,0,0.05)] overflow-hidden p-6 md:p-16 lg:p-24 pointer-events-auto">
        {/* Subtle glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.02] via-transparent to-white/[0.1] pointer-events-none" />
        
        <motion.div 
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 md:gap-12 items-center"
        >
          <div>
            {/* Number Label */}
            <div className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-muted-foreground/60 uppercase mb-8 md:mb-12 flex items-center gap-4 md:gap-6">
              <span className="w-12 md:w-16 h-[1px] bg-black/10" />
              <span className="text-black font-semibold">{problem.number}</span>
              <span className="opacity-40">/</span>
              {problem.aside}
            </div>

            {/* Title */}
            <h2 className="hero-display text-[clamp(2rem,6.5vw,7.5rem)] text-foreground mb-6 md:mb-8 whitespace-pre-line tracking-tight leading-[0.88] lg:-ml-1">
              {problem.title}
            </h2>

            {/* Body */}
            <p className="text-[1rem] md:text-[1.35rem] text-muted-foreground/80 leading-relaxed max-w-[560px] font-light">
              {problem.body}
            </p>
          </div>

          {/* Large number watermark */}
          <div className="hidden lg:flex justify-end opacity-20 pr-4">
            <span className="font-display font-light text-[26rem] leading-none text-black/[0.02] select-none tabular-nums tracking-tighter">
              {problem.number}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProgressDot({
  smoothProgress,
  index,
  total,
}: {
  smoothProgress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const beat = 1 / (total + 1);
  const start = (index + 1) * beat;
  const end = (index + 2) * beat;
  
  const opacity = useTransform(
    smoothProgress,
    [start - 0.05, start, end, end + 0.05],
    [0.15, 1, 1, 0.15]
  );
  
  const scale = useTransform(
    smoothProgress,
    [start - 0.05, start, end, end + 0.05],
    [1, 1.5, 1.5, 1]
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="w-1.5 h-1.5 rounded-full bg-foreground"
    />
  );
}

export function ProblemSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70, // Slightly more relaxed for cinematic feel
    damping: 30,
    restDelta: 0.0001
  });

  // Header has its own clear space at the start
  const beat = 1 / (problems.length + 1);
  const headerOpacity = useTransform(smoothProgress, [0, beat * 0.8, beat], [1, 1, 0]);
  const headerY = useTransform(smoothProgress, [0, beat], [0, -40]);
  const headerScale = useTransform(smoothProgress, [0, beat], [1, 0.95]);
  const progressScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section
      id="protocol"
      ref={containerRef}
      className="relative bg-background"
      style={{ minHeight: "550vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scaleX: progressScaleX }} className="scroll-line" />
        
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 zen-ripples opacity-[0.5]" />
          
          {/* Moving Mesh Gradients */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.03, 0.02]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600 blur-[140px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.01, 0.02, 0.01]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-500 blur-[140px] rounded-full" 
          />
        </div>

        <motion.div
          style={{ opacity: headerOpacity, y: headerY, scale: headerScale }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="max-w-7xl mx-auto w-full px-6 md:px-16 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-muted-foreground/50 uppercase block mb-6 md:mb-8"
            >
              The Protocol
            </motion.span>

            <h2 className="hero-display text-[clamp(2.5rem,8vw,9rem)] text-foreground leading-[0.9] tracking-tighter">
              <LineReveal delay={0.1}>Critical gaps</LineReveal>
              <br />
              <LineReveal delay={0.25} className="italic">
                in the agent economy.
              </LineReveal>
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-12 md:mt-16 flex flex-col items-center gap-4"
            >
              <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-black/20 to-transparent" />
              <span className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/40 uppercase">
                Scroll to explore
              </span>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex items-center">
          <div className="relative w-full h-full">
            {problems.map((problem, i) => (
              <ProblemSlide
                key={problem.number}
                problem={problem}
                index={i}
                total={problems.length}
                smoothProgress={smoothProgress}
              />
            ))}
          </div>
        </div>

        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-6 md:gap-8 z-50">
          {problems.map((_, i) => (
            <ProgressDot 
              key={i} 
              smoothProgress={smoothProgress} 
              index={i} 
              total={problems.length} 
            />
          ))}
        </div>

        <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-50">
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 48 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-[1px] bg-gradient-to-b from-transparent via-black/20 to-transparent" 
            />
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-muted-foreground/40 uppercase">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

