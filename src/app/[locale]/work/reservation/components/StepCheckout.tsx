"use client"

import { useState, useCallback } from "react"
import { Lock, Shield } from "lucide-react"
import { StripeElement, validateCard } from "./StripeElement"
import type { CardDetails } from "./StripeElement"

interface StepCheckoutProps {
  deposit: number
  date: string
  time: string
  party: number
  guestName: string
  onSuccess: () => void
  onBack: () => void
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const [y, m, d] = dateStr.split("-")
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`
}

function formatTime(timeStr: string): string {
  if (!timeStr) return ""
  const [h, min] = timeStr.split(":").map(Number)
  const suffix = h >= 12 ? "PM" : "AM"
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${String(min).padStart(2, "0")} ${suffix}`
}

function detectBrand(number: string): string {
  const d = number.replace(/\s/g, "")
  if (d.startsWith("4")) return "visa"
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard"
  if (/^3[47]/.test(d)) return "amex"
  return "unknown"
}

export function StepCheckout({
  deposit,
  date,
  time,
  party,
  guestName,
  onSuccess,
  onBack,
}: StepCheckoutProps) {
  const [card, setCard] = useState<CardDetails>({ number: "", expiry: "", cvc: "", zip: "" })
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleCardChange = useCallback((updated: CardDetails) => {
    setCard(updated)
    setSubmitError(null)
  }, [])

  async function handlePay() {
    const brand = detectBrand(card.number)
    const errs = validateCard(card, brand)
    if (Object.keys(errs).length > 0) {
      setSubmitError("Please fix the card errors above.")
      return
    }

    setProcessing(true)
    setSubmitError(null)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    setProcessing(false)
    onSuccess()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-semibold text-[#f5f5f0] mb-1">
          Deposit payment
        </h2>
        <p className="text-[#f5f5f0]/50 text-sm">
          Secure your table with a refundable deposit.
        </p>
      </div>

      {/* Order summary */}
      <div className="bg-[#080618]/40 backdrop-blur-md border border-[#ff8a3d]/15 rounded-2xl p-4">
        <div className="text-[#f5f5f0]/50 text-xs font-medium uppercase tracking-wider mb-3">
          Reservation summary
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#f5f5f0]/60">Date</span>
            <span className="text-[#f5f5f0]">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#f5f5f0]/60">Time</span>
            <span className="text-[#f5f5f0]">{formatTime(time)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#f5f5f0]/60">Party</span>
            <span className="text-[#f5f5f0]">{party} guests</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#f5f5f0]/60">Name</span>
            <span className="text-[#f5f5f0]">{guestName}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#ff8a3d]/10 flex justify-between items-center">
          <span className="text-[#f5f5f0]/60 text-sm">Deposit due now</span>
          <span className="text-[#ff8a3d] font-display font-semibold text-xl">${deposit}</span>
        </div>
        <p className="text-[#f5f5f0]/30 text-xs mt-1">
          Applied to your bill on arrival · fully refundable 24h before
        </p>
      </div>

      {/* Card input */}
      <div className="bg-[#080618]/40 backdrop-blur-md border border-[#ff8a3d]/15 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#f5f5f0]/60 text-xs font-medium uppercase tracking-wider">
            Card details
          </span>
          <div className="flex items-center gap-1 text-[#f5f5f0]/30 text-xs">
            <Shield size={10} />
            Secured
          </div>
        </div>
        <StripeElement
          card={card}
          onChange={handleCardChange}
          onError={() => {}}
        />
      </div>

      {submitError && (
        <p className="text-red-400 text-sm">{submitError}</p>
      )}

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={processing}
        className={[
          "w-full py-4 px-6 rounded-xl font-display font-semibold text-base transition-all flex items-center justify-center gap-3",
          processing
            ? "bg-[#ff8a3d]/60 cursor-wait text-[#080618]/70"
            : "bg-gradient-to-br from-[#ffb68d] to-[#ff8a3d] text-[#080618] hover:shadow-[0_0_24px_rgba(255,138,61,0.4)] hover:-translate-y-0.5 active:translate-y-0",
        ].join(" ")}
      >
        {processing ? (
          <>
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeOpacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Processing…
          </>
        ) : (
          <>
            <Lock size={16} />
            Pay ${deposit} deposit
          </>
        )}
      </button>

      <button
        onClick={onBack}
        disabled={processing}
        className="w-full py-2.5 text-[#f5f5f0]/40 hover:text-[#f5f5f0]/70 text-sm transition-colors"
      >
        Back to guest details
      </button>
    </div>
  )
}
