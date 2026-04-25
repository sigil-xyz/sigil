import { cn } from "@/lib/utils";

interface ReputationStarsProps {
  score: number;
  className?: string;
}

export function ReputationStars({ score, className }: ReputationStarsProps) {
  const full = Math.floor(score);
  const partial = score - full;

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < full;
        const partialFill = !filled && i === full && partial > 0;
        return (
          <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
            {partialFill && (
              <defs>
                <linearGradient id={`star-${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${partial * 100}%`} stopColor="currentColor" stopOpacity="1" />
                  <stop offset={`${partial * 100}%`} stopColor="currentColor" stopOpacity="0.15" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M6 1L7.545 4.09L11 4.635L8.5 7.07L9.09 10.5L6 8.955L2.91 10.5L3.5 7.07L1 4.635L4.455 4.09L6 1Z"
              fill={filled ? "currentColor" : partialFill ? `url(#star-${i})` : "currentColor"}
              fillOpacity={filled ? 1 : partialFill ? 1 : 0.15}
            />
          </svg>
        );
      })}
      <span className="ml-1 font-mono text-[11px] text-muted-foreground">
        {score.toFixed(1)}
      </span>
    </span>
  );
}
