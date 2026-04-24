const SERVICES_PROMISES = [
  { num: "01", label: "Web dev", promise: "From wireframe to production in", metric: "14 days" },
  { num: "02", label: "SEO", promise: "Local ranking moved within", metric: "30 days" },
  { num: "03", label: "Ads", promise: "First qualified lead in", metric: "72 hours" },
  { num: "04", label: "Brand", promise: "A mark you'll still love in", metric: "10 years" },
  { num: "05", label: "AI tools", promise: "A custom workflow shipped in", metric: "1 week" },
  { num: "06", label: "Retainer", promise: "A team on standby in", metric: "1 Slack" },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      style={{
        width: "100%",
        background: "#080618",
        color: "#F5F0E8",
        fontFamily: "var(--font-inter)",
        padding: "120px 48px",
        borderTop: "1px solid #FF8A3D20",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#FF8A3D",
            marginBottom: 24,
          }}
        >
          — section 003 · services
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 64,
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-instrument)",
              fontSize: "clamp(56px, 7vw, 104px)",
              lineHeight: 0.9,
              margin: 0,
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Six promises.<br />
            <span style={{ fontStyle: "italic", color: "#F5F0E866" }}>One handshake.</span>
          </h2>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#F5F0E866",
              maxWidth: 280,
              lineHeight: 1.7,
            }}
          >
            Each number below is a deadline,<br />not a hope. Miss one, get<br />the month free.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            borderTop: "1px solid #F5F0E822",
          }}
        >
          {SERVICES_PROMISES.map((s, i) => (
            <div
              key={s.num}
              style={{
                borderRight: i % 3 !== 2 ? "1px solid #F5F0E822" : "none",
                borderBottom: "1px solid #F5F0E822",
                padding: "40px 36px",
                position: "relative",
                minHeight: 280,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: "#F5F0E855",
                  marginBottom: 24,
                }}
              >
                {s.num} / {s.label}
              </div>
              <div style={{ fontSize: 20, lineHeight: 1.4, color: "#F5F0E8CC", marginBottom: 24 }}>
                {s.promise}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontSize: 72,
                  fontStyle: "italic",
                  lineHeight: 1,
                  color: "#FF8A3D",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.metric}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 24,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "#FF8A3D99",
                }}
              >
                ↗ read the terms
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
