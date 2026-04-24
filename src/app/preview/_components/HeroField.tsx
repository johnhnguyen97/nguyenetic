"use client";

import { useEffect, useState } from "react";
import { OrbitN } from "./OrbitN";

const FIELD_PRODUCTS = [
  { name: "Auto-Quote", short: "AQ", angle: 8, radius: 310, tag: "auto" },
  { name: "Reservation", short: "RG", angle: 56, radius: 340, tag: "restaurants" },
  { name: "SEO Scorecard", short: "SS", angle: 110, radius: 300, tag: "local" },
  { name: "Waste Ledger", short: "WL", angle: 162, radius: 355, tag: "kitchen" },
  { name: "Review Reply", short: "RR", angle: 212, radius: 295, tag: "owners" },
  { name: "Call Rescue", short: "CR", angle: 262, radius: 340, tag: "phones" },
  { name: "Estimate Tx", short: "ET", angle: 316, radius: 320, tag: "service bays" },
];

export function HeroField() {
  const [t, setT] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf: number;
    const loop = (ts: number) => {
      setT(ts / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const centerX = 1040;
  const centerY = 480;

  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#080618",
        color: "#F5F0E8",
        fontFamily: "var(--font-inter)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient warm glow */}
      <div
        style={{
          position: "absolute",
          top: centerY - 420,
          left: "calc(50% + 100px)",
          width: 840,
          height: 840,
          transform: "translate(-50%, 0)",
          borderRadius: "50%",
          background: "radial-gradient(circle, #FF8A3D35 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* background grid */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.08 }}
      >
        <defs>
          <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#F5F0E8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* orbit rings */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 980"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[200, 260, 320, 380].map((r, i) => (
          <circle
            key={r}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="#FF8A3D"
            strokeWidth="0.5"
            strokeDasharray={i % 2 ? "4 10" : "none"}
            opacity={0.22 - i * 0.03}
          />
        ))}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const x1 = centerX + Math.cos(a) * 186;
          const y1 = centerY + Math.sin(a) * 186;
          const x2 = centerX + Math.cos(a) * 196;
          const y2 = centerY + Math.sin(a) * 196;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FF8A3D"
              strokeWidth="1"
              opacity="0.35"
            />
          );
        })}
        <line
          x1={centerX - 220}
          y1={centerY}
          x2={centerX + 220}
          y2={centerY}
          stroke="#FF8A3D"
          strokeWidth="0.5"
          opacity="0.1"
        />
        <line
          x1={centerX}
          y1={centerY - 220}
          x2={centerX}
          y2={centerY + 220}
          stroke="#FF8A3D"
          strokeWidth="0.5"
          opacity="0.1"
        />
      </svg>

      {/* nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "22px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "#080618EE" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #FF8A3D22" : "1px solid transparent",
          transition: "all .3s ease",
        }}
      >
        <OrbitN size={40} />
        <div
          style={{
            display: "flex",
            gap: 40,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#F5F0E899",
          }}
        >
          <a href="#work" style={{ textDecoration: "none" }}>work</a>
          <a href="#services" style={{ textDecoration: "none" }}>services</a>
          <a href="#proof" style={{ textDecoration: "none" }}>receipts</a>
          <a href="#contact" style={{ textDecoration: "none" }}>contact</a>
        </div>
        <a
          href="#contact"
          style={{
            background: "#FF8A3D",
            color: "#080618",
            textDecoration: "none",
            padding: "11px 22px",
            borderRadius: "24px",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          transmit →
        </a>
      </nav>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "minmax(480px, 640px) 1fr",
          padding: "72px 48px 120px",
          gap: 40,
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {/* left column */}
        <div style={{ paddingTop: 60 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#FF8A3D",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF8A3D",
                boxShadow: "0 0 12px #FF8A3D",
              }}
            />
            ◇ 07 satellites live · 01 operator
          </div>
          <h1
            style={{
              fontFamily: "var(--font-instrument)",
              fontSize: "clamp(72px, 9vw, 128px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            A studio<br />
            <span style={{ color: "#FF8A3D", fontStyle: "italic" }}>in orbit</span><br />
            around<br />
            <u
              style={{
                textDecorationColor: "#FF8A3D",
                textUnderlineOffset: 14,
                textDecorationThickness: 4,
              }}
            >
              you.
            </u>
          </h1>
          <p
            style={{
              marginTop: 40,
              fontSize: 17,
              lineHeight: 1.6,
              color: "#F5F0E8AA",
              maxWidth: 460,
            }}
          >
            Managed websites, design, and digital ops for small service businesses.
            Seven shipped products. One human at the core. Each orbit is a problem
            someone wrote a check to solve.
          </p>

          <div style={{ marginTop: 44, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <a
              href="#work"
              style={{
                background: "#FF8A3D",
                color: "#080618",
                textDecoration: "none",
                padding: "16px 28px",
                borderRadius: "28px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              see the receipts <span style={{ fontSize: 14 }}>→</span>
            </a>
            <a
              href="#services"
              style={{
                color: "#F5F0E8",
                textDecoration: "none",
                padding: "16px 0",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                borderBottom: "1px solid #F5F0E844",
              }}
            >
              what I do
            </a>
          </div>

          <div
            style={{
              marginTop: 36,
              display: "flex",
              gap: 28,
              alignItems: "center",
              flexWrap: "wrap",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#F5F0E855",
            }}
          >
            <span>14-day turnaround</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF8A3D" }} />
            <span>fixed price</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF8A3D" }} />
            <span>receipts on everything</span>
          </div>
        </div>

        {/* right column: orbit field */}
        <div style={{ position: "relative", height: 760 }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%) rotate(${Math.sin(t * 0.3) * 1.5}deg)`,
              textAlign: "center",
              transition: "transform 0.1s",
            }}
          >
            <OrbitN size={180} showLabel={false} />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "#FF8A3D",
                marginTop: -8,
              }}
            >
              — core —
            </div>
          </div>

          {FIELD_PRODUCTS.map((p, i) => {
            const baseAngle = (p.angle * Math.PI) / 180;
            const angle = baseAngle + t * 0.06 + i * 0.005;
            const x = Math.cos(angle) * p.radius;
            const y = Math.sin(angle) * p.radius * 0.7;
            return (
              <div
                key={p.name}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  minWidth: 140,
                  padding: "12px 16px",
                  background: "#0806184D",
                  backdropFilter: "blur(10px)",
                  border: "1px solid #FF8A3D40",
                  borderRadius: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  boxShadow: "0 8px 24px #00000040",
                  cursor: "pointer",
                  transition: "border-color .2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#FF8A3D";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#FF8A3D40";
                }}
              >
                <div style={{ color: "#FF8A3D", fontSize: 9, letterSpacing: "0.25em", marginBottom: 4 }}>
                  {p.short}
                </div>
                <div style={{ color: "#F5F0E8", fontSize: 12, letterSpacing: "0.05em" }}>
                  {p.name}
                </div>
                <div
                  style={{
                    color: "#F5F0E855",
                    fontSize: 9,
                    marginTop: 3,
                    letterSpacing: "0.2em",
                  }}
                >
                  {p.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#F5F0E855",
          borderTop: "1px solid #FF8A3D20",
          paddingTop: 16,
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        <span>lat 37.7749° N · lon 122.4194° W</span>
        <span style={{ color: "#FF8A3D" }}>● field stable · signal strong</span>
        <span>scroll ↓ to enter gravity</span>
      </div>
    </section>
  );
}
