"use client";

import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LeadCapture } from "@/components/ui/lead-capture";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Draft {
  label: string;
  reply: string;
  rationale: string;
}

type Industry = "Restaurant" | "Auto" | "Salon" | "Dental" | "Retail" | "Home Services" | "Other";
type Voice = "Warm" | "Professional" | "Playful" | "Firm";

interface RefineState {
  draftIdx: number | null;
  instruction: string;
  customInstruction: string;
}

interface PageState {
  review: string;
  industry: Industry | "";
  voice: Voice;
  drafts: Draft[];
  loading: boolean;
  error: string;
  generationCount: number;
  usageGated: boolean;
  refine: RefineState;
  refineLoading: number | null;
  leadCaptured: boolean;
}

type PageAction =
  | { type: "SET_REVIEW"; payload: string }
  | { type: "SET_INDUSTRY"; payload: Industry }
  | { type: "SET_VOICE"; payload: Voice }
  | { type: "SET_DRAFTS"; payload: Draft[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_GENERATION_COUNT"; payload: number }
  | { type: "SET_USAGE_GATED"; payload: boolean }
  | { type: "SET_REFINE"; payload: Partial<RefineState> }
  | { type: "SET_REFINE_LOADING"; payload: number | null }
  | { type: "UPDATE_DRAFT"; payload: { idx: number; draft: Draft } }
  | { type: "CLOSE_REFINE" }
  | { type: "SET_LEAD_CAPTURED"; payload: boolean };

function reducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case "SET_REVIEW": return { ...state, review: action.payload };
    case "SET_INDUSTRY": return { ...state, industry: action.payload };
    case "SET_VOICE": return { ...state, voice: action.payload };
    case "SET_DRAFTS": return { ...state, drafts: action.payload };
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_GENERATION_COUNT": return { ...state, generationCount: action.payload };
    case "SET_USAGE_GATED": return { ...state, usageGated: action.payload };
    case "SET_REFINE": return { ...state, refine: { ...state.refine, ...action.payload } };
    case "SET_REFINE_LOADING": return { ...state, refineLoading: action.payload };
    case "UPDATE_DRAFT": {
      const newDrafts = [...state.drafts];
      newDrafts[action.payload.idx] = action.payload.draft;
      return { ...state, drafts: newDrafts };
    }
    case "CLOSE_REFINE": return { ...state, refine: { draftIdx: null, instruction: "", customInstruction: "" } };
    case "SET_LEAD_CAPTURED": return { ...state, leadCaptured: action.payload };
    default: return state;
  }
}

const DAILY_LIMIT = 5;
const STORAGE_KEY = "rr_usage";

function getTodayCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date: string; count: number };
    const today = new Date().toISOString().slice(0, 10);
    return parsed.date === today ? parsed.count : 0;
  } catch {
    return 0;
  }
}

function incrementTodayCount(): number {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const current = getTodayCount();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: next }));
    return next;
  } catch {
    return 1;
  }
}

// ─── Sample Reviews ───────────────────────────────────────────────────────────

