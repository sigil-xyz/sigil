"use client";

import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const spokes = [
  "M18.5 19V4L21.5 4V19H18.5Z",
  "M22.4754 19.404L33.082 8.79736L35.2034 10.9187L26.7181 19.404L22.4754 19.404Z",
  "M18.5 22.5L40 22.5V25.5L18.5 25.5V22.5Z",
  "M26.7178 28.5963L35.2031 37.0815L33.0818 39.2029L22.4752 28.5963H26.7178Z",
  "M18.5 44V29H21.5V44H18.5Z",
  "M4.79776 37.0816L15.4044 26.475L17.5257 28.5964L6.91908 39.203L4.79776 37.0816Z",
  "M2.62269e-07 22.5L15 22.5V25.5L0 25.5L2.62269e-07 22.5Z",
  "M6.91885 8.79727L17.5255 19.4039L15.4041 21.5252L4.79753 10.9186L6.91885 8.79727Z",
];

function CrystallizingLogo({ progress }: { progress: number }) {
  return (
    <svg width="80" height="92" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {spokes.map((d, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const scatterRange = 20 * (1 - progress / 100);
        const xOffset = Math.cos(angle) * scatterRange;
        const yOffset = Math.sin(angle) * scatterRange;
        
        return (
          <motion.path
            key={i}
            d={d}
            fill="currentColor"
            style={{
              x: xOffset,
              y: yOffset,
              opacity: 0.1 + (progress / 100) * 0.9,
              scale: 0.8 + (progress / 100) * 0.2,
              rotate: (1 - progress / 100) * 45,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        );
      })}
    </svg>
  );
}

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  
  const springProgress = useSpring(0, { stiffness: 40, damping: 20 });
  const blurValue = useTransform(springProgress, [0, 100], [0, 40]);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const next = Math.min((step / steps) * 100, 100);
      setPercent(next);
      springProgress.set(next);
      
      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => setLoading(false), 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [springProgress]);

  return (
    <AnimatePresence>
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          {/* Frosted Glass Panels */}
          <div className="absolute inset-0 flex pointer-events-none">
            {/* Left Panel */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ 
                x: "-100%",
                transition: { duration: 1.4, ease: [0.85, 0, 0.15, 1], delay: 0.2 } 
              }}
              className="relative w-1/2 h-full bg-white/40 backdrop-blur-[40px] border-r border-white/20 pointer-events-auto shadow-[20px_0_40px_rgba(0,0,0,0.02)]"
            >
              {/* Internal Glass Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            </motion.div>
            
            {/* Right Panel */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ 
                x: "100%",
                transition: { duration: 1.4, ease: [0.85, 0, 0.15, 1], delay: 0.2 } 
              }}
              className="relative w-1/2 h-full bg-white/40 backdrop-blur-[40px] border-l border-white/20 pointer-events-auto shadow-[-20px_0_40px_rgba(0,0,0,0.02)]"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-white/20 to-transparent opacity-50" />
            </motion.div>
          </div>

          {/* Invisible Split Line that strikes during exit */}
          <motion.div 
            initial={{ opacity: 0, scaleY: 0 }}
            exit={{ 
              opacity: [0, 1, 0],
              scaleY: [0, 1, 1],
              transition: { duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.2 }
            }}
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/10 z-[106] pointer-events-none"
          />

          {/* Center Content */}
          <motion.div
            key="center-content"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 0.9,
              filter: "blur(10px)",
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="relative z-[110] flex flex-col items-center pointer-events-none"
          >
            {/* Crystallizing Logo */}
            <div className="relative mb-16">
              <CrystallizingLogo progress={percent} />
              
              {/* Dynamic light refraction behind logo */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-40px] bg-gradient-to-tr from-emerald-500/20 via-blue-500/10 to-transparent blur-3xl rounded-full -z-10"
              />
            </div>

            {/* Premium Typography */}
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="hero-display text-[3.5rem] font-light tracking-tighter tabular-nums text-black/80 leading-none">
                  {Math.round(percent)}<span className="text-black/10 text-[2rem] ml-1">%</span>
                </div>
                
                {/* Minimalist Progress Line */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-black/[0.03]">
                  <motion.div 
                    className="h-full bg-black/20"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-mono text-[10px] tracking-[0.5em] text-black/30 uppercase font-bold"
                >
                  Authenticating Identity
                </motion.div>
                
                {/* Subtle activity dots */}
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 h-1 rounded-full bg-black/10"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 pointer-events-none z-[105] bg-gradient-to-b from-white/5 via-transparent to-black/[0.02]" />
        </div>
      )}
    </AnimatePresence>
  );
}