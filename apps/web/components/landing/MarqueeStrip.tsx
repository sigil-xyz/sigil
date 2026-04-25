"use client";

import { motion } from "framer-motion";

const items = [
  "Cryptographic Identity",
  "·",
  "Agent-to-Agent Verification",
  "·",
  "Automated Discovery",
  "·",
  "On-chain Reputation",
  "·",
  "Dynamic Authorization",
  "·",
  "Accountability Protocol",
  "·",
  "Economic Stake",
  "·",
  "Trustless Infrastructure",
  "·",
];

export function MarqueeStrip() {
  return (
    <div className="relative z-0 border-y border-border/50 overflow-hidden py-10 bg-background/50 backdrop-blur-sm marquee-wrapper group">
      {/* Gradient Masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="marquee-inner flex items-center gap-16 whitespace-nowrap w-max">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={
              item === "·"
                ? "text-muted-foreground/20 text-2xl"
                : "hero-display italic text-[1.4rem] md:text-[1.8rem] font-light text-foreground/30 tracking-wide"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

