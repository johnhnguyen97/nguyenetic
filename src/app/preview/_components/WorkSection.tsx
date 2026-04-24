const WORK_ITEMS = [
  { n: "01", name: "Waste Ledger", stat: "$400/wk", tag: "restaurants" },
  { n: "02", name: "Call Rescue", stat: "$1,200/call", tag: "contractors" },
  { n: "03", name: "Review Reply", stat: "30 min/day", tag: "owners" },
  { n: "04", name: "Auto-Quote", stat: "3 drafts", tag: "service bays" },
  { n: "05", name: "Reservation Guard", stat: "15-30%", tag: "restaurants" },
  { n: "06", name: "SEO Scorecard", stat: "72/100", tag: "local" },
  { n: "07", name: "Estimate Tx", stat: "+41%", tag: "auto shops" },
];

export function WorkSection() {
  return (
    <section
      id="work"
      style={{
        width: "100%",
        background: "#F5F0E8",
        color: "#0A0A0A",
        fontFamily: "var(--font-inter)",
        padding: "120px 48px",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 56,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#0A0A0A66",
                marginBottom: 24,
              }}
            >
              — section 004 · work · 2026
            </div>
            <h2
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(56px, 7vw, 108px)",
                lineHeight: 0.88,
                margin: 0,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Seven things<br />
              <span style={{ fontStyle: "italic" }}>already paying</span><br />
              <span style={{ color: "#FF8A3D" }}>for themselves.</span>
            </h2>
          </div>
          <div
            style={{
              textAlign: "right",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#0A0A0A66",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                color: "#0A0A0A",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              07
            </div>
            <div style={{ marginTop: 8, textTransform: "uppercase" }}>live · shipping</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 24 }}>
          <div
            style={{
              background: "#0A0A0A",
              color: "#F5F0E8",
              padding: 48,
              borderRadius: 20,
              position: "relative",
              overflow: "hidden",
              minHeight: 380,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <svg
              width="100%"
              height="140"
              viewBox="0 0 600 140"
              style={{ position: "absolute", right: -80, top: 40, opacity: 0.3 }}
            >
              {[40, 65, 50, 85, 70, 95, 82].map((h, i) => (
                <rect key={i} x={i * 78} y={140 - h} width="56" height={h} fill="#FF8A3D" opacity={0.4 + i * 0.08} />
              ))}
            </svg>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#FF8A3D",
                }}
              >
                featured · #04
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontSize: 76,
                  margin: "20px 0 0",
                  lineHeight: 0.95,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                Waste Ledger.
              </h3>
              <p style={{ marginTop: 24, maxWidth: 420, fontSize: 16, lineHeight: 1.55, color: "#F5F0E8BB" }}>
                Restaurants toss $400/wk in the dumpster. Toast makes you swap your whole POS.
                This doesn&apos;t. Log a loss in 3 taps, get a weekly heatmap.
              </p>
            </div>
            <div style={{ position: "relative", display: "flex", gap: 44, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-instrument)", fontSize: 64, color: "#FF8A3D", fontStyle: "italic", lineHeight: 1 }}>−34%</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", color: "#F5F0E866", marginTop: 8 }}>
                  WASTE · MO 1 → MO 3
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-instrument)", fontSize: 64, color: "#F5F0E8", fontStyle: "italic", lineHeight: 1 }}>$1.6k</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", color: "#F5F0E866", marginTop: 8 }}>
                  SAVED · FIRST QUARTER
                </div>
              </div>
              <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#FF8A3D" }}>
                TRY IT →
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
            {[WORK_ITEMS[1], WORK_ITEMS[5]].map((w) => (
              <div
                key={w.n}
                style={{
                  background: "#fff",
                  padding: 28,
                  borderRadius: 16,
                  border: "1px solid #0A0A0A15",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", color: "#0A0A0A55", marginBottom: 8 }}>
                    #{w.n} · {w.tag}
                  </div>
                  <h4 style={{ fontFamily: "var(--font-instrument)", fontSize: 40, margin: 0, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {w.name}
                  </h4>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ fontFamily: "var(--font-instrument)", fontSize: 42, fontStyle: "italic", color: "#FF8A3D", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {w.stat}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#0A0A0A" }}>↗</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[WORK_ITEMS[0], WORK_ITEMS[2], WORK_ITEMS[4], WORK_ITEMS[6]].map((w) => (
            <div
              key={w.n}
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 14,
                border: "1px solid #0A0A0A15",
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", color: "#0A0A0A55" }}>
                #{w.n} · {w.tag}
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--font-instrument)", fontSize: 30, margin: "0 0 6px", fontWeight: 400, letterSpacing: "-0.01em" }}>
                  {w.name}
                </h4>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#FF8A3D" }}>{w.stat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
