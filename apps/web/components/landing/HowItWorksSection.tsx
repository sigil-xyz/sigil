"use client";

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CopyButton } from "@/components/landing/CopyButton";
import { LineReveal } from "@/components/landing/LineReveal";

const steps = [
  {
    number: "01",
    verb: "Issue.",
    title: "Give your agent a credential.",
    body: "A Sigil is an on-chain PDA signed to the agent's keypair and principal. Set capability scopes, daily spend limits, and collateral. One SDK call — deterministic, unforgeable.",
    code: `await sigil.issue({
  agent: agentPubkey,
  capabilities: ["payments", "read"],
  spendLimit: { daily: 100_000_000 },
  stake: 1_000_000_000,
})`,
  },
  {
    number: "02",
    verb: "Verify.",
    title: "Every interaction, on-chain.",
    body: "Any service verifies the Sigil in real time. Capability gates, spend checks, and principal attestation all happen on-chain — no centralized trust assumptions, no middleware required.",
    code: `const { authorized } = await sigil.verify({
  agent: incomingAgent,
  requiredCapability: "payments",
  maxSpend: amount,
})`,
  },
  {
    number: "03",
    verb: "Transact.",
    title: "With full accountability.",
    body: "Your agent participates in the agent economy with verifiable identity and bounded risk. Agents discover each other via the permissionless registry. Every transaction is staked and auditable forever.",
    code: `app.use(sigilMiddleware({
  requireCapability: "payments",
  onViolation: "slash-stake",
}))`,
  },
];

function highlightCode(code: string) {
  return code
    .replace(/(\".*?\"|\'.*?\')/g, '<span style="color: #047857;">$1</span>')
    .replace(/\/\/.*/g, '<span style="color: #6b7280; font-style: italic;">$&</span>')
    .replace(/\b(await|const|async|import|from)\b/g, '<span style="color: #4338ca; font-weight: 500;">$1</span>')
    .replace(/\b(sigil|issue|verify|use|sigilMiddleware)\b/g, '<span style="color: #6d28d9;">$1</span>');
}

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1.2,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex flex-col gap-8 group"
    >
      {/* Step number + verb */}
      <div className="flex items-baseline gap-4 border-b border-border/60 pb-6 group-hover:border-border transition-colors">
        <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground/60">
          {step.number}
        </span>
        <h3 className="font-display italic text-[clamp(2.4rem,4vw,3.6rem)] text-foreground leading-none">
          {step.verb}
        </h3>
      </div>

      {/* Title */}
      <div>
        <p className="font-medium text-[17px] text-foreground mb-4 leading-snug">
          {step.title}
        </p>
        <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
          {step.body}
        </p>
      </div>

      {/* Code */}
      <div className="bg-secondary/80 border border-border/50 rounded-xl p-6 group-hover:bg-secondary group-hover:border-border/80 transition-all duration-300 mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
          <CopyButton text={step.code} />
        </div>
        <div
          className="text-[11px] font-mono text-foreground/80 leading-relaxed overflow-x-auto whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlightCode(step.code) }}
        />
      </div>
    </motion.div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="min-h-screen flex items-center py-20 md:py-32 border-t border-border snap-start bg-background">
      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Heading */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground/50 uppercase"
          >
            How it works
          </motion.span>

          <h2 className="hero-display text-[clamp(3rem,6vw,6rem)] text-foreground mt-5">
            <LineReveal delay={0.05} className="inline-block mr-4">
              Three steps
            </LineReveal>
            <LineReveal delay={0.15} className="inline-block italic">
              to trusted agents.
            </LineReveal>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
