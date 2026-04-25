import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import { WalletProvider } from "@/providers/WalletProvider";
import { PrincipalProvider } from "@/providers/PrincipalProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://sigil.xyz";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Sigil — Cryptographic Identity for the Agent Economy",
    template: "%s — Sigil",
  },

  description:
    "Sigil issues on-chain credentials that prove who an AI agent is, what it's authorized to do, and who's accountable when it acts. The trust layer for autonomous AI agents transacting on Solana.",

  keywords: [
    "AI agents",
    "agent identity",
    "Solana",
    "on-chain credentials",
    "AI trust layer",
    "agent economy",
    "cryptographic identity",
    "agent authorization",
    "x402",
    "MCP",
    "AI accountability",
    "agent registry",
    "decentralized identity",
    "AI agent infrastructure",
    "autonomous agents",
    "Web3 AI",
    "Solana DeFi",
    "agent credentials",
    "reputation scoring",
    "smart contract identity",
  ],

  authors: [{ name: "Sigil", url: BASE_URL }],
  creator: "Sigil",
  publisher: "Sigil",
  applicationName: "Sigil",
  referrer: "origin-when-cross-origin",
  category: "technology",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Sigil",
    title: "Sigil — Cryptographic Identity for the Agent Economy",
    description:
      "Issue on-chain credentials for AI agents. Prove identity, enforce spend limits, track reputation, and hold agents accountable — all on Solana.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sigil — Cryptographic Identity for the Agent Economy",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@sigilxyz",
    creator: "@sigilxyz",
    title: "Sigil — Cryptographic Identity for the Agent Economy",
    description:
      "Issue on-chain credentials for AI agents. Prove identity, enforce spend limits, track reputation, and hold agents accountable — all on Solana.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // Add actual verification codes when deploying
    // google: "your-google-verification-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Sigil",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon.svg`,
      },
      description:
        "Sigil is the cryptographic identity and trust layer for autonomous AI agents on Solana. Issue verifiable credentials, enforce spend limits, and track agent reputation on-chain.",
      sameAs: ["https://twitter.com/sigilxyz"],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Sigil",
      description:
        "Cryptographic identity and trust infrastructure for the AI agent economy on Solana.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/registry?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Sigil",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: BASE_URL,
      description:
        "On-chain identity, authorization, and accountability infrastructure for autonomous AI agents. Built on Solana.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative bg-background text-foreground">
        <WalletProvider>
          <PrincipalProvider>
            {children}
          </PrincipalProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
