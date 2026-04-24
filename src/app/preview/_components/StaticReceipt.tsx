"use client";

export function StaticReceipt() {
  const lineItems = [
    { desc: "Discovery call", qty: "1", price: "$0" },
    { desc: "Wireframes + copy", qty: "3", price: "$800" },
    { desc: "Design system", qty: "1", price: "$1,200" },
    { desc: "Build + integration", qty: "14d", price: "$4,400" },
    { desc: "SEO + analytics", qty: "1", price: "$600" },
    { desc: "30-day support", qty: "30d", price: "incl." },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        background: "radial-gradient(ellipse at 50% 60%, #1a1a2e 0%, #0A0A0A 75%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -40,
          top: "50%",
          transform: "translateY(-50%)",
          width: 220,
          height: 340,
          background: "linear-gradient(180deg, #FF8A3D10, #FF8A3D04)",
          border: "1px solid #FF8A3D18",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-instrument)",
          fontSize: 140,
          fontStyle: "italic",
          color: "#FF8A3D22",
          letterSpacing: "-0.05em",
        }}
      >
        N
      </div>

      <div
        style={{
          position: "relative",
          width: 340,
          background: "#F5F0E8",
          color: "#0A0A0A",
          padding: "32px 28px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          lineHeight: 1.6,
          boxShadow: "0 40px 80px #00000099, 0 10px 24px #00000060",
          transform: "rotate(-2.5deg)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            textAlign: "center",
            borderBottom: "1px dashed #0A0A0A66",
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-instrument)",
              fontSize: 28,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
            }}
          >
            nguyenetic
          </div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#0A0A0A88", marginTop: 6 }}>
            A STUDIO IN ORBIT
          </div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#0A0A0A88", marginBottom: 12 }}>
          INVOICE №07 · 2026-03-14<br />
          CLIENT: WASTE LEDGER CO.
        </div>
        <div
          style={{
            borderTop: "1px dashed #0A0A0A44",
            borderBottom: "1px dashed #0A0A0A44",
            padding: "10px 0",
            marginBottom: 12,
          }}
        >
          {lineItems.map((l, i) => (
            <div
              key={i}
              style={{ display: "grid", gridTemplateColumns: "1fr 40px 70px", gap: 4, fontSize: 11 }}
            >
              <span>{l.desc}</span>
              <span style={{ textAlign: "right", color: "#0A0A0A88" }}>{l.qty}</span>
              <span style={{ textAlign: "right" }}>{l.price}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600 }}>
          <span>TOTAL</span>
          <span>$7,000</span>
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "#0A0A0A88",
            marginTop: 14,
            textAlign: "center",
          }}
        >
          — FIXED PRICE · FIXED SHIP DATE —<br />
          SHIPPED 14 DAYS · ON TIME
        </div>

        <div
          style={{
            position: "absolute",
            right: -10,
            bottom: 48,
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: "3px solid #FF8A3D",
            color: "#FF8A3D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            transform: "rotate(14deg)",
            background: "#FF8A3D15",
            opacity: 0.92,
          }}
        >
          <div style={{ fontFamily: "var(--font-instrument)", fontSize: 32, fontStyle: "italic", lineHeight: 1 }}>
            N
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.25em", marginTop: 2 }}>
            PAID · 07
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: 0,
            right: 0,
            height: 12,
            background:
              "repeating-linear-gradient(90deg, #F5F0E8 0, #F5F0E8 8px, transparent 8px, transparent 14px)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "35%",
          top: "60%",
          width: 260,
          height: 320,
          background: "#F5F0E8cc",
          borderRadius: 2,
          transform: "translate(-50%, -50%) rotate(8deg)",
          boxShadow: "0 20px 40px #00000060",
          opacity: 0.55,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "#F5F0E866",
          zIndex: 3,
        }}
      >
        ◇ receipt · invoice №07 · stamped
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "#FF8A3D",
          zIndex: 3,
        }}
      >
        — signed, nguyenetic
      </div>
    </div>
  );
}