const SAMPLES: { label: string; industry: Industry; review: string }[] = [
  {
    label: "1★ Worst service (auto)",
    industry: "Auto",
    review: "Absolute worst experience I've ever had at an auto shop. Brought my car in for a simple oil change and they had it for 4 hours without calling me once. When I finally called them, they acted like I was bothering them. Oil light came back on 2 days later. Never going back.",
  },
  {
    label: "1★ Worst (restaurant)",
    industry: "Restaurant",
    review: "Completely ruined our anniversary dinner. We had a reservation and waited 45 minutes to be seated. The steak I ordered medium-rare came out well-done, the server was dismissive when I mentioned it, and we were charged for a dish we never received. The manager didn't even come to our table.",
  },
  {
    label: "2★ Cold food",
    industry: "Restaurant",
    review: "Food was cold when it arrived and the portion sizes have really shrunk compared to a year ago. The flavors are still good but paying $18 for a lukewarm pasta dish that's barely half-full is hard to justify. Service was fine, no complaints there.",
  },
  {
    label: "2★ Rude receptionist",
    industry: "Salon",
    review: "The stylist did a decent job on my hair but the receptionist was incredibly rude when I called to reschedule. She acted like it was a huge inconvenience and put me on hold for 12 minutes. Won't be back simply because of how unwelcoming the front desk is.",
  },
  {
    label: "3★ OK but expensive",
    industry: "Dental",
    review: "The dentist and hygienist were both professional and thorough. My issue is purely with the billing — I was quoted one price, and the final bill was almost 30% higher after unannounced fees were added. I wish there was more transparency upfront about costs.",
  },
  {
    label: "3★ Mixed feelings",
    industry: "Retail",
    review: "Mixed feelings about this place. The product selection is great and the store is clean and organized. But when I needed help finding something specific, two different employees gave me conflicting answers and I ended up leaving without buying anything.",
  },
  {
    label: "4★ Pretty good",
    industry: "Restaurant",
    review: "Pretty good overall — the food was fresh and the cocktails were creative. Service was a bit slow on a Thursday night when it wasn't even that busy. Would definitely come back, just hoping the pacing improves. The truffle fries were the highlight.",
  },
  {
    label: "4★ Decent",
    industry: "Auto",
    review: "Decent shop, fair prices. They diagnosed the issue correctly and fixed it in a reasonable time. Communication could be better — I had to call twice to get updates rather than them calling me. Work quality seems solid so I'll probably return.",
  },
  {
    label: "5★ Amazing!",
    industry: "Salon",
    review: "I'm obsessed with my new cut. I showed my stylist a photo and she nailed it perfectly, actually even better than the inspiration. She gave me great tips for maintaining it at home. I've been to a lot of salons and this is the first time I've left 100% happy. Booking again already.",
  },
  {
    label: "5★ Incredible work",
    industry: "Home Services",
    review: "Hired them to repaint the exterior of my house and I couldn't be more pleased. The crew was professional, on time every day, and cleaned up spotlessly each evening. The prep work was meticulous and the finish looks absolutely perfect. Worth every penny — highest recommendation.",
  },
];

const INDUSTRIES: Industry[] = ["Restaurant", "Auto", "Salon", "Dental", "Retail", "Home Services", "Other"];
const VOICES: Voice[] = ["Warm", "Professional", "Playful", "Firm"];

const REFINE_PRESETS = ["Make it shorter", "Make it warmer", "Apologize more", "Add a solution"];

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[oklch(0.28_0.005_260)] bg-[oklch(0.08_0.005_260/60%)] p-5 space-y-3 animate-pulse">
      <div className="h-4 w-24 rounded bg-[oklch(0.22_0.005_260)]" />
      <div className="space-y-2">
        <div className="h-3 rounded bg-[oklch(0.22_0.005_260)]" />
        <div className="h-3 w-4/5 rounded bg-[oklch(0.22_0.005_260)]" />
        <div className="h-3 w-3/5 rounded bg-[oklch(0.22_0.005_260)]" />
      </div>
      <div className="h-3 w-full rounded bg-[oklch(0.18_0.005_260)]" />
    </div>
  );
}

// ─── Draft Card ───────────────────────────────────────────────────────────────

