"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CopyButton } from "@/components/landing/CopyButton";
import { LineReveal } from "@/components/landing/LineReveal";

const integrations = [
  {
    name: "Solana",
    description: "Settlement layer",
    logo: (
      <svg viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path
          d="M64.6 237.9a12.6 12.6 0 0 1 8.9-3.7h317.8c5.6 0 8.4 6.8 4.4 10.7l-62.7 62.7a12.6 12.6 0 0 1-8.9 3.7H6.3c-5.6 0-8.4-6.8-4.4-10.7l62.7-62.7ZM64.6 3.7A12.6 12.6 0 0 1 73.5 0h317.8c5.6 0 8.4 6.8 4.4 10.7L333 73.4a12.6 12.6 0 0 1-8.9 3.7H6.3C.7 77.1-2.1 70.3 1.9 66.4L64.6 3.7ZM333 120.1a12.6 12.6 0 0 0-8.9-3.7H6.3c-5.6 0-8.4 6.8-4.4 10.7l62.7 62.7a12.6 12.6 0 0 0 8.9 3.7h317.8c5.6 0 8.4-6.8 4.4-10.7L333 120.1Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "x402",
    description: "Payment protocol",
    logo: (
      <div className="w-7 h-7 flex items-center justify-center font-mono font-bold text-[13px] tracking-tight">
        x402
      </div>
    ),
  },
  {
    name: "MCP",
    description: "Model context",
    logo: (
      <div className="w-7 h-7 flex items-center justify-center font-mono font-semibold text-[11px]">
        MCP
      </div>
    ),
  },
  {
    name: "Helius",
    description: "Solana RPC",
    logo: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
        <path d="M10 16h12M16 10l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Privy",
    description: "Wallet auth",
    logo: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" />
        <path d="M11 16a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5v0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Anchor",
    description: "Smart contracts",
    logo: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M16 4v4m0 16v4M4 16h4m16 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M16 21v6M12 24h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

function highlightCode(code: string) {
  return code
    .replace(/(\".*?\"|\'.*?\')/g, '<span style="color: #047857;">$1</span>')
    .replace(/\/\/.*/g, '<span style="color: #6b7280; font-style: italic;">$&</span>')
    .replace(/\b(await|const|async|import|from|new)\b/g, '<span style="color: #4338ca; font-weight: 500;">$1</span>')
    .replace(/\b(Sigil|issue|verify|find|registry)\b/g, '<span style="color: #6d28d9;">$1</span>')
    .replace(/\b(agent|capabilities|spendLimit|capability|rpc|wallet|minReputation)\b/g, '<span style="color: #b45309;">$1</span>');
}

function IntegrationCard({
  integration,
  index,
}: {
  integration: (typeof integrations)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="flex flex-col items-center gap-4 p-8 border border-border/60 rounded-2xl bg-card hover:border-foreground/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-default"
    >
      <div className="text-foreground/80">{integration.logo}</div>
      <div className="text-center">
        <div className="font-medium text-[15px] text-foreground tracking-tight">
          {integration.name}
        </div>
        <div className="text-[12px] text-muted-foreground mt-1 font-mono tracking-tighter opacity-70">
          {integration.description}
        </div>
      </div>
    </motion.div>
  );
}

export function IntegrationsSection() {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, margin: "-60px" });

  const sdkCode = `import { Sigil } from "@sigil/sdk";

const sigil = new Sigil({ rpc: helius.rpcUrl, wallet: provider });

// Issue a credential
const credential = await sigil.issue({ agent, capabilities, spendLimit });

// Verify in your server
const { authorized } = await sigil.verify({ agent, capability: "payments" });

// Discover agents by capability
const agents = await sigil.registry.find({ capability: "image-generation", minReputation: 4.0 });`;

  return (
    <section id="integrations" className="relative min-h-screen flex items-center py-24 border-t border-border snap-start bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-blue-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-muted-foreground/50 uppercase block mb-6"
          >
            Integrations
          </motion.span>
          
          <h2 className="hero-display text-[clamp(2rem,5vw,5rem)] text-foreground leading-[1.1]">
            <LineReveal delay={0.1}>Built on the protocols</LineReveal>
            <br />
            <LineReveal delay={0.25} className="italic">
              that matter.
            </LineReveal>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[1rem] md:text-[1.1rem] text-muted-foreground mt-8 max-w-lg mx-auto leading-relaxed px-4"
          >
            Sigil is composable by design. Drop it into your existing stack with
            a single middleware call.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {integrations.map((integration, i) => (
            <IntegrationCard
              key={integration.name}
              integration={integration}
              index={i}
            />
          ))}
        </div>

        {/* SDK preview - Improved mobile layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 md:mt-16 p-6 md:p-10 border border-border/60 rounded-2xl md:rounded-3xl bg-secondary/30 backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase ml-2">
                SDK · TypeScript
              </span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="font-mono text-[9px] md:text-[10px] text-muted-foreground/80 bg-background/50 border border-border/50 rounded-full px-3 py-1">
                @sigil/sdk
              </span>
              <CopyButton text={sdkCode} />
            </div>
          </div>
          <div className="font-mono text-[11px] md:text-[12px] text-foreground/80 leading-relaxed overflow-x-auto pb-2 custom-scrollbar">
            <div
              className="whitespace-pre min-w-[500px] lg:min-w-0"
              dangerouslySetInnerHTML={{ __html: highlightCode(sdkCode) }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
