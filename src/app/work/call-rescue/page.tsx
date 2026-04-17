"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Phone, PhoneOff, MessageSquare, Clock, CheckCircle, Play, SkipForward, Zap } from "lucide-react";
import { LeadCapture } from "@/components/ui/lead-capture";

// ── Types ──────────────────────────────────────────────────────────────────

type Industry =
  | "HVAC"
  | "Plumbing"
  | "Electrical"
  | "Roofing"
  | "Handyman"
  | "Auto"
  | "Cleaning";

type SimStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const INDUSTRIES: Industry[] = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Handyman",
  "Auto",
  "Cleaning",
];

const INDUSTRY_BUSINESS: Record<Industry, string> = {
  HVAC: "ProSurge HVAC",
  Plumbing: "FlowRight Plumbing",
  Electrical: "Volt Pro Electric",
  Roofing: "SkyShield Roofing",
  Handyman: "FixIt Handyman",
  Auto: "QuickFix Auto",
  Cleaning: "SparkClean Pro",
};

const INDUSTRY_SMS: Record<Industry, string> = {
  HVAC: "Hey, this is ProSurge HVAC — sorry we missed you. What's going on? We can usually get someone out first thing tomorrow. Text back here and we'll get you scheduled.",
  Plumbing: "Hey, FlowRight Plumbing here — sorry we missed your call. Is it urgent? We do same-day emergency calls. Text back and we'll sort it out.",
  Electrical: "Hey, Volt Pro Electric here — missed your call. Electrical issues can't wait. Text us what's happening and we'll get you on the schedule ASAP.",
  Roofing: "Hi, SkyShield Roofing here — sorry we missed you. If there's a leak or storm damage, we do emergency patching. Text back with what's going on.",
  Handyman: "Hey, FixIt Handyman here — missed your call. Whatever the job is, text me back and I'll let you know if I can fit you in this week.",
  Auto: "Hey, QuickFix Auto here — sorry we missed you. What's the issue with your vehicle? Text back and I'll quote you right here.",
  Cleaning: "Hi, SparkClean Pro here — missed your call. Looking to schedule a clean? Text back your address and preferred time and we'll confirm same day.",
};

const INDUSTRY_CUSTOMER_MSG: Record<Industry, string> = {
  HVAC: "AC died. Need help ASAP. Worth $500 upcharge if you can come tonight?",
  Plumbing: "Pipe burst under the sink. Water everywhere. Can you come today?",
  Electrical: "Breaker keeps tripping. Half the house has no power. Emergency?",
  Roofing: "Storm ripped a section off. Rain coming in. Need a patch ASAP.",
  Handyman: "Deck board is cracked, front door won't close right. Can you come this week?",
  Auto: "Grinding noise when I brake. Is this safe to drive? What's the fix cost?",
  Cleaning: "Need deep clean before open house Saturday. Is that possible?",
};

const INDUSTRY_JOB_VALUE: Record<Industry, number> = {
  HVAC: 680,
  Plumbing: 420,
  Electrical: 380,
  Roofing: 1800,
  Handyman: 240,
  Auto: 320,
  Cleaning: 280,
};

const INDUSTRY_UPCHARGE: Record<Industry, number> = {
  HVAC: 500,
  Plumbing: 250,
  Electrical: 200,
  Roofing: 800,
  Handyman: 0,
  Auto: 150,
  Cleaning: 100,
};

const INDUSTRY_CONTRACTOR_REPLY: Record<Industry, string> = {
  HVAC: "Heading over in 20 min. I've got the parts. See you soon.",
  Plumbing: "On my way — 30 min out. Shut the valve under the sink to stop the water.",
  Electrical: "I can be there in 45 min. Don't reset the breaker again — I'll diagnose it.",
  Roofing: "Coming out first thing tomorrow 7am with tarps. Get photos for the claim.",
  Handyman: "I can come Thursday 9am. I'll bring wood for the deck and a new strike plate.",
  Auto: "Bring it in today at 2pm. I'll put it on the lift and send you a video of the issue.",
  Cleaning: "Yes! I can do Saturday 9am. Sending a booking link now — just confirm the address.",
};