function DraftCard({
  draft,
  idx,
  onCopy,
  onRegenerate,
  onRefine,
  isRefining,
  refineState,
  onRefineChange,
  onRefineSubmit,
  onRefineClose,
  shouldReduce,
}: {
  draft: Draft;
  idx: number;
  onCopy: (text: string) => void;
  onRegenerate: (idx: number) => void;
  onRefine: (idx: number) => void;
  isRefining: boolean;
  refineState: RefineState;
  onRefineChange: (partial: Partial<RefineState>) => void;
  onRefineSubmit: (idx: number) => void;
  onRefineClose: () => void;
  shouldReduce: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isRefineOpen = refineState.draftIdx === idx;

  function handleCopy() {
    navigator.clipboard.writeText(draft.reply).catch(() => {});
    setCopied(true);
    onCopy(draft.reply);
    setTimeout(() => setCopied(false), 2000);
  }

  const cardVariants = {
    initial: shouldReduce ? {} : { opacity: 0, y: 16 },
    animate: shouldReduce ? {} : { opacity: 1, y: 0, transition: { delay: idx * 0.1 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="rounded-2xl border border-[oklch(0.28_0.005_260)] bg-[oklch(0.08_0.005_260/60%)] backdrop-blur-sm p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.74_0.15_55)]">
          {draft.label}
        </span>
        <span className="text-xs text-[oklch(0.45_0.01_260)]">
          {draft.reply.length} chars
        </span>
      </div>

      <p className="text-[oklch(0.97_0.008_80)] text-sm leading-relaxed">{draft.reply}</p>

      <p className="text-[oklch(0.55_0.008_260)] text-xs italic border-t border-[oklch(0.22_0.005_260)] pt-2">
        {draft.rationale}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.75_0.005_260)] hover:text-[oklch(0.97_0.008_80)] hover:border-[oklch(0.74_0.15_55/40%)] transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={() => onRegenerate(idx)}
          disabled={isRefining}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.75_0.005_260)] hover:text-[oklch(0.97_0.008_80)] hover:border-[oklch(0.74_0.15_55/40%)] transition-colors disabled:opacity-40"
        >
          {isRefining ? "Refining..." : "Regenerate"}
        </button>
        <button
          onClick={() => onRefine(idx)}
          disabled={isRefining}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[oklch(0.74_0.15_55/10%)] border border-[oklch(0.74_0.15_55/30%)] text-[oklch(0.74_0.15_55)] hover:bg-[oklch(0.74_0.15_55/20%)] transition-colors disabled:opacity-40"
        >
          Refine →
        </button>
      </div>

      <AnimatePresence>
        {isRefineOpen && (
          <motion.div
            key="refine-panel"
            initial={shouldReduce ? {} : { opacity: 0, height: 0 }}
            animate={shouldReduce ? {} : { opacity: 1, height: "auto" }}
            exit={shouldReduce ? {} : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[oklch(0.22_0.005_260)] pt-3 mt-1 space-y-3">
              <p className="text-xs text-[oklch(0.55_0.008_260)]">How should we refine this draft?</p>
              <div className="flex flex-wrap gap-2">
                {REFINE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onRefineChange({ instruction: preset, customInstruction: "" })}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      refineState.instruction === preset
                        ? "bg-[oklch(0.74_0.15_55/20%)] border border-[oklch(0.74_0.15_55/50%)] text-[oklch(0.74_0.15_55)]"
                        : "bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.75_0.005_260)]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or type a custom instruction..."
                value={refineState.customInstruction}
                onChange={(e) => onRefineChange({ customInstruction: e.target.value, instruction: "" })}
                className="w-full px-3 py-2 rounded-xl bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.97_0.008_80)] placeholder:text-[oklch(0.45_0.01_260)] text-xs focus:outline-none focus:border-[oklch(0.74_0.15_55/60%)] transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onRefineSubmit(idx)}
                  disabled={isRefining || (!refineState.instruction && !refineState.customInstruction)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] text-[oklch(0.08_0.005_260)] disabled:opacity-40 hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] transition-all"
                >
                  {isRefining ? "Refining..." : "Apply"}
                </button>
                <button
                  onClick={onRefineClose}
                  className="px-3 py-1.5 rounded-lg text-xs text-[oklch(0.55_0.008_260)] hover:text-[oklch(0.75_0.005_260)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ReviewReplyPage() {
  const shouldReduce = useReducedMotion();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    review: "",
    industry: "",
    voice: "Warm",
    drafts: [],
    loading: false,
    error: "",
    generationCount: 0,
    usageGated: false,
    refine: { draftIdx: null, instruction: "", customInstruction: "" },
    refineLoading: null,
    leadCaptured: false,
  });

  useEffect(() => {
    const count = getTodayCount();
    dispatch({ type: "SET_GENERATION_COUNT", payload: count });
    if (count >= DAILY_LIMIT) {
      dispatch({ type: "SET_USAGE_GATED", payload: true });
    }
  }, []);

  const canGenerate =
    state.review.trim().length > 0 &&
    state.industry !== "" &&
    !state.loading &&
    !state.usageGated;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: "" });
    dispatch({ type: "SET_DRAFTS", payload: [] });

    try {
      const res = await fetch("/api/review-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: state.review,
          industry: state.industry,
          voice: state.voice,
        }),
      });

      const data = (await res.json()) as { ok: boolean; drafts?: Draft[]; error?: string };

      if (!data.ok || !data.drafts) {
        dispatch({ type: "SET_ERROR", payload: data.error ?? "Generation failed. Please try again." });
        return;
      }

      const newCount = incrementTodayCount();
      dispatch({ type: "SET_GENERATION_COUNT", payload: newCount });
      if (newCount >= DAILY_LIMIT) {
        dispatch({ type: "SET_USAGE_GATED", payload: true });
      }
      dispatch({ type: "SET_DRAFTS", payload: data.drafts });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Network error. Please try again." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [canGenerate, state.review, state.industry, state.voice]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  const handleSampleClick = (sample: (typeof SAMPLES)[number]) => {
    dispatch({ type: "SET_REVIEW", payload: sample.review });
    dispatch({ type: "SET_INDUSTRY", payload: sample.industry });
    textareaRef.current?.focus();
  };

  const handleRefineSubmit = useCallback(
    async (idx: number) => {
      const draft = state.drafts[idx];
      if (!draft) return;

      const instruction =
        state.refine.customInstruction || state.refine.instruction;
      if (!instruction) return;

      dispatch({ type: "SET_REFINE_LOADING", payload: idx });

      try {
        const res = await fetch("/api/review-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            review: state.review,
            industry: state.industry,
            voice: state.voice,
            refineInstruction: instruction,
            previousDraft: draft.reply,
          }),
        });

        const data = (await res.json()) as { ok: boolean; drafts?: Draft[]; error?: string };
        if (data.ok && data.drafts?.[0]) {
          dispatch({ type: "UPDATE_DRAFT", payload: { idx, draft: data.drafts[0] } });
          dispatch({ type: "CLOSE_REFINE" });
        } else {
          dispatch({ type: "SET_ERROR", payload: data.error ?? "Refinement failed." });
        }
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Network error during refinement." });
      } finally {
        dispatch({ type: "SET_REFINE_LOADING", payload: null });
      }
    },
    [state.drafts, state.refine, state.review, state.industry, state.voice]
  );

  const handleRegenerate = useCallback(
    async (idx: number) => {
      const draft = state.drafts[idx];
      if (!draft) return;

      dispatch({ type: "SET_REFINE_LOADING", payload: idx });

      try {
        const res = await fetch("/api/review-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            review: state.review,
            industry: state.industry,
            voice: state.voice,
            refineInstruction: "Rewrite this with a fresh angle",
            previousDraft: draft.reply,
          }),
        });

        const data = (await res.json()) as { ok: boolean; drafts?: Draft[]; error?: string };
        if (data.ok && data.drafts?.[0]) {
          dispatch({ type: "UPDATE_DRAFT", payload: { idx, draft: data.drafts[0] } });
        }
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Regeneration failed." });
      } finally {
        dispatch({ type: "SET_REFINE_LOADING", payload: null });
      }
    },
    [state.drafts, state.review, state.industry, state.voice]
  );

  const remaining = Math.max(0, DAILY_LIMIT - state.generationCount);

  const fadeIn = shouldReduce
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.005_260)] text-[oklch(0.97_0.008_80)]">
      {/* Usage counter */}
      <div className="fixed top-4 right-4 z-50 text-xs text-[oklch(0.55_0.008_260)] bg-[oklch(0.08_0.005_260/80%)] backdrop-blur border border-[oklch(0.22_0.005_260)] rounded-full px-3 py-1.5">
        <span className={remaining === 0 ? "text-red-400" : remaining <= 2 ? "text-[oklch(0.74_0.15_55)]" : ""}>
          {state.generationCount}/{DAILY_LIMIT}
        </span>{" "}
        free today
      </div>

      {/* Back nav */}
      <nav className="px-6 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[oklch(0.55_0.008_260)] hover:text-[oklch(0.97_0.008_80)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </Link>
      </nav>

      {/* Hero */}
      <motion.header
        {...fadeIn}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-6 pt-10 pb-12"
      >
        <p className="text-[oklch(0.55_0.008_260)] text-sm tracking-widest uppercase mb-3 font-medium">
          Restaurants · Auto · Salons · Dental · Retail · Home Services
        </p>
        <h1 className="font-display font-bold text-[clamp(2rem,6vw,4rem)] leading-tight mb-4">
          Write the perfect review reply{" "}
          <span className="text-[oklch(0.74_0.15_55)]">in 10 seconds.</span>
        </h1>
        <p className="text-[oklch(0.75_0.005_260)] text-lg max-w-2xl leading-relaxed">
          Paste a real review. Pick an industry and a voice. Get 3 drafts — professional, warm, or firm — with a one-line rationale on each.{" "}
          <strong className="text-[oklch(0.97_0.008_80)] font-semibold">No signup required. 5 free generations per day.</strong>
        </p>
      </motion.header>

      {/* Main playground */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left column — input controls */}
          <div className="lg:sticky lg:top-8 space-y-5">

            {/* Review textarea */}
            <div className="space-y-2">
              <label htmlFor="review-text" className="block text-sm font-medium text-[oklch(0.75_0.005_260)]">
                Review text
              </label>
              <textarea
                id="review-text"
                ref={textareaRef}
                rows={6}
                value={state.review}
                onChange={(e) => dispatch({ type: "SET_REVIEW", payload: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder="Paste a Google or Yelp review here..."
                aria-label="Paste the customer review here"
                className="w-full px-4 py-3 rounded-2xl bg-[oklch(0.10_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.97_0.008_80)] placeholder:text-[oklch(0.40_0.01_260)] text-sm leading-relaxed resize-y focus:outline-none focus:border-[oklch(0.74_0.15_55/60%)] transition-colors"
              />
              <p className="text-right text-xs text-[oklch(0.40_0.01_260)]">
                {state.review.length} chars · Cmd+Enter to generate
              </p>
            </div>

            {/* Sample pills */}
            <div className="space-y-2">
              <p className="text-xs text-[oklch(0.55_0.008_260)]">Or try a sample:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSampleClick(s)}
                    className="px-2.5 py-1 rounded-full text-xs border border-[oklch(0.28_0.005_260)] bg-[oklch(0.12_0.005_260)] text-[oklch(0.65_0.008_260)] hover:text-[oklch(0.97_0.008_80)] hover:border-[oklch(0.74_0.15_55/40%)] transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[oklch(0.75_0.005_260)]">Industry</label>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select industry">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    role="radio"
                    aria-checked={state.industry === ind}
                    onClick={() => dispatch({ type: "SET_INDUSTRY", payload: ind })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      state.industry === ind
                        ? "bg-[oklch(0.74_0.15_55/15%)] border border-[oklch(0.74_0.15_55/60%)] text-[oklch(0.74_0.15_55)]"
                        : "bg-[oklch(0.12_0.005_260)] border border-[oklch(0.22_0.005_260)] text-[oklch(0.65_0.008_260)] hover:text-[oklch(0.97_0.008_80)] hover:border-[oklch(0.40_0.005_260)]"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[oklch(0.75_0.005_260)]">Voice</label>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select voice tone">
                {VOICES.map((v) => (
                  <button
                    key={v}
                    role="radio"
                    aria-checked={state.voice === v}
                    onClick={() => dispatch({ type: "SET_VOICE", payload: v })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      state.voice === v
                        ? "bg-[oklch(0.74_0.15_55/15%)] border border-[oklch(0.74_0.15_55/60%)] text-[oklch(0.74_0.15_55)]"
                        : "bg-[oklch(0.12_0.005_260)] border border-[oklch(0.22_0.005_260)] text-[oklch(0.65_0.008_260)] hover:text-[oklch(0.97_0.008_80)] hover:border-[oklch(0.40_0.005_260)]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button or usage gate */}
            <AnimatePresence mode="wait">
              {state.usageGated && !state.leadCaptured ? (
                <motion.div
                  key="gate"
                  initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
                  animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-[oklch(0.75_0.005_260)]">
                    You&apos;ve used your <strong className="text-[oklch(0.97_0.008_80)]">5 free generations</strong> for today.
                  </p>
                  <LeadCapture
                    appSlug="review-reply"
                    context="usage-limit-waitlist"
                    buttonLabel="Join waitlist"
                    onCaptured={() => {
                      dispatch({ type: "SET_LEAD_CAPTURED", payload: true });
                      dispatch({ type: "SET_USAGE_GATED", payload: false });
                      const newCount = 0;
                      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: new Date().toISOString().slice(0, 10), count: newCount }));
                      dispatch({ type: "SET_GENERATION_COUNT", payload: newCount });
                    }}
                  />
                </motion.div>
              ) : (
                <motion.button
                  key="generate-btn"
                  initial={shouldReduce ? {} : { opacity: 0 }}
                  animate={shouldReduce ? {} : { opacity: 1 }}
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  aria-label="Generate 3 reply drafts"
                  className="w-full py-3.5 px-6 rounded-2xl font-display font-semibold text-[oklch(0.08_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_oklch(0.74_0.15_55/25%)] hover:shadow-[0_0_40px_oklch(0.74_0.15_55/40%)]"
                >
                  {state.loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating drafts...
                    </span>
                  ) : (
                    "Generate 3 replies"
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {state.error && (
              <p className="text-red-400 text-xs" role="alert">{state.error}</p>
            )}
          </div>

          {/* Right column — draft cards */}
          <div className="space-y-4">
            {state.loading && state.drafts.length === 0 ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : state.drafts.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {state.drafts.map((draft, idx) => (
                  <DraftCard
                    key={`${draft.label}-${idx}`}
                    draft={draft}
                    idx={idx}
                    onCopy={() => {}}
                    onRegenerate={handleRegenerate}
                    onRefine={(i) =>
                      dispatch({
                        type: "SET_REFINE",
                        payload: { draftIdx: i, instruction: "", customInstruction: "" },
                      })
                    }
                    isRefining={state.refineLoading === idx}
                    refineState={state.refine}
                    onRefineChange={(partial) => dispatch({ type: "SET_REFINE", payload: partial })}
                    onRefineSubmit={handleRefineSubmit}
                    onRefineClose={() => dispatch({ type: "CLOSE_REFINE" })}
                    shouldReduce={shouldReduce ?? false}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div className="rounded-2xl border border-dashed border-[oklch(0.22_0.005_260)] p-10 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full border border-[oklch(0.22_0.005_260)] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.40 0.01 260)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <p className="text-[oklch(0.45_0.01_260)] text-sm">Your 3 draft replies will appear here.</p>
                <p className="text-[oklch(0.35_0.008_260)] text-xs">Paste a review and click Generate.</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Funnel CTAs ─────────────────────────────────────────────────────── */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CTA 1: Autopilot waitlist */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[oklch(0.74_0.15_55/20%)] bg-[oklch(0.08_0.005_260/80%)] p-6 space-y-4"
          >
            <h2 className="font-display font-bold text-lg text-[oklch(0.97_0.008_80)]">
              Want this running on autopilot for every review?
            </h2>
            <p className="text-[oklch(0.65_0.008_260)] text-sm leading-relaxed">
              Review Autopilot pulls reviews from Google + Yelp + Facebook, drafts a reply in your voice, and queues them for your 1-tap approval.{" "}
              <strong className="text-[oklch(0.97_0.008_80)]">$29/mo per location, first month free.</strong>
            </p>
            <LeadCapture
              appSlug="review-reply"
              context="autopilot-waitlist"
              buttonLabel="Join waitlist"
              onCaptured={() => {}}
            />
          </motion.div>

          {/* CTA 2: White-glove retainer */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="rounded-2xl border border-[oklch(0.28_0.005_260)] bg-[oklch(0.08_0.005_260/60%)] p-6 space-y-4 flex flex-col"
          >
            <h2 className="font-display font-bold text-lg text-[oklch(0.97_0.008_80)]">
              Need white-glove review management?
            </h2>
            <p className="text-[oklch(0.65_0.008_260)] text-sm leading-relaxed flex-1">
              We&apos;ll write, queue, and publish replies for you. Monthly retainer starts at{" "}
              <strong className="text-[oklch(0.97_0.008_80)]">$400/location.</strong>
            </p>
            <a
              href="mailto:hello@nguyenetic.com?subject=Review management retainer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-display font-semibold text-sm border border-[oklch(0.40_0.005_260)] text-[oklch(0.75_0.005_260)] hover:text-[oklch(0.97_0.008_80)] hover:border-[oklch(0.74_0.15_55/40%)] transition-colors"
            >
              Book 15-min call — Nguyenetic
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* ─── Why this works better than ChatGPT ─────────────────────────────── */}
        <motion.section
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-2xl"
        >
          <h2 className="font-display font-bold text-xl text-[oklch(0.97_0.008_80)] mb-6">
            Why this works better than pasting into ChatGPT
          </h2>
          <div className="space-y-5">
            {[
              {
                title: "Industry-calibrated language",
                body: "A restaurant apology and an auto-shop apology require completely different language. Blaming the kitchen sounds wrong at a salon. Our prompts carry industry-specific playbooks so the reply always sounds like it belongs.",
              },
              {
                title: "Voice calibration, not just tone",
                body: "\"Warm\" and \"Professional\" aren't just adjectives — they map to specific structural patterns: where to empathize, when to offer resolution, what not to say. The Firm voice is specifically tuned to avoid language that implies fault where there isn't any.",
              },
              {
                title: "The refine loop closes the gap",
                body: "Generic AI gives you one shot. This tool gives you 3 starting points and lets you iterate each one in seconds — shorter, warmer, more apologetic — without retyping everything. That's the SaaS product in miniature: instant, iterative, yours.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[oklch(0.74_0.15_55/15%)] border border-[oklch(0.74_0.15_55/30%)] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="oklch(0.74 0.15 55)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[oklch(0.97_0.008_80)] mb-1">{item.title}</h3>
                  <p className="text-[oklch(0.65_0.008_260)] text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
