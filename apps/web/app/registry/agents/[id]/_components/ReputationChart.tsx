"use client";

import { useMemo } from "react";
import type { ReputationPoint } from "@/types";

interface ReputationChartProps {
  data: ReputationPoint[];
}

export function ReputationChart({ data }: ReputationChartProps) {
  const { pathD, areaD, ticks } = useMemo(() => {
    if (data.length < 2) return { pathD: "", areaD: "", ticks: [] };

    const W = 600;
    const H = 160;
    const padX = 8;
    const padY = 12;

    const minScore = Math.max(0, Math.min(...data.map((d) => d.score)) - 0.3);
    const maxScore = Math.min(5, Math.max(...data.map((d) => d.score)) + 0.3);

    function x(i: number) {
      return padX + (i / (data.length - 1)) * (W - 2 * padX);
    }
    function y(score: number) {
      return padY + (1 - (score - minScore) / (maxScore - minScore)) * (H - 2 * padY);
    }

    const points = data.map((d, i) => ({ x: x(i), y: y(d.score) }));

    // Catmull-rom-like smooth path
    function smooth(pts: { x: number; y: number }[]) {
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cpx = (prev.x + curr.x) / 2;
        d += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
      }
      return d;
    }

    const linePath = smooth(points);
    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x},${H - padY} L ${points[0].x},${H - padY} Z`;

    // X-axis ticks (every 7 days)
    const tickIndices = data.map((_, i) => i).filter((i) => i % 7 === 0);
    const tickData = tickIndices.map((i) => ({
      xi: x(i),
      label: new Date(data[i].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

    return { pathD: linePath, areaD: areaPath, ticks: tickData };
  }, [data]);

  if (!pathD) return null;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox="0 0 600 160"
        className="w-full"
        style={{ height: 160 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#repGrad)" className="text-foreground" />
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground" />
        {ticks.map((t) => (
          <g key={t.xi}>
            <line
              x1={t.xi}
              y1={148}
              x2={t.xi}
              y2={152}
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
              className="text-foreground"
            />
            <text
              x={t.xi}
              y={160}
              textAnchor="middle"
              fontSize="8"
              fill="currentColor"
              fillOpacity="0.3"
              className="text-foreground font-mono"
            >
              {t.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
