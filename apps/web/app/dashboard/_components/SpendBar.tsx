"use client";

import { motion } from "framer-motion";

interface SpendBarProps {
  spent: number;
  limit: number;
}

export function SpendBar({ spent, limit }: SpendBarProps) {
  const pct = Math.min(100, (spent / limit) * 100);
  const danger = pct >= 90;
  const warn = pct >= 70;

  return (
    <div className="space-y-1">
      <div className="w-full h-1 bg-foreground/8 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${danger ? "bg-destructive" : warn ? "bg-amber-500" : "bg-foreground/50"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground/50">
        <span>${spent}</span>
        <span>${limit}</span>
      </div>
    </div>
  );
}
