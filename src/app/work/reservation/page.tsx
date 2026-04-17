"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChefHat, LayoutDashboard, ArrowLeft } from "lucide-react"
import { StepDate } from "./components/StepDate"
import { StepGuest } from "./components/StepGuest"
import { StepCheckout } from "./components/StepCheckout"
import { StepConfirmation } from "./components/StepConfirmation"
import { OwnerDashboard } from "./components/OwnerDashboard"
import { ManageModal } from "./components/ManageModal"
import type { GuestDetails } from "./components/StepGuest"

type Step = 1 | 2 | 3 | 4

const DEPOSIT_PER_PERSON = 15

const STEP_LABELS: Record<Step, string> = {
  1: "Date & time",
  2: "Guest details",
  3: "Payment",
  4: "Confirmed",
}

function generateConfirmationId(): string {
  return `RC-${Math.floor(1000 + Math.random() * 9000)}`
}

function ReservationPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Parse URL params for deep-link state
  const urlDate = searchParams.get("date") ?? ""
  const urlTime = searchParams.get("time") ?? ""
  const urlParty = parseInt(searchParams.get("party") ?? "2", 10)
  const urlStep = (parseInt(searchParams.get("step") ?? "1", 10) as Step) || 1

  const [step, setStep] = useState<Step>(urlStep)
  const [date, setDate] = useState(urlDate)
  const [time, setTime] = useState(urlTime)
  const [party, setParty] = useState(isNaN(urlParty) || urlParty < 2 ? 2 : Math.min(urlParty, 12))
  const [guest, setGuest] = useState<GuestDetails>({
    name: "",
    email: "",
    phone: "",
    note: "",
    extraEmails: [],
  })
  const [confirmationId] = useState(generateConfirmationId)
  const [ownerView, setOwnerView] = useState(false)
  const [showManage, setShowManage] = useState(false)

  const deposit = party * DEPOSIT_PER_PERSON

  // Sync URL params when key state changes
  const syncUrl = useCallback((newDate: string, newTime: string, newParty: number, newStep: Step) => {
    const params = new URLSearchParams()
    if (newDate) params.set("date", newDate)
    if (newTime) params.set("time", newTime)
    if (newParty !== 2) params.set("party", String(newParty))
    if (newStep !== 1) params.set("step", String(newStep))
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : "?", { scroll: false })
  }, [router])

  function handleDateChange(newDate: string, newTime: string, newParty: number) {
    setDate(newDate)
    setTime(newTime)
    setParty(newParty)
    syncUrl(newDate, newTime, newParty, step)
  }

  function goToStep(s: Step) {
    setStep(s)
    syncUrl(date, time, party, s)
  }

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && showManage) {
        setShowManage(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [showManage])

  // Persist to localStorage
  useEffect(() => {
    if (step === 4) {
      try {
        localStorage.setItem("reservation_last", JSON.stringify({
          confirmationId,
          date,
          time,
          party,
          guestName: guest.name,
          guestEmail: guest.email,
          deposit,
        }))
      } catch {}
    }
  }, [step, confirmationId, date, time, party, guest, deposit])

  const canShowStep = (s: Step) => {
    if (s === 1) return true
    if (s === 2) return date !== "" && time !== ""
    if (s === 3) return s >= 2 && guest.name !== ""
    if (s === 4) return step === 4
    return false
  }

  return (
    <div className="min-h-screen bg-[#080618] text-[#f5f5f0]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Subtle ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ff8a3d]/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#f5f5f0]/40 hover:text-[#f5f5f0] hover:bg-[#ff8a3d]/10 transition-all"
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <ChefHat size={18} className="text-[#ff8a3d]" />
              <span className="font-display font-semibold text-[#f5f5f0] text-sm">Ichiban</span>
            </div>
          </div>

          <button
            onClick={() => setOwnerView(v => !v)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              ownerView
                ? "bg-[#ff8a3d]/20 text-[#ff8a3d] border border-[#ff8a3d]/40"
                : "bg-[#080618]/60 border border-[#ff8a3d]/15 text-[#f5f5f0]/50 hover:text-[#f5f5f0] hover:border-[#ff8a3d]/30",
            ].join(" ")}
            aria-pressed={ownerView}
          >
            <LayoutDashboard size={11} />
            {ownerView ? "Guest view" : "Owner view"}
          </button>
        </div>

        {/* Owner dashboard */}
        {ownerView ? (
          <OwnerDashboard
            date={date}
            time={time}
            party={party}
            guestName={guest.name}
            deposit={deposit}
          />
        ) : (
          <>
            {/* Progress steps — only show for steps 1-3 */}
            {step < 4 && (
              <div className="flex items-center gap-2 mb-8">
                {([1, 2, 3] as Step[]).map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => canShowStep(s) && s < step ? goToStep(s) : undefined}
                      disabled={s > step || !canShowStep(s)}
                      className="flex items-center gap-2 w-full"
                      aria-current={step === s ? "step" : undefined}
                    >
                      <div className={[
                        "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold transition-all",
                        step === s
                          ? "bg-gradient-to-br from-[#ffb68d] to-[#ff8a3d] text-[#080618]"
                          : step > s
                          ? "bg-[#ff8a3d]/25 text-[#ff8a3d]"
                          : "bg-[#f5f5f0]/8 text-[#f5f5f0]/30",
                      ].join(" ")}>
                        {step > s ? "✓" : s}
                      </div>
                      <span className={[
                        "text-xs hidden sm:block",
                        step === s ? "text-[#f5f5f0]" : step > s ? "text-[#f5f5f0]/50" : "text-[#f5f5f0]/25",
                      ].join(" ")}>
                        {STEP_LABELS[s]}
                      </span>
                    </button>
                    {i < 2 && (
                      <div className={`flex-1 h-px mx-1 ${step > s ? "bg-[#ff8a3d]/30" : "bg-[#f5f5f0]/8"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step content */}
            <div>
              {step === 1 && (
                <StepDate
                  date={date}
                  time={time}
                  party={party}
                  onChange={handleDateChange}
                  onNext={() => goToStep(2)}
                />
              )}

              {step === 2 && (
                <StepGuest
                  details={guest}
                  onChange={setGuest}
                  onNext={() => goToStep(3)}
                  onBack={() => goToStep(1)}
                />
              )}

              {step === 3 && (
                <StepCheckout
                  deposit={deposit}
                  date={date}
                  time={time}
                  party={party}
                  guestName={guest.name}
                  onSuccess={() => goToStep(4)}
                  onBack={() => goToStep(2)}
                />
              )}

              {step === 4 && (
                <StepConfirmation
                  date={date}
                  time={time}
                  party={party}
                  deposit={deposit}
                  guestName={guest.name}
                  guestEmail={guest.email}
                  confirmationId={confirmationId}
                  onManage={() => setShowManage(true)}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Manage modal */}
      {showManage && (
        <ManageModal
          confirmationId={confirmationId}
          date={date}
          time={time}
          party={party}
          guestName={guest.name}
          deposit={deposit}
          onClose={() => setShowManage(false)}
        />
      )}
    </div>
  )
}

export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080618] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff8a3d]/30 border-t-[#ff8a3d] rounded-full animate-spin" />
      </div>
    }>
      <ReservationPageInner />
    </Suspense>
  )
}
