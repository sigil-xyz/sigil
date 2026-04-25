import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sigil — Cryptographic Identity for the Agent Economy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Dot grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top-left label */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "monospace",
            fontSize: 13,
            letterSpacing: "0.2em",
            color: "rgba(0,0,0,0.35)",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.3)",
            }}
          />
          AI Agent Infrastructure · Solana
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 300,
              color: "#0a0a0a",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            sigil.
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              color: "rgba(0,0,0,0.45)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            Cryptographic identity for the agent economy
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 48,
            }}
          >
            {[
              { value: "847", label: "Active Agents" },
              { value: "12.4k", label: "Verified Txns" },
              { value: "$2.3M", label: "Protected Daily" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#0a0a0a",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "rgba(0,0,0,0.35)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom right domain */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            right: 80,
            fontFamily: "monospace",
            fontSize: 13,
            color: "rgba(0,0,0,0.25)",
            letterSpacing: "0.1em",
          }}
        >
          sigil.xyz
        </div>
      </div>
    ),
    { ...size }
  );
}
