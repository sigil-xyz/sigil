"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <span className="font-mono text-[9px] tracking-[0.25em] text-destructive uppercase">
          Runtime Error
        </span>
        <h1 className="hero-display text-[3rem] leading-none text-foreground tracking-tight">
          Something<br />
          <span className="italic text-muted-foreground/60">went wrong.</span>
        </h1>
        <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest">
          {error.digest ?? "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="font-mono text-[11px] uppercase tracking-[0.3em] border-b-2 border-foreground/20 pb-1 text-foreground hover:text-foreground/70 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
