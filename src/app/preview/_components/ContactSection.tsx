export function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        width: "100%",
        background: "#080618",
        color: "#F5F0E8",
        fontFamily: "var(--font-inter)",
        padding: "140px 48px 80px",
        borderTop: "1px solid #FF8A3D20",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: 700,
          height: 700,
          transform: "translate(-50%, 0)",
          borderRadius: "50%",
          background: "radial-gradient(circle, #FF8A3D20 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative" }}>
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
          — section 005 · transmit
        </div>
        <h2
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: "clamp(64px, 8vw, 124px)",
            lineHeight: 0.9,
            margin: 0,
            fontWeight: 400,
            letterSpacing: "-0.03em",
          }}
        >
          Pull your problem<br />
          <span style={{ fontStyle: "italic", color: "#FF8A3D" }}>into orbit.</span>
        </h2>
        <p style={{ marginTop: 32, fontSize: 18, lineHeight: 1.55, color: "#F5F0E8AA", maxWidth: 580, margin: "32px auto 0" }}>
          Tell me what&apos;s broken. I&apos;ll tell you if I can fix it, what it&apos;ll cost,
          and when it&apos;ll ship. If not, I&apos;ll tell you who can.
        </p>

        <a
          href="mailto:hello@nguyenetic.com"
          style={{
            display: "inline-flex",
            marginTop: 48,
            background: "#FF8A3D",
            color: "#080618",
            textDecoration: "none",
            padding: "20px 36px",
            borderRadius: 32,
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
            alignItems: "center",
            gap: 12,
          }}
        >
          hello@nguyenetic.com <span style={{ fontSize: 16 }}>→</span>
        </a>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            gap: 24,
            justifyContent: "center",
            flexWrap: "wrap",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#F5F0E855",
          }}
        >
          <span>reply within 24h</span>
          <span style={{ color: "#FF8A3D" }}>·</span>
          <span>free scope call</span>
          <span style={{ color: "#FF8A3D" }}>·</span>
          <span>fixed price quote</span>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1440,
          margin: "120px auto 0",
          paddingTop: 32,
          borderTop: "1px solid #FF8A3D20",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#F5F0E855",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span>© 2026 nguyenetic · est 2024</span>
        <span style={{ color: "#FF8A3D" }}>◇ field stable · signal strong</span>
        <span>lat 37.7749° N · lon 122.4194° W</span>
      </div>
    </section>
  );
}
