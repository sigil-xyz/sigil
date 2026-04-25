"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { SigilLogo } from "./SigilLogo";

// Unique cryptographic-style logs for the "infrastructure" feel
const LOG_MESSAGES = [
  "DECRYPTING_IDENTITY_HASH...",
  "VERIFYING_SOLANA_MAINNET_STATE...",
  "ATTESTING_AGENT_CAPABILITIES...",
  "BOOTSTRAPPING_REPUTATION_ENGINE...",
  "INITIALIZING_SIGIL_PROTOCOL_V0.8.2...",
  "ESTABLISHING_TRUSTLESS_HANDSHAKE...",
  "COMPILING_DYNAMIC_AUTHORIZATION...",
  "SYNCING_ONCHAIN_REGISTRY...",
];

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3200);

    const progressInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) return 100;
        const jump = Math.random() > 0.85 ? 12 : 2;
        return Math.min(prev + jump, 100);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <SigilLogo width={60} height={70} className="text-foreground" />
            </motion.div>

            {/* Brand Reveal */}
            <div className="overflow-hidden mb-8">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="hero-display text-[2.8rem] tracking-tight text-foreground"
              >
                sigil
              </motion.div>
            </div>

            {/* Clean Progress Bar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-[1px] bg-foreground/10 overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: `${percent - 100}%` }}
                  transition={{ ease: "linear" }}
                  className="absolute inset-0 w-full h-full bg-foreground"
                />
              </div>
              <div className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60 uppercase">
                {percent}% Initialization
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
