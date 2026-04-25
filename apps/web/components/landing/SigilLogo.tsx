"use client";

import { motion } from "framer-motion";

// Paths ordered clockwise from 12 o'clock
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

const N = spokes.length;
const CYCLE = 4; // seconds for one full rotation
const DIM = 0.28;

// Each spoke gets a smooth bell-shaped brightness peak at its clockwise position.
// We sample the full cycle at 4*N points so rise/fall are gradual.
function buildKeyframes(i: number) {
  const steps = N * 4; // 32 sample points
  const values: number[] = [];
  const times: number[] = [];

  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 → 1
    // spoke i peaks at fraction i/N through the cycle
    const peakT = i / N;
    // distance from this spoke's peak (wrapping around the circle)
    let dist = Math.abs(t - peakT);
    if (dist > 0.5) dist = 1 - dist; // wrap
    // bell curve: 1 at peak, DIM beyond half a spoke-width away
    const halfWidth = 0.5 / N;
    const normalized = Math.max(0, 1 - dist / halfWidth);
    const opacity = DIM + (1 - DIM) * normalized;
    values.push(parseFloat(opacity.toFixed(3)));
    times.push(t);
  }

  return { values, times };
}

interface SigilLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function SigilLogo({
  width = 22,
  height = 26,
  className = "",
}: SigilLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {spokes.map((d, i) => {
        const { values, times } = buildKeyframes(i);
        return (
          <motion.path
            key={i}
            fillRule="evenodd"
            clipRule="evenodd"
            d={d}
            fill="currentColor"
            animate={{ opacity: values }}
            transition={{
              duration: CYCLE,
              times,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          />
        );
      })}
    </svg>
  );
}
