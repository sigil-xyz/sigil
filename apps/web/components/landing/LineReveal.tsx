"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LineRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function LineReveal({
  children,
  delay = 0,
  className = "",
  once = true,
}: LineRevealProps) {
  return (
    <span className={cn("line-reveal-parent overflow-hidden inline-block", className)}>
      <motion.span
        initial={{ y: "105%", rotate: 1.5 }}
        whileInView={{ y: "0%", rotate: 0 }}
        viewport={{ once, margin: "-80px" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}