const SIM_STEP_CAPTIONS: Record<SimStep, string> = {
  0: "Pick your scenario above, then hit Play.",
  1: "It's Tuesday night. The customer's A/C just died.",
  2: "The contractor is finishing dinner. No one picks up.",
  3: "Without text-back: the customer calls 3 competitors. You never know.",
  4: "With text-back: 7 seconds later — an auto-reply fires.",
  5: "The customer replies. They're ready to book.",
  6: "The contractor responds from their phone.",
  7: "Job booked. Revenue recovered.",
};

// ── Simulator phone animations ─────────────────────────────────────────────

function PhoneCallRings({ active }: { active: boolean }) {
  return (
    <div className="flex gap-1 items-center justify-center h-4">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-[#4ade80]"
          animate={active ? { opacity: [1, 0.2, 1], scale: [1, 0.6, 1] } : { opacity: 0.2 }}
          transition={active ? { duration: 0.8, repeat: Infinity, delay: i * 0.15 } : {}}
        />
      ))}
    </div>
  );
}

function StreamingText({
  text,
  active,
  reducedMotion,
  onDone,
}: {
  text: string;
  active: boolean;
  reducedMotion: boolean;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!active) {
      indexRef.current = 0;
      const t = setTimeout(() => {
        setDisplayed("");
        setDone(false);
      }, 0);
      return () => clearTimeout(t);
    }
    if (reducedMotion) {
      const t = setTimeout(() => {
        setDisplayed(text);
        setDone(true);
        onDoneRef.current?.();
      }, 0);
      return () => clearTimeout(t);
    }
    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
        onDoneRef.current?.();
      }
    }, 22);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, text, reducedMotion]);

  return (
    <span>
      {displayed}
      {active && !done && (
        <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}

function PhoneScreen({
  side,
  step,
  industry,
  reducedMotion,
  onTextDone,
}: {
  side: "customer" | "contractor";
  step: SimStep;
  industry: Industry;
  reducedMotion: boolean;
  onTextDone?: () => void;
}) {
  const businessName = INDUSTRY_BUSINESS[industry];
  const smsText = INDUSTRY_SMS[industry];
  const customerMsg = INDUSTRY_CUSTOMER_MSG[industry];
  const contractorReply = INDUSTRY_CONTRACTOR_REPLY[industry];

  if (side === "customer") {
    return (
      <div className="flex flex-col h-full">
        {/* Status bar */}
        <div className="flex justify-between items-center px-3 pt-2 pb-1 text-[9px] text-[#f5f5f0]/40">
          <span>7:42 PM</span>
          <span>●●●</span>
        </div>

        {step === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center opacity-30">
              <Phone size={28} className="mx-auto mb-2" />
              <p className="text-[10px]">Customer phone</p>
            </div>
          </div>
        )}

        {/* Step 1: Calling */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#4ade80]/20 border border-[#4ade80]/40 flex items-center justify-center">
              <Phone size={22} className="text-[#4ade80]" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-[#f5f5f0]">{businessName}</p>
              <p className="text-[9px] text-[#f5f5f0]/40">Calling...</p>
            </div>
            <PhoneCallRings active />
          </div>
        )}

        {/* Step 2: No answer */}
        {step === 2 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <PhoneOff size={22} className="text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-[#f5f5f0]">{businessName}</p>
              <p className="text-[9px] text-red-400/80">Call ended</p>
            </div>
          </div>
        )}

        {/* Step 3: Old outcome */}
        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 px-3">
            <div className="w-full rounded-lg bg-[#1a1a2e] border border-[#f5f5f0]/10 p-2 text-[9px] text-[#f5f5f0]/50">
              <p className="font-medium text-[#f5f5f0]/70 mb-1">Searching...</p>
              <p>&quot;AC repair near me&quot;</p>
            </div>
            {["BestAir HVAC — Calling...", "CoolBreeze — Calling...", "Arctic Pro — Booked"].map((t, i) => (
              <div key={i} className={`w-full rounded-lg border p-1.5 text-[9px] ${i === 2 ? "border-[#4ade80]/30 text-[#4ade80]/80" : "border-[#f5f5f0]/10 text-[#f5f5f0]/40"}`}>
                {t}
              </div>
            ))}
          </div>
        )}

        {/* Steps 4-7: SMS thread */}
        {step >= 4 && (
          <div className="flex-1 flex flex-col">
            <div className="px-3 py-2 border-b border-[#f5f5f0]/8 text-center">
              <p className="text-[10px] font-semibold text-[#f5f5f0]">{businessName}</p>
              <p className="text-[9px] text-[#f5f5f0]/30">Text Message</p>
            </div>
            <div className="flex-1 overflow-hidden px-2 py-2 space-y-2">
              {/* Auto-reply SMS */}
              {step >= 4 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-[#2a2a3e] rounded-2xl rounded-tl-sm px-2.5 py-1.5">
                    <p className="text-[9px] text-[#f5f5f0]/80 leading-relaxed">
                      {step === 4 ? (
                        <StreamingText
                          text={smsText}
                          active
                          reducedMotion={reducedMotion}
                          onDone={onTextDone}
                        />
                      ) : (
                        smsText
                      )}
                    </p>
                  </div>
                </div>
              )}
              {/* Customer reply */}
              {step >= 5 && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-[#4ade80]/20 border border-[#4ade80]/30 rounded-2xl rounded-tr-sm px-2.5 py-1.5">
                    <p className="text-[9px] text-[#4ade80]/90 leading-relaxed">
                      {step === 5 ? (
                        <StreamingText
                          text={customerMsg}
                          active
                          reducedMotion={reducedMotion}
                          onDone={onTextDone}
                        />
                      ) : (
                        customerMsg
                      )}
                    </p>
                  </div>
                </div>
              )}
              {/* Contractor reply */}
              {step >= 6 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-[#2a2a3e] rounded-2xl rounded-tl-sm px-2.5 py-1.5">
                    <p className="text-[9px] text-[#f5f5f0]/80 leading-relaxed">
                      {step === 6 ? (
                        <StreamingText
                          text={contractorReply}
                          active
                          reducedMotion={reducedMotion}
                          onDone={onTextDone}
                        />
                      ) : (
                        contractorReply
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Contractor phone
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-3 pt-2 pb-1 text-[9px] text-[#f5f5f0]/40">
        <span>7:42 PM</span>
        <span>100%</span>
      </div>

      {step === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center opacity-30">
            <MessageSquare size={28} className="mx-auto mb-2" />
            <p className="text-[10px]">Contractor phone</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#f5f5f0]/10 border border-[#f5f5f0]/20 flex items-center justify-center">
            <Phone size={22} className="text-[#f5f5f0]/40" />
          </div>
          <div className="text-center">
            <p className="text-[9px] text-[#f5f5f0]/40">Incoming call</p>
            <PhoneCallRings active={false} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={reducedMotion ? {} : { scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-14 h-14 rounded-full bg-[#f5f5f0]/8 border border-[#f5f5f0]/15 flex items-center justify-center"
          >
            <Phone size={22} className="text-[#f5f5f0]/30" />
          </motion.div>
          <div className="text-center">
            <p className="text-[9px] text-[#f5f5f0]/30">Missed call</p>
            <p className="text-[9px] text-[#f5f5f0]/20">No one answered</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-3">
          <div className="w-full rounded-lg bg-[#1a1a2e] border border-[#f5f5f0]/10 p-2 text-center">
            <p className="text-[9px] text-[#f5f5f0]/30">1 missed call</p>
            <p className="text-[8px] text-[#f5f5f0]/20 mt-0.5">Unknown caller</p>
          </div>
          <p className="text-[8px] text-[#f5f5f0]/20 text-center px-2">You never knew they existed.</p>
        </div>
      )}

      {/* Steps 4+: Auto-reply confirmation */}
      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-3">
          <motion.div
            initial={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 rounded-full bg-[#facc15]/20 border border-[#facc15]/40 flex items-center justify-center"
          >
            <Zap size={20} className="text-[#facc15]" />
          </motion.div>
          <div className="text-center">
            <p className="text-[10px] font-semibold text-[#facc15]">Auto-reply sent</p>
            <p className="text-[9px] text-[#f5f5f0]/30 mt-0.5">7 seconds after missed call</p>
          </div>
          <div className="w-full rounded-lg bg-[#facc15]/8 border border-[#facc15]/20 p-2 text-[8px] text-[#f5f5f0]/40">
            Template fired · Lead thread created
          </div>
        </div>
      )}

      {step >= 5 && (
        <div className="flex-1 flex flex-col">
          <div className="px-3 py-2 border-b border-[#f5f5f0]/8 text-center">
            <p className="text-[10px] font-semibold text-[#f5f5f0]">New lead thread</p>
            <p className="text-[9px] text-[#facc15]/60">Reply from any device</p>
          </div>
          <div className="flex-1 px-2 py-2 space-y-2">
            {step >= 5 && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-[#2a2a3e] rounded-2xl rounded-tl-sm px-2.5 py-1.5">
                  <p className="text-[9px] text-[#f5f5f0]/60 leading-relaxed">{customerMsg}</p>
                </div>
              </div>
            )}
            {step >= 6 && (
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-[#facc15]/20 border border-[#facc15]/30 rounded-2xl rounded-tr-sm px-2.5 py-1.5">
                  <p className="text-[9px] text-[#facc15]/90 leading-relaxed">
                    {step === 6 ? (
                      <StreamingText
                        text={contractorReply}
                        active
                        reducedMotion={reducedMotion}
                        onDone={onTextDone}
                      />
                    ) : (
                      contractorReply
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Signal line between phones ──────────────────────────────────────────────

function SignalLine({ step, reducedMotion }: { step: SimStep; reducedMotion: boolean }) {
  const isActive = step >= 4;
  return (
    <div className="hidden md:flex flex-col items-center justify-center gap-2 px-1">
      <div className="relative flex flex-col items-center">
        <motion.div
          className="w-0.5 h-24 rounded-full"
          style={{ background: isActive ? "linear-gradient(to bottom, #facc15, #4ade80)" : "oklch(0.3 0 0 / 30%)" }}
          animate={isActive && !reducedMotion ? { opacity: [0.4, 1, 0.4] } : { opacity: isActive ? 1 : 0.2 }}
          transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
        />
        {isActive && (
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-[#facc15]"
            animate={reducedMotion ? {} : { top: ["0%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="mt-1 text-[8px] text-[#f5f5f0]/20 text-center">
          {isActive ? "SMS" : ""}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

const LS_KEY = "call_rescue_prefs";

export default function CallRescuePage() {
  const reducedMotion = useReducedMotion() ?? false;

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw) as { callsPerWeek?: number; missedRate?: number; jobValue?: number; industry?: Industry };
    } catch {}
    return null;
  }

  // Calculator state — initializers read localStorage once
  const [callsPerWeek, setCallsPerWeek] = useState(() => loadPrefs()?.callsPerWeek ?? 45);
  const [missedRate, setMissedRate] = useState(() => loadPrefs()?.missedRate ?? 27);
  const [jobValue, setJobValue] = useState(() => loadPrefs()?.jobValue ?? 680);

  // Simulator state
  const [industry, setIndustry] = useState<Industry>(() => loadPrefs()?.industry ?? "HVAC");
  const [simStep, setSimStep] = useState<SimStep>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [textReady, setTextReady] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  // Computed values
  const yearlyMissed = Math.round(callsPerWeek * 52 * (missedRate / 100) * jobValue * 0.2);
  const yearlyRecoverable = Math.round(yearlyMissed * 0.8);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ callsPerWeek, missedRate, jobValue, industry }));
    } catch {}
  }, [callsPerWeek, missedRate, jobValue, industry]);

  const advance = useCallback(() => {
    setSimStep((prev) => {
      if (prev >= 7) return prev;
      return (prev + 1) as SimStep;
    });
    setTextReady(false);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;
    if (simStep >= 7) {
      const t = setTimeout(() => setIsPlaying(false), 0);
      return () => clearTimeout(t);
    }
    // Steps with streaming text: wait for text done before advancing
    const isStreamingStep = simStep === 4 || simStep === 5 || simStep === 6;
    if (isStreamingStep && !textReady && !reducedMotion) return;

    const BASE_DELAYS: Record<SimStep, number> = {
      0: 0,
      1: 2000,
      2: 3000,
      3: 3500,
      4: 4000,
      5: 5000,
      6: 4000,
      7: 3000,
    };
    const delay = BASE_DELAYS[simStep] / speed;
    const t = setTimeout(() => {
      advance();
    }, delay);
    return () => clearTimeout(t);
  }, [isPlaying, simStep, textReady, reducedMotion, advance, speed]);

  function playFromStart() {
    setSimStep(1);
    setIsPlaying(true);
    setTextReady(false);
  }

  function skipToNewOutcome() {
    setSimStep(4);
    setIsPlaying(true);
    setTextReady(false);
  }

  function handleStepClick() {
    if (!reducedMotion) return;
    if (simStep >= 7) {
      setSimStep(1);
      setTextReady(false);
    } else {
      advance();
    }
  }

  const businessName = INDUSTRY_BUSINESS[industry];
  const jobVal = INDUSTRY_JOB_VALUE[industry];
  const upcharge = INDUSTRY_UPCHARGE[industry];

  return (
    <div
      className="min-h-screen bg-[#08080f] text-[#f5f5f0]"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-[#facc15]/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[300px] bg-[#4ade80]/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Back nav */}
        <div className="flex items-center gap-3 mb-10">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#f5f5f0]/40 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/8 transition-all"
            aria-label="Back to home"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-[#f5f5f0]/20 text-xs">/</span>
          <span className="text-[#f5f5f0]/40 text-xs">call-rescue</span>
        </div>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="mb-16">
          <p className="text-[#facc15]/60 text-xs uppercase tracking-widest mb-3">
            Built for: HVAC, plumbing, electrical, roofing, handyman, mobile auto, cleaning.
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#f5f5f0] leading-tight mb-4">
            Every missed call is{" "}
            <span className="text-[#facc15]">$1,200</span> walking away.
          </h1>
          <p className="text-[#f5f5f0]/50 text-lg max-w-2xl leading-relaxed">
            27% of calls to contractors go unanswered. 85% of those callers don&apos;t try again.
            This is the 10-minute fix: after-hours calls auto-respond with a text that re-engages
            the lead — and schedules the callback.
          </p>
        </section>

        {/* ── Section 1: Cost Calculator ─────────────────────────── */}
        <section className="mb-16" aria-label="Missed-call cost calculator">
          <h2 className="font-display text-2xl font-bold text-[#f5f5f0] mb-2">
            How much is silence costing you?
          </h2>
          <p className="text-[#f5f5f0]/40 text-sm mb-6">
            Adjust sliders for your business. Numbers update live.
          </p>

          <div className="bg-[#0d0d1a] border border-[#facc15]/15 rounded-2xl p-6 space-y-5">
            {/* Slider: Calls per week */}
            <div>
              <div className="flex justify-between text-sm text-[#f5f5f0]/50 mb-2">
                <span>Calls per week</span>
                <span className="text-[#f5f5f0]/80 font-medium tabular-nums">{callsPerWeek}</span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={callsPerWeek}
                onChange={(e) => setCallsPerWeek(Number(e.target.value))}
                className="w-full accent-[#facc15] h-1.5 rounded-full"
                aria-label="Calls per week"
              />
              <div className="flex justify-between text-[10px] text-[#f5f5f0]/20 mt-1">
                <span>5</span><span>200</span>
              </div>
            </div>

            {/* Slider: Missed call rate */}
            <div>
              <div className="flex justify-between text-sm text-[#f5f5f0]/50 mb-2">
                <span>Missed call rate</span>
                <span className="text-[#f5f5f0]/80 font-medium tabular-nums">{missedRate}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={45}
                step={1}
                value={missedRate}
                onChange={(e) => setMissedRate(Number(e.target.value))}
                className="w-full accent-[#facc15] h-1.5 rounded-full"
                aria-label="Missed call rate percentage"
              />
              <div className="flex justify-between text-[10px] text-[#f5f5f0]/20 mt-1">
                <span>10%</span><span>45%</span>
              </div>
            </div>

            {/* Slider: Job value */}
            <div>
              <div className="flex justify-between text-sm text-[#f5f5f0]/50 mb-2">
                <span>Average job value</span>
                <span className="text-[#f5f5f0]/80 font-medium tabular-nums">${jobValue}</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={20}
                value={jobValue}
                onChange={(e) => setJobValue(Number(e.target.value))}
                className="w-full accent-[#facc15] h-1.5 rounded-full"
                aria-label="Average job value in dollars"
              />
              <div className="flex justify-between text-[10px] text-[#f5f5f0]/20 mt-1">
                <span>$100</span><span>$5,000</span>
              </div>
            </div>

            {/* Output */}
            <div className="pt-4 border-t border-[#facc15]/10 space-y-2">
              <motion.p
                key={yearlyMissed}
                initial={reducedMotion ? {} : { opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
                className="font-display font-bold text-[#facc15] text-3xl leading-tight"
              >
                ${yearlyMissed.toLocaleString()}
                <span className="text-lg font-normal text-[#f5f5f0]/40 ml-2">
                  {" "}walking out the door every year.
                </span>
              </motion.p>
              <motion.p
                key={yearlyRecoverable}
                initial={reducedMotion ? {} : { opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, delay: 0.05 }}
                className="text-[#f5f5f0]/50 text-sm"
              >
                With a 7-second text-back, recover an estimated{" "}
                <span className="text-[#4ade80] font-semibold">
                  ${yearlyRecoverable.toLocaleString()}
                </span>{" "}
                of that.
              </motion.p>
              <p className="text-[#f5f5f0]/25 text-xs">
                Formula: calls × 52 × missed% × job value × 20% conversion × 80% recovery rate
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: Simulator ──────────────────────────────── */}
        <section className="mb-16" aria-label="Missed-call text-back simulator">
          <h2 className="font-display text-2xl font-bold text-[#f5f5f0] mb-2">
            Watch the 4-minute turnaround.
          </h2>
          <p className="text-[#f5f5f0]/40 text-sm mb-6">
            Pick your trade, then hit Play. Watch a $1,200 loss become a booked job.
          </p>

          {/* Industry selector */}
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Select industry">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => {
                  setIndustry(ind);
                  setSimStep(0);
                  setIsPlaying(false);
                  setTextReady(false);
                }}
                className={[
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  industry === ind
                    ? "bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/40"
                    : "bg-[#0d0d1a] text-[#f5f5f0]/40 border border-[#f5f5f0]/10 hover:border-[#f5f5f0]/20 hover:text-[#f5f5f0]/60",
                ].join(" ")}
                aria-pressed={industry === ind}
              >
                {ind}
              </button>
            ))}
          </div>

          {/* Simulator controls */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <button
              onClick={playFromStart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#facc15] text-[#08080f] text-sm font-semibold hover:bg-[#fde047] transition-colors"
            >
              <Play size={14} />
              Play from start
            </button>
            <button
              onClick={skipToNewOutcome}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d0d1a] border border-[#f5f5f0]/15 text-[#f5f5f0]/70 text-sm font-medium hover:border-[#f5f5f0]/30 transition-colors"
            >
              <SkipForward size={14} />
              Skip to new outcome
            </button>
            <label className="flex items-center gap-2 text-xs text-[#f5f5f0]/40 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="accent-[#facc15] w-3.5 h-3.5"
              />
              Auto-play
            </label>
            <div className="flex items-center gap-1.5 ml-auto">
              {([1, 2] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={[
                    "px-2 py-1 rounded text-xs font-mono transition-all",
                    speed === s
                      ? "bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/30"
                      : "text-[#f5f5f0]/30 hover:text-[#f5f5f0]/50",
                  ].join(" ")}
                  aria-pressed={speed === s}
                  aria-label={`${s}× speed`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Phones stage */}
          <div
            className="bg-[#0d0d1a] border border-[#f5f5f0]/8 rounded-2xl p-4 md:p-6"
            role="region"
            aria-live="polite"
            aria-label="Simulator stage"
          >
            {/* Caption bar */}
            <div className="mb-4 flex items-start gap-2">
              <Clock size={13} className="text-[#facc15]/60 mt-0.5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={simStep}
                  initial={reducedMotion ? {} : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? {} : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-[#f5f5f0]/50 leading-relaxed"
                >
                  {SIM_STEP_CAPTIONS[simStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Step indicator */}
            <div className="flex gap-1 mb-5">
              {([1, 2, 3, 4, 5, 6, 7] as SimStep[]).map((s) => (
                <div
                  key={s}
                  className={[
                    "flex-1 h-0.5 rounded-full transition-all duration-300",
                    simStep >= s ? "bg-[#facc15]" : "bg-[#f5f5f0]/10",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Two phones */}
            <div className="flex items-stretch gap-2 md:gap-4">
              {/* Customer phone */}
              <div className="flex-1 max-w-[160px] md:max-w-[200px]">
                <p className="text-[9px] uppercase tracking-widest text-[#f5f5f0]/25 mb-2 text-center">
                  Customer
                </p>
                <div className="bg-[#111122] border border-[#f5f5f0]/10 rounded-2xl overflow-hidden h-56 md:h-64 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`customer-${simStep}`}
                      initial={reducedMotion ? {} : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reducedMotion ? {} : { opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <PhoneScreen
                        side="customer"
                        step={simStep}
                        industry={industry}
                        reducedMotion={reducedMotion}

                        onTextDone={() => setTextReady(true)}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Signal line */}
              <SignalLine step={simStep} reducedMotion={reducedMotion} />

              {/* Contractor phone */}
              <div className="flex-1 max-w-[160px] md:max-w-[200px] ml-auto">
                <p className="text-[9px] uppercase tracking-widest text-[#f5f5f0]/25 mb-2 text-center">
                  Contractor
                </p>
                <div className="bg-[#111122] border border-[#f5f5f0]/10 rounded-2xl overflow-hidden h-56 md:h-64 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`contractor-${simStep}`}
                      initial={reducedMotion ? {} : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reducedMotion ? {} : { opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <PhoneScreen
                        side="contractor"
                        step={simStep}
                        industry={industry}
                        reducedMotion={reducedMotion}

                        onTextDone={() => setTextReady(true)}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Reduced-motion step advance button */}
            {reducedMotion && simStep > 0 && simStep < 7 && (
              <button
                onClick={handleStepClick}
                className="mt-4 w-full py-2 rounded-xl border border-[#f5f5f0]/15 text-[#f5f5f0]/50 text-xs hover:border-[#f5f5f0]/30 transition-colors"
              >
                Next step &rarr;
              </button>
            )}

            {/* Outcome card */}
            <AnimatePresence>
              {simStep === 7 && (
                <motion.div
                  initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? {} : { opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-5 bg-gradient-to-br from-[#facc15]/10 to-[#4ade80]/8 border border-[#facc15]/25 rounded-2xl p-5"
                  role="status"
                  aria-label="Job outcome"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-[#4ade80]" />
                    <span className="text-[#4ade80] text-sm font-semibold">Job booked.</span>
                  </div>
                  <p className="font-display font-bold text-[#facc15] text-2xl mb-1">
                    ${(jobVal + upcharge).toLocaleString()}
                  </p>
                  <p className="text-[#f5f5f0]/50 text-xs mb-3">
                    Base ${jobVal.toLocaleString()}
                    {upcharge > 0 && ` + $${upcharge} emergency upcharge`} · {businessName}
                  </p>
                  <div className="space-y-1.5 text-[11px] text-[#f5f5f0]/40">
                    <p>Time from missed call to confirmed job: <span className="text-[#f5f5f0]/70">4 minutes</span></p>
                    <p>Lead captured in CRM &middot; auto-appointment created</p>
                    <p>Mike gets a follow-up review request 48h later</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Section 3: How it works ────────────────────────────── */}
        <section className="mb-16" aria-label="How the technology works">
          <h2 className="font-display text-2xl font-bold text-[#f5f5f0] mb-2">
            How the tech works.
          </h2>
          <p className="text-[#f5f5f0]/40 text-sm mb-6">
            Four steps. No app required.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                n: "01",
                title: "Your published phone rings",
                body: "Calls come in to your business number — same one on Google Maps, Yelp, your site. Powered by Twilio Studio with a call-flow you control.",
                color: "#facc15",
              },
              {
                n: "02",
                title: "No answer after 4 rings",
                body: "Caller hangs up or goes to voicemail. The call-flow detects the hangup or missed pickup within seconds.",
                color: "#f97316",
              },
              {
                n: "03",
                title: "Auto-SMS fires instantly",
                body: "A template message goes out with your business name and tone. Pulls from your saved templates and the caller's area code to match local dialect.",
                color: "#4ade80",
              },
              {
                n: "04",
                title: "You get a clean text thread",
                body: "Reply from any device — phone, tablet, laptop. No app install. Leads show up as named threads you can respond to from anywhere.",
                color: "#a78bfa",
              },
            ].map(({ n, title, body, color }) => (
              <div
                key={n}
                className="bg-[#0d0d1a] border border-[#f5f5f0]/8 rounded-2xl p-5"
              >
                <div
                  className="text-xs font-mono font-bold mb-3 opacity-60"
                  style={{ color }}
                >
                  {n}
                </div>
                <h3 className="font-display font-semibold text-[#f5f5f0] text-sm mb-2">
                  {title}
                </h3>
                <p className="text-[#f5f5f0]/40 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Funnel CTA ──────────────────────────────── */}
        <section aria-label="Get started">
          <div className="bg-gradient-to-br from-[#0d0d1a] to-[#111122] border border-[#facc15]/20 rounded-2xl p-6 mb-5">
            <p className="font-display font-bold text-[#f5f5f0] text-xl mb-2">
              Get this running on your real business line this week.
            </p>
            <p className="text-[#f5f5f0]/50 text-sm mb-5">
              We set up Twilio, write your message templates, tune the after-hours rules, and hand
              you the thread UI. <span className="text-[#facc15]">$299 setup, $29/mo.</span>
            </p>

            {!leadCaptured ? (
              <LeadCapture
                appSlug="call-rescue"
                context="setup-waitlist"
                buttonLabel="Reserve a setup slot"
                onCaptured={() => setLeadCaptured(true)}
                metadata={{
                  yearlyCost: yearlyMissed,
                  industry,
                }}
              />
            ) : (
              <div className="bg-[#4ade80]/10 border border-[#4ade80]/25 rounded-xl p-4 text-center">
                <CheckCircle size={20} className="text-[#4ade80] mx-auto mb-2" />
                <p className="text-[#4ade80] font-semibold text-sm">You&apos;re on the list.</p>
                <p className="text-[#f5f5f0]/40 text-xs mt-1">
                  We&apos;ll reach out within 1 business day to schedule setup.
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#0d0d1a] border border-[#f5f5f0]/8 rounded-2xl p-5">
            <p className="text-[#f5f5f0]/60 text-sm font-medium mb-1">
              Running a multi-tech shop?
            </p>
            <p className="text-[#f5f5f0]/40 text-sm mb-3">
              We can set up per-tech routing and on-call rotation so the right person gets the right
              lead at the right time.
            </p>
            <a
              href="mailto:hello@nguyenetic.com?subject=Call Rescue multi-tech setup"
              className="text-[#facc15]/70 text-sm hover:text-[#facc15] transition-colors underline underline-offset-2"
            >
              Email us about multi-tech setup &rarr;
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
