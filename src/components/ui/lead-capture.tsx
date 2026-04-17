"use client";

import { useState } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";

interface LeadCaptureProps {
  appSlug: string;
  context: string;
  trigger?: "button" | "inline" | "modal";
  buttonLabel?: string;
  onCaptured: (email: string) => void;
  className?: string;
  metadata?: Record<string, string | number>;
}

const ROLE_OPTIONS = ["Owner", "Manager", "Marketing", "Other"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LeadCapture({
  appSlug,
  context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trigger,
  buttonLabel = "Email me a copy",
  onCaptured,
  className = "",
  metadata,
}: LeadCaptureProps) {
  const shouldReduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appSlug,
          context,
          email,
          name: name || undefined,
          company: company || undefined,
          role: role || undefined,
          source: "web",
          metadata: metadata || undefined,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setCaptured(true);
      onCaptured(email);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formVariants = {
    initial: shouldReduce ? {} : { opacity: 0, y: 12 },
    animate: shouldReduce ? {} : { opacity: 1, y: 0 },
    exit: shouldReduce ? {} : { opacity: 0, y: -8 },
  };

  if (captured) {
    return (
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        className={`bg-[oklch(0.08_0.005_260/40%)] backdrop-blur-md border border-[oklch(0.74_0.15_55/20%)] rounded-2xl p-5 text-center ${className}`}
      >
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[oklch(0.74_0.15_55/15%)] border border-[oklch(0.74_0.15_55/30%)] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.74 0.15 55)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display font-semibold text-[oklch(0.97_0.008_80)]">On its way.</p>
        <p className="text-[oklch(0.75_0.005_260)] text-sm mt-1">Check {email} — we sent your copy.</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        className={`bg-[oklch(0.08_0.005_260/40%)] backdrop-blur-md border border-[oklch(0.74_0.15_55/20%)] rounded-2xl p-5 ${className}`}
      >
        <p className="font-display font-semibold text-[oklch(0.97_0.008_80)] mb-1">{buttonLabel}</p>
        <p className="text-[oklch(0.75_0.005_260)] text-sm mb-4">No spam. Just this one file.</p>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2.5 rounded-xl bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.97_0.008_80)] placeholder:text-[oklch(0.45_0.01_260)] text-sm focus:outline-none focus:border-[oklch(0.74_0.15_55/60%)] transition-colors"
            />
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              className="w-full px-3 py-2.5 rounded-xl bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.97_0.008_80)] placeholder:text-[oklch(0.45_0.01_260)] text-sm focus:outline-none focus:border-[oklch(0.74_0.15_55/60%)] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Company (optional)"
              value={company}
              onChange={e => setCompany(e.target.value)}
              autoComplete="organization"
              className="w-full px-3 py-2.5 rounded-xl bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.97_0.008_80)] placeholder:text-[oklch(0.45_0.01_260)] text-sm focus:outline-none focus:border-[oklch(0.74_0.15_55/60%)] transition-colors"
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-sm focus:outline-none focus:border-[oklch(0.74_0.15_55/60%)] transition-colors appearance-none"
              style={{ color: role ? "oklch(0.97 0.008 80)" : "oklch(0.45 0.01 260)" }}
            >
              <option value="" disabled>Role (optional)</option>
              {ROLE_OPTIONS.map(r => (
                <option key={r} value={r} style={{ color: "oklch(0.97 0.008 80)", background: "oklch(0.14 0.005 260)" }}>{r}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-xs" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-5 rounded-xl font-display font-semibold text-sm text-[oklch(0.08_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_oklch(0.74_0.15_55/25%)]"
          >
            {loading ? "Sending..." : buttonLabel}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
