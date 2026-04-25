import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SigilLogo } from "@/components/landing/SigilLogo";

const links = {
  Protocol: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Credentials", href: "#features" },
    { label: "Registry", href: "/registry" },
    { label: "Reputation", href: "#features" },
  ],
  Developers: [
    {
      label: "Documentation",
      href: "https://github.com/sigil-xyz/sigil",
      external: true,
    },
    {
      label: "SDK reference",
      href: "https://github.com/sigil-xyz/sigil/tree/main/packages/sdk",
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/sigil-xyz/sigil",
      external: true,
    },
    {
      label: "Changelog",
      href: "https://github.com/sigil-xyz/sigil/releases",
      external: true,
    },
  ],
  Company: [
    { label: "About", href: "#protocol" },
    { label: "Blog", href: "#" },
    { label: "Twitter", href: "https://twitter.com/sigilxyz", external: true },
    { label: "Contact", href: "mailto:hello@sigil.xyz" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background snap-start">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <SigilLogo
                width={22}
                height={26}
                className="text-foreground shrink-0"
              />
              <span className="hero-display text-[2.2rem] leading-none text-foreground tracking-tight">
                sigil
              </span>
            </Link>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[240px]">
              Cryptographic identity and trust infrastructure for the AI agent
              economy.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-wider text-muted-foreground/80 bg-secondary/80 border border-border/60 rounded-full px-3 py-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Devnet live
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-6">
              <div className="text-[11px] font-mono font-medium text-foreground/50 tracking-[0.2em] uppercase">
                {category}
              </div>
              <ul className="flex flex-col gap-3.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      {...("external" in item && item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-10 opacity-60" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-[13px] text-muted-foreground/60">© 2026 Sigil.</p>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/sigil-xyz/sigil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/50 hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            </Link>
            <Link
              href="https://twitter.com/sigilxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/50 hover:text-foreground transition-colors"
              aria-label="Twitter / X"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.257 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
