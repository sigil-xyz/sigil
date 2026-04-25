import { cn } from "@/lib/utils";
import type { CapabilityType } from "@/types";

const labels: Record<CapabilityType, string> = {
  "image-generation": "Image Gen",
  "code-review": "Code Review",
  "translation": "Translation",
  "data-analysis": "Data Analysis",
  "ocr": "OCR",
  "audio-transcription": "Audio",
  "web-search": "Web Search",
  "document-processing": "Docs",
};

interface CapabilityBadgeProps {
  capability: CapabilityType;
  className?: string;
}

export function CapabilityBadge({ capability, className }: CapabilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full border border-border/70 bg-foreground/4 text-foreground/60",
        className
      )}
    >
      {labels[capability]}
    </span>
  );
}
