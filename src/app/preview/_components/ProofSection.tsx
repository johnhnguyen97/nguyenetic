import { StaticReceipt } from "./StaticReceipt";

export function ProofSection() {
  return (
    <section
      id="proof"
      style={{
        width: "100%",
        background: "#0A0A0A",
        color: "#F5F0E8",
        fontFamily: "var(--font-inter)",
        padding: "120px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(400px, 520px) 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#FF8A3D",
              marginBottom: 32,
            }}
          >
            — section 002 · the promise
          </div>
          <h2
            style={{
              fontFamily: "var(--font-instrument)",
              fontSize: "clamp(56px, 6vw, 88px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            We hand you<br />the receipt,<br />
            <span style={{ fontStyle: "italic", color: "#FF8A3D" }}>not the estimate.</span>
          </h2>
          <p style={{ marginTop: 32, fontSize: 17, lineHeight: 1.6, color: "#F5F0E8AA", maxWidth: 440 }}>
            Every engagement ends with a stamped receipt of exactly what we shipped, what it cost,
            and what it&apos;s earning you. No retainers you can&apos;t read. No &quot;strategic alignment.&quot;
            Just work and numbers.
          </p>

          <div
            style={{
              marginTop: 40,
              display: "grid",
              gap: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.12em",
              color: "#F5F0E8CC",
            }}
          >
            {[
              ["01", "Fixed scope", "written before we start"],
              ["02", "Fixed price", "no surprise line items"],
              ["03", "Fixed deadline", "or the month is free"],
            ].map(([n, t, s]) => (
              <div
                key={n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 180px 1fr",
                  gap: 16,
                  padding: "12px 0",
                  borderBottom: "1px solid #F5F0E815",
                }}
              >
                <span style={{ color: "#FF8A3D" }}>{n}</span>
                <span>{t}</span>
                <span style={{ color: "#F5F0E866", textTransform: "lowercase" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: 580,
            borderRadius: 16,
            border: "1px solid #FF8A3D22",
            overflow: "hidden",
          }}
        >
          <StaticReceipt />
        </div>
      </div>
    </section>
  );
}
