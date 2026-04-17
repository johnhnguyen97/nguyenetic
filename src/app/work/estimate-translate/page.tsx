"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { LeadCapture } from "@/components/ui/lead-capture";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  label: string;
  note?: string;
  qty?: string;
  unit?: string;
  price?: string;
}

interface Translation {
  summary: string;
  lineItems: LineItem[];
  total?: string;
  tax?: string | null;
  rootCause: string;
  trustSignals: string[];
}

type Industry = "Auto" | "HVAC" | "Plumbing" | "Roofing" | "Body Shop" | "Electrical" | "Other";
type Style = "Friendly" | "Professional" | "Direct";
type ApproveState = "idle" | "approved" | "declined";

// ─── Sample estimates ─────────────────────────────────────────────────────────

const SAMPLES: Record<string, { industry: Industry; text: string }> = {
  auto: {
    industry: "Auto",
    text: `Lifter tick diagnosis: removed valve covers, confirmed collapsed lifters (cyl 4 & 7), recommend AFM delete kit + LS7 lifters, cam phaser lock-out, fresh oil pump, oil pan reseal. Labor: 14 hrs @ $125/hr. Parts: LS7 lifter kit $285, AFM delete $89, cam phasers $210 (2x), oil pump $145, gaskets & seals $95. Sublet: machine shop valley fill $180. Valve cover leak: reseal both valve covers, new grommets & PCV. Labor: 2 hrs. Parts: gasket set $48. Conventional oil change 5W-30, drain/fill, reset oil life. Labor: 0.5 hr. Parts: oil + filter $38. Total estimate: $2,727.`,
  },
  hvac: {
    industry: "HVAC",
    text: `R-22 system AC repair: capacitor blown (35/5 MFD 440V), replaced run cap. Fan motor seized (1/5 HP, 1075 RPM), replaced OEM-spec motor. System down on refrigerant — evacuated, pressure-tested, found 0.4 oz/hr leak at Schrader valve core, replaced core + valve, recharged 3 lbs R-22 @ $85/lb. Cleaned condenser coils (heavy fouling). Installed hard-start kit (SPP6 series). Labor: 3.5 hrs @ $110/hr. Parts: cap $18, motor $210, R-22 refrigerant $255, hard-start $65, misc fittings $24. Total: $957.`,
  },
  plumbing: {
    industry: "Plumbing",
    text: `Main sewer line blockage — camera inspection confirmed heavy root intrusion 28' from cleanout (oak root mass, 40% bore restriction). Recommend hydro-jetting 150' run at 4000 PSI, followed by partial CIPP liner 28–55' section (felt liner, UV cure). Camera re-inspection post-liner to confirm seal. Labor: hydro-jet 2 hrs + liner crew 4 hrs @ $145/hr. Materials: liner kit $580, jetting chemicals $45. Post-jet camera $185. Total estimate: $1,590.`,
  },
  roofing: {
    industry: "Roofing",
    text: `Hail damage assessment — 2.5" hail event, shingle bruising confirmed on 18 sq S-slope, N-slope intact. Partial re-roof 18 sq: tear-off existing 3-tab, install Grace Ice & Water Shield underlayment full field, 30# felt balance, Owens Corning Duration class-4 IR shingles. Replace 6 step-flash pipe boots (2", 3", 4" dia). Replace ridge cap 60 LF. Sidewall flashing reset. Labor: 2-day crew. Materials: shingles $1,980, underlayment $430, boots $210, ridge cap $155, nails/misc $85. Total: $4,890.`,
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[oklch(0.18_0.005_260)] rounded-lg animate-pulse ${className}`} />
  );
}

function TranslationSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-20" />
      <SkeletonBlock className="h-48" />
      <SkeletonBlock className="h-32" />
      <SkeletonBlock className="h-24" />
    </div>
  );
}

// ─── Translation output ───────────────────────────────────────────────────────

interface TranslationOutputProps {
  translation: Translation;
  photos: string[];
  industry: string;
  style: string;
  onApproveStateChange: (s: ApproveState) => void;
  approveState: ApproveState;
}

function TranslationOutput({
  translation,
  photos,
  industry,
  style,
  onApproveStateChange,
  approveState,
}: TranslationOutputProps) {
  const shouldReduce = useReducedMotion();
  const [showApproveCapture, setShowApproveCapture] = useState(false);

  const fade = shouldReduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <motion.div {...fade} transition={{ duration: 0.4 }} className="space-y-5">
      {/* Summary card */}
      <div className="bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-md border border-[oklch(0.74_0.15_55/20%)] rounded-2xl p-5">
        <p className="text-xs font-mono text-[oklch(0.74_0.15_55)] uppercase tracking-widest mb-2">What&apos;s happening</p>
        <p className="text-[oklch(0.97_0.008_80)] text-base leading-relaxed">{translation.summary}</p>
      </div>

      {/* Line items */}
      <div className="bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-md border border-[oklch(0.28_0.005_260)] rounded-2xl overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-[oklch(0.18_0.005_260)]">
          <p className="text-xs font-mono text-[oklch(0.74_0.15_55)] uppercase tracking-widest">What you&apos;re paying for</p>
        </div>
        <div className="divide-y divide-[oklch(0.14_0.005_260)]">
          {translation.lineItems.map((item, i) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[oklch(0.92_0.008_80)] text-sm font-medium leading-snug">{item.label}</p>
                {item.note && (
                  <p className="text-[oklch(0.55_0.01_260)] text-xs mt-0.5 leading-relaxed">{item.note}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                {(item.qty || item.unit) && (
                  <p className="text-[oklch(0.55_0.01_260)] text-xs">{[item.qty, item.unit].filter(Boolean).join(" ")}</p>
                )}
                {item.price && (
                  <p className="text-[oklch(0.92_0.008_80)] text-sm font-semibold font-mono">{item.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {(translation.total || translation.tax) && (
          <div className="px-5 py-4 border-t border-[oklch(0.22_0.005_260)] bg-[oklch(0.06_0.005_260/50%)]">
            {translation.tax && (
              <div className="flex justify-between text-xs text-[oklch(0.55_0.01_260)] mb-1.5">
                <span>Tax</span>
                <span className="font-mono">{translation.tax}</span>
              </div>
            )}
            {translation.total && (
              <div className="flex justify-between items-baseline">
                <span className="text-[oklch(0.75_0.005_260)] text-sm font-medium">Total estimate</span>
                <span className="text-[oklch(0.97_0.008_80)] text-2xl font-display font-bold font-mono">{translation.total}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Why you need this */}
      <div className="bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-md border border-[oklch(0.28_0.005_260)] rounded-2xl p-5">
        <p className="text-xs font-mono text-[oklch(0.74_0.15_55)] uppercase tracking-widest mb-2">Why you need this</p>
        <p className="text-[oklch(0.85_0.008_80)] text-sm leading-relaxed whitespace-pre-line">{translation.rootCause}</p>
      </div>

      {/* Trust signals */}
      {translation.trustSignals && translation.trustSignals.length > 0 && (
        <div className="bg-[oklch(0.06_0.02_140/30%)] backdrop-blur-md border border-[oklch(0.55_0.12_140/25%)] rounded-2xl p-5">
          <p className="text-xs font-mono text-[oklch(0.65_0.12_140)] uppercase tracking-widest mb-3">This isn&apos;t an upsell — here&apos;s why</p>
          <ul className="space-y-2">
            {translation.trustSignals.map((sig, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.65 0.12 140)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[oklch(0.80_0.008_80)] text-sm leading-relaxed">{sig}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div>
          <p className="text-xs font-mono text-[oklch(0.55_0.01_260)] uppercase tracking-widest mb-2">Attached photos</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {photos.map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[oklch(0.22_0.005_260)] bg-[oklch(0.10_0.005_260)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approve / Decline / Request call */}
      <AnimatePresence mode="wait">
        {approveState === "approved" ? (
          <motion.div
            key="approved"
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.96 }}
            animate={shouldReduce ? {} : { opacity: 1, scale: 1 }}
            className="bg-[oklch(0.06_0.02_140/30%)] border border-[oklch(0.55_0.12_140/30%)] rounded-2xl p-5"
          >
            {showApproveCapture ? (
              <LeadCapture
                appSlug="estimate-translate"
                context="customer-approved"
                buttonLabel="Send me a copy"
                onCaptured={() => setShowApproveCapture(false)}
                metadata={{ industry, style }}
              />
            ) : (
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[oklch(0.55_0.12_140/20%)] border border-[oklch(0.55_0.12_140/40%)] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.65 0.12 140)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="font-display font-semibold text-[oklch(0.97_0.008_80)] mb-1">Signed. Shop will be notified.</p>
                <p className="text-[oklch(0.65_0.008_80)] text-sm">
                  Want a copy?{" "}
                  <button
                    onClick={() => setShowApproveCapture(true)}
                    className="text-[oklch(0.74_0.15_55)] underline underline-offset-2"
                  >
                    Enter your email
                  </button>
                </p>
              </div>
            )}
          </motion.div>
        ) : approveState === "declined" ? (
          <motion.div
            key="declined"
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.96 }}
            animate={shouldReduce ? {} : { opacity: 1, scale: 1 }}
            className="bg-[oklch(0.08_0.005_260/60%)] border border-[oklch(0.28_0.005_260)] rounded-2xl p-5 text-center"
          >
            <p className="text-[oklch(0.75_0.005_260)] text-sm">Declined. The shop will follow up to address your concerns.</p>
            <button
              onClick={() => onApproveStateChange("idle")}
              className="mt-2 text-[oklch(0.74_0.15_55)] text-xs underline underline-offset-2"
            >
              Undo
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="actions"
            initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
            animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <button
              onClick={() => onApproveStateChange("approved")}
              className="py-4 px-5 rounded-2xl font-display font-semibold text-sm text-[oklch(0.08_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] transition-all shadow-[0_0_20px_oklch(0.74_0.15_55/25%)] active:scale-[0.98]"
              aria-label="Approve estimate"
            >
              Approve estimate
            </button>
            <button
              onClick={() => onApproveStateChange("declined")}
              className="py-4 px-5 rounded-2xl font-display font-semibold text-sm text-[oklch(0.92_0.008_80)] border border-[oklch(0.28_0.005_260)] bg-[oklch(0.08_0.005_260/40%)] hover:border-[oklch(0.38_0.005_260)] transition-all active:scale-[0.98]"
              aria-label="Decline estimate"
            >
              Decline
            </button>
            <a
              href="mailto:hello@nguyenetic.com?subject=Estimate%20Question"
              className="py-4 px-5 rounded-2xl font-display font-semibold text-sm text-[oklch(0.92_0.008_80)] border border-[oklch(0.28_0.005_260)] bg-[oklch(0.08_0.005_260/40%)] hover:border-[oklch(0.38_0.005_260)] transition-all active:scale-[0.98] text-center"
            >
              Request a call
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const INDUSTRIES: Industry[] = ["Auto", "HVAC", "Plumbing", "Roofing", "Body Shop", "Electrical", "Other"];
const STYLES: Style[] = ["Friendly", "Professional", "Direct"];

export default function EstimateTranslatePage() {
  const shouldReduce = useReducedMotion();

  const [estimateText, setEstimateText] = useState("");
  const [industry, setIndustry] = useState<Industry>("Auto");
  const [style, setStyle] = useState<Style>("Friendly");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [approveState, setApproveState] = useState<ApproveState>("idle");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const loadSample = useCallback((key: keyof typeof SAMPLES) => {
    const s = SAMPLES[key];
    setEstimateText(s.text);
    setIndustry(s.industry);
    setTranslation(null);
    setApproveState("idle");
    setError("");
  }, []);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - photos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === "string") {
          setPhotos((prev) => [...prev, result].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, [photos.length]);

  const removePhoto = useCallback((idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleTranslate = useCallback(async () => {
    if (!estimateText.trim()) {
      setError("Please paste or type an estimate first.");
      return;
    }
    setError("");
    setLoading(true);
    setTranslation(null);
    setApproveState("idle");

    try {
      const res = await fetch("/api/estimate-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimate: estimateText.trim(), industry, style, photos: photos.length }),
      });
      const data = (await res.json()) as { ok: boolean; translation?: Translation; error?: string };
      if (!data.ok || !data.translation) {
        setError(data.error ?? "Translation failed. Please try again.");
        return;
      }
      setTranslation(data.translation);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: shouldReduce ? "auto" : "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [estimateText, industry, style, photos.length, shouldReduce]);

  const fade = shouldReduce
    ? {}
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

  return (
    <main className="min-h-screen bg-[oklch(0.06_0.005_260)] text-[oklch(0.97_0.008_80)]">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center gap-4 border-b border-[oklch(0.12_0.005_260)]">
        <Link
          href="/"
          className="text-[oklch(0.55_0.01_260)] hover:text-[oklch(0.75_0.01_260)] text-sm transition-colors"
          aria-label="Back to home"
        >
          ← nguyenetic
        </Link>
        <span className="text-[oklch(0.30_0.005_260)]">/</span>
        <span className="text-[oklch(0.75_0.005_260)] text-sm">estimate-translate</span>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.p
          {...fade}
          transition={{ duration: 0.5 }}
          className="text-[oklch(0.50_0.01_260)] text-sm font-mono tracking-widest uppercase mb-4"
        >
          Auto · HVAC · Plumbing · Roofing · Body shop · Electrical
        </motion.p>
        <motion.h1
          {...fade}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-4 bg-gradient-to-br from-[oklch(0.97_0.008_80)] to-[oklch(0.75_0.008_80)] bg-clip-text text-transparent"
        >
          Your estimates read like an apology. This fixes that.
        </motion.h1>
        <motion.p
          {...fade}
          transition={{ duration: 0.5, delay: 0.10 }}
          className="text-[oklch(0.65_0.008_80)] text-lg leading-relaxed max-w-2xl mx-auto mb-6"
        >
          Paste your shop&apos;s technical estimate. We&apos;ll turn it into a plain-English customer version with itemized line items, plain explanations, and a one-tap approve button — no software swap.
        </motion.p>
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-block bg-[oklch(0.10_0.005_260/80%)] border border-[oklch(0.22_0.005_260)] rounded-xl px-4 py-2.5 text-sm text-[oklch(0.60_0.008_80)]"
        >
          Already have shop software? You just want your estimates to convert?{" "}
          <span className="text-[oklch(0.75_0.008_80)]">This is for you.</span>{" "}
          For a full photo-to-signed-estimate flow, see{" "}
          <Link href="/work/auto-quote" className="text-[oklch(0.74_0.15_55)] underline underline-offset-2 hover:text-[oklch(0.80_0.16_55)]">
            /work/auto-quote →
          </Link>
        </motion.div>
      </section>

      {/* Translator section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Input */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Textarea */}
            <div>
              <label htmlFor="estimate-input" className="block text-[oklch(0.75_0.005_260)] text-sm font-medium mb-2">
                Paste your estimate (or your tech&apos;s notes)
              </label>
              <textarea
                id="estimate-input"
                rows={10}
                value={estimateText}
                onChange={(e) => setEstimateText(e.target.value)}
                placeholder={`Ex: 'Replaced condenser fan motor (R-22 unit), evac + recharge 3 lbs R-22 @ $85/lb, cleaned coils, replaced capacitor, installed hard-start kit...'`}
                className="w-full px-4 py-3 rounded-2xl bg-[oklch(0.10_0.005_260)] border border-[oklch(0.22_0.005_260)] text-[oklch(0.92_0.008_80)] placeholder:text-[oklch(0.38_0.01_260)] text-sm leading-relaxed resize-y min-h-[180px] focus:outline-none focus:border-[oklch(0.74_0.15_55/50%)] transition-colors"
                aria-label="Technical estimate text"
              />
            </div>

            {/* Sample pills */}
            <div>
              <p className="text-[oklch(0.45_0.01_260)] text-xs uppercase tracking-wider mb-2">Or try a sample</p>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(SAMPLES) as [string, { industry: Industry; text: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => loadSample(key as keyof typeof SAMPLES)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[oklch(0.12_0.005_260)] border border-[oklch(0.22_0.005_260)] text-[oklch(0.65_0.008_80)] hover:border-[oklch(0.74_0.15_55/40%)] hover:text-[oklch(0.85_0.008_80)] transition-all"
                  >
                    {val.industry}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry picker */}
            <div>
              <p className="text-[oklch(0.55_0.01_260)] text-xs uppercase tracking-wider mb-2">Industry</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Industry selection">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    aria-pressed={industry === ind}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      industry === ind
                        ? "bg-[oklch(0.74_0.15_55/15%)] border border-[oklch(0.74_0.15_55/50%)] text-[oklch(0.85_0.15_55)]"
                        : "bg-[oklch(0.10_0.005_260)] border border-[oklch(0.20_0.005_260)] text-[oklch(0.55_0.01_260)] hover:border-[oklch(0.30_0.005_260)]"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Style picker */}
            <div>
              <p className="text-[oklch(0.55_0.01_260)] text-xs uppercase tracking-wider mb-2">Translation style</p>
              <div className="flex gap-2" role="group" aria-label="Translation style">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    aria-pressed={style === s}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      style === s
                        ? "bg-[oklch(0.74_0.15_55/15%)] border border-[oklch(0.74_0.15_55/50%)] text-[oklch(0.85_0.15_55)]"
                        : "bg-[oklch(0.10_0.005_260)] border border-[oklch(0.20_0.005_260)] text-[oklch(0.55_0.01_260)] hover:border-[oklch(0.30_0.005_260)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <p className="text-[oklch(0.55_0.01_260)] text-xs uppercase tracking-wider mb-2">
                Upload 2–4 photos <span className="text-[oklch(0.38_0.01_260)]">(optional)</span>
              </p>
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {photos.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[oklch(0.22_0.005_260)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[oklch(0.08_0.005_260/80%)] flex items-center justify-center text-[oklch(0.75_0.005_260)] hover:text-white text-xs"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {photos.length < 4 && (
                <>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="sr-only"
                    aria-label="Upload photos"
                  />
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-xl border border-dashed border-[oklch(0.25_0.005_260)] text-[oklch(0.45_0.01_260)] text-sm hover:border-[oklch(0.40_0.005_260)] hover:text-[oklch(0.65_0.01_260)] transition-all text-center"
                  >
                    + Add photos ({photos.length}/4)
                  </button>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm" role="alert">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleTranslate}
              disabled={loading || !estimateText.trim()}
              className="w-full py-4 px-6 rounded-2xl font-display font-bold text-base text-[oklch(0.06_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_oklch(0.74_0.15_55/30%)] active:scale-[0.98]"
              aria-busy={loading}
            >
              {loading ? "Translating..." : "Translate estimate"}
            </button>
          </motion.div>

          {/* Right: Output */}
          <div ref={outputRef}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={shouldReduce ? {} : { opacity: 0 }}
                  animate={shouldReduce ? {} : { opacity: 1 }}
                  exit={shouldReduce ? {} : { opacity: 0 }}
                >
                  <TranslationSkeleton />
                </motion.div>
              ) : translation ? (
                <motion.div
                  key="output"
                  initial={shouldReduce ? {} : { opacity: 0 }}
                  animate={shouldReduce ? {} : { opacity: 1 }}
                  exit={shouldReduce ? {} : { opacity: 0 }}
                >
                  <TranslationOutput
                    translation={translation}
                    photos={photos}
                    industry={industry}
                    style={style}
                    approveState={approveState}
                    onApproveStateChange={setApproveState}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={shouldReduce ? {} : { opacity: 0 }}
                  animate={shouldReduce ? {} : { opacity: 1 }}
                  exit={shouldReduce ? {} : { opacity: 0 }}
                  className="flex flex-col items-center justify-center h-80 text-center border border-dashed border-[oklch(0.18_0.005_260)] rounded-2xl"
                >
                  <svg className="mb-4 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <p className="text-[oklch(0.40_0.01_260)] text-sm">Your customer-friendly estimate will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Section 2: Funnel CTAs */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Per-use */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-md border border-[oklch(0.22_0.005_260)] rounded-2xl p-6 flex flex-col gap-4"
          >
            <div>
              <p className="font-display font-bold text-lg text-[oklch(0.97_0.008_80)] mb-1.5">
                Translate an estimate on the fly — $19 each.
              </p>
              <p className="text-[oklch(0.60_0.008_80)] text-sm leading-relaxed">
                We run this for any estimate you send. 2-minute turnaround, no subscription.
              </p>
            </div>
            <LeadCapture
              appSlug="estimate-translate"
              context="per-use-signup"
              buttonLabel="Get a quote"
              onCaptured={() => {}}
              metadata={{ plan: "per-use" }}
            />
          </motion.div>

          {/* Subscription */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.30 }}
            className="bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-md border border-[oklch(0.74_0.15_55/25%)] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-3 py-1 bg-[oklch(0.74_0.15_55/15%)] text-[oklch(0.80_0.15_55)] text-xs font-semibold rounded-bl-xl border-b border-l border-[oklch(0.74_0.15_55/25%)]">
              Most popular
            </div>
            <div>
              <p className="font-display font-bold text-lg text-[oklch(0.97_0.008_80)] mb-1.5">
                Subscribe for your whole shop — $49/mo unlimited.
              </p>
              <p className="text-[oklch(0.60_0.008_80)] text-sm leading-relaxed">
                Integrates with your existing shop software or email. Flat rate, cancel anytime.
              </p>
            </div>
            <LeadCapture
              appSlug="estimate-translate"
              context="subscription-waitlist"
              buttonLabel="Join waitlist"
              onCaptured={() => {}}
              metadata={{ plan: "subscription" }}
            />
          </motion.div>

          {/* Enterprise */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-md border border-[oklch(0.22_0.005_260)] rounded-2xl p-6 flex flex-col gap-4"
          >
            <div>
              <p className="font-display font-bold text-lg text-[oklch(0.97_0.008_80)] mb-1.5">
                Run a multi-location chain?
              </p>
              <p className="text-[oklch(0.60_0.008_80)] text-sm leading-relaxed">
                Custom integrations, white-label output, and volume pricing for groups of 5+ locations.
              </p>
            </div>
            <a
              href="mailto:hello@nguyenetic.com?subject=Estimate%20Translate%20Enterprise"
              className="w-full py-2.5 px-5 rounded-xl font-display font-semibold text-sm text-[oklch(0.92_0.008_80)] border border-[oklch(0.28_0.005_260)] bg-transparent hover:border-[oklch(0.42_0.005_260)] transition-all text-center block"
            >
              Contact us
            </a>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Before / After proof */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[oklch(0.97_0.008_80)] mb-3">
            Why this converts
          </h2>
          <p className="text-[oklch(0.60_0.008_80)] text-base max-w-xl mx-auto">
            The same work, two different outcomes. Shops using plain-English estimates close 35% more approvals.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Example 1: HVAC */}
          <BeforeAfterCard
            title="HVAC repair — capacitor, fan motor, recharge"
            before="R-22 system: cap blown (35/5 MFD 440V), replaced run cap. Fan motor seized (1/5 HP OEM spec), replaced. Evac, leak test, recharged 3 lbs R-22 @ $85/lb. Hard-start kit installed. Labor 3.5 hrs @ $110. Total: $957."
            after="Your air conditioner stopped working because two parts failed: the capacitor (a small electrical component that starts your system) burned out, and the fan motor that pushes air through your outdoor unit seized up. We also found your refrigerant was low due to a small leak, which we sealed and refilled. Your system is now fully repaired and running like new."
            commentary="The shop estimate reads like a parts list. The customer version explains what broke, why it matters, and that it&apos;s fixed — turning &quot;why is this $957&quot; into &quot;makes sense, let&apos;s do it.&quot;"
            shouldReduce={shouldReduce ?? false}
          />

          {/* Example 2: Auto */}
          <BeforeAfterCard
            title="Auto — lifter tick, valve cover leak, oil change"
            before="AFM delete kit, LS7 lifters cyl 4 & 7, cam phaser lock-out, oil pump, pan reseal. Valve cover reseal both sides, new PCV grommets. OCI 5W-30. 16.5 hrs labor @ $125. Total: $2,727."
            after="Your engine has a ticking noise caused by two collapsed lifters — small components inside the engine that control how the valves open and close. We&apos;ll replace them with heavy-duty versions and disable the cylinder deactivation system that caused the problem in the first place. We&apos;ll also reseal both valve covers (they&apos;re leaking oil) and do your oil change while the engine is open."
            commentary="&quot;Collapsed lifters&quot; sounds alarming and vague. The translation gives the customer a mental model, explains the root cause, and frames the scope of work in terms of outcomes — not part numbers."
            shouldReduce={shouldReduce ?? false}
          />

          {/* Example 3: Roofing */}
          <BeforeAfterCard
            title="Roofing — hail damage, partial re-roof"
            before="18 sq S-slope tear-off, Ice & Water Shield full field, 30# felt, OC Duration class-4 IR, 6 step-flash boots (2/3/4&quot;), ridge cap 60 LF, sidewall flashing reset. 2-day crew. Total: $4,890."
            after="A recent hailstorm bruised and cracked the shingles on the south side of your roof (the side that took the most impact). We&apos;ll remove the damaged shingles, install a waterproof membrane underneath, and lay new impact-resistant shingles rated to handle hail up to 2 inches. We&apos;ll also replace the rubber boots around your roof vents — hail cracks those too, and they&apos;re a common source of leaks."
            commentary="&quot;18 sq S-slope tear-off&quot; is meaningless to a homeowner. The translation grounds every item in plain terms, connects the work to the storm event, and surfaces the vent boots detail — which builds trust instead of triggering upsell suspicion."
            shouldReduce={shouldReduce ?? false}
          />
        </div>
      </section>
    </main>
  );
}

// ─── Before/After card ────────────────────────────────────────────────────────

function BeforeAfterCard({
  title,
  before,
  after,
  commentary,
  shouldReduce,
}: {
  title: string;
  before: string;
  after: string;
  commentary: string;
  shouldReduce: boolean;
}) {
  const fade = shouldReduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45 } };

  return (
    <motion.div
      {...fade}
      className="bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-md border border-[oklch(0.18_0.005_260)] rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-[oklch(0.12_0.005_260)]">
        <p className="font-display font-semibold text-[oklch(0.85_0.008_80)] text-sm">{title}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[oklch(0.12_0.005_260)]">
        <div className="px-5 py-5">
          <p className="text-[oklch(0.45_0.01_260)] text-xs uppercase tracking-wider font-mono mb-2">Shop-speak</p>
          <p className="text-[oklch(0.65_0.008_80)] text-sm leading-relaxed font-mono">{before}</p>
        </div>
        <div className="px-5 py-5">
          <p className="text-[oklch(0.65_0.12_140)] text-xs uppercase tracking-wider font-mono mb-2">Customer version</p>
          <p className="text-[oklch(0.88_0.008_80)] text-sm leading-relaxed">{after}</p>
        </div>
      </div>
      <div className="px-5 py-4 bg-[oklch(0.06_0.005_260/50%)] border-t border-[oklch(0.12_0.005_260)]">
        <p className="text-[oklch(0.50_0.01_260)] text-xs leading-relaxed italic">{commentary}</p>
      </div>
    </motion.div>
  );
}
