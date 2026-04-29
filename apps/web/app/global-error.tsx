"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: "#ffffff", fontFamily: "monospace" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#dc2626" }}>
            Critical Error
          </p>
          <h1 style={{ fontSize: "3rem", fontWeight: 300, lineHeight: 1 }}>sigil.</h1>
          <p style={{ fontSize: "11px", color: "#6b7280" }}>The application encountered a fatal error.</p>
          <button
            onClick={reset}
            style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", border: "none", background: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
