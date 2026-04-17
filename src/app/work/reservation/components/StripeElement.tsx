"use client"

import { useState, useCallback } from "react"
import { Lock } from "lucide-react"

export interface CardDetails {
  number: string
  expiry: string
  cvc: string
  zip: string
}

interface CardErrors {
  number?: string
  expiry?: string
  cvc?: string
  zip?: string
}

// Luhn algorithm
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "")
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

function detectCardBrand(number: string): "visa" | "mastercard" | "amex" | "unknown" {
  const d = number.replace(/\s/g, "")
  if (d.startsWith("4")) return "visa"
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard"
  if (/^3[47]/.test(d)) return "amex"
  return "unknown"
}

function formatCardNumber(value: string, brand: string): string {
  const digits = value.replace(/\D/g, "")
  if (brand === "amex") {
    // 4-6-5
    const p1 = digits.slice(0, 4)
    const p2 = digits.slice(4, 10)
    const p3 = digits.slice(10, 15)
    return [p1, p2, p3].filter(Boolean).join(" ")
  }
  // 4-4-4-4
  return digits.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ")
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// SVG card brand icons
function VisaIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Visa">
      <rect width="38" height="24" rx="4" fill="#1A1F71" />
      <text x="19" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">VISA</text>
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Mastercard">
      <rect width="38" height="24" rx="4" fill="#252525" />
      <circle cx="14" cy="12" r="7" fill="#EB001B" />
      <circle cx="24" cy="12" r="7" fill="#F79E1B" />
      <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00" />
    </svg>
  )
}

function AmexIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="American Express">
      <rect width="38" height="24" rx="4" fill="#2E77BC" />
      <text x="19" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">AMEX</text>
    </svg>
  )
}

function CardPlaceholderIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Card">
      <rect width="38" height="24" rx="4" fill="#1a1a2e" stroke="rgba(255,138,61,0.2)" />
      <rect x="5" y="9" width="28" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
      <rect x="5" y="14" width="8" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
      <rect x="15" y="14" width="8" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
    </svg>
  )
}

interface StripeElementProps {
  card: CardDetails
  onChange: (card: CardDetails) => void
  onError: (hasError: boolean) => void
}

export function StripeElement({ card, onChange, onError }: StripeElementProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<CardErrors>({})

  const brand = detectCardBrand(card.number)

  const validateField = useCallback((field: keyof CardDetails, value: string, allCard?: CardDetails) => {
    const current = allCard ?? card
    const errs: CardErrors = {}

    const num = (field === "number" ? value : current.number).replace(/\s/g, "")
    const exp = field === "expiry" ? value : current.expiry
    const cvcVal = field === "cvc" ? value : current.cvc
    const zipVal = field === "zip" ? value : current.zip

    if (!num || num.length < 13) {
      errs.number = "Enter a valid card number"
    } else if (!luhnCheck(num)) {
      errs.number = "Card number is invalid"
    }

    if (!exp || exp.length < 5) {
      errs.expiry = "Enter MM/YY"
    } else {
      const [mm, yy] = exp.split("/")
      const month = parseInt(mm, 10)
      const year = parseInt("20" + yy, 10)
      const now = new Date()
      if (month < 1 || month > 12) errs.expiry = "Invalid month"
      else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        errs.expiry = "Card is expired"
      }
    }

    const cvcLen = brand === "amex" ? 4 : 3
    if (!cvcVal || cvcVal.replace(/\D/g, "").length < cvcLen) {
      errs.cvc = `Enter ${cvcLen}-digit CVC`
    }

    if (!zipVal || zipVal.replace(/\D/g, "").length < 5) {
      errs.zip = "Enter ZIP code"
    }

    return errs
  }, [card, brand])

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const newBrand = detectCardBrand(raw)
    const formatted = formatCardNumber(raw, newBrand)
    const updated = { ...card, number: formatted }
    onChange(updated)
    if (touched.number) {
      const errs = validateField("number", formatted, updated)
      setErrors(errs)
      onError(Object.keys(errs).length > 0)
    }
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatExpiry(e.target.value)
    const updated = { ...card, expiry: formatted }
    onChange(updated)
    if (touched.expiry) {
      const errs = validateField("expiry", formatted, updated)
      setErrors(errs)
      onError(Object.keys(errs).length > 0)
    }
  }

  function handleCvcChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3)
    const updated = { ...card, cvc: val }
    onChange(updated)
    if (touched.cvc) {
      const errs = validateField("cvc", val, updated)
      setErrors(errs)
      onError(Object.keys(errs).length > 0)
    }
  }

  function handleZipChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 5)
    const updated = { ...card, zip: val }
    onChange(updated)
    if (touched.zip) {
      const errs = validateField("zip", val, updated)
      setErrors(errs)
      onError(Object.keys(errs).length > 0)
    }
  }

  function handleBlur(field: keyof CardDetails) {
    const newTouched = { ...touched, [field]: true }
    setTouched(newTouched)
    const errs = validateField(field, card[field])
    setErrors(prev => ({ ...prev, ...errs }))
    onError(Object.keys({ ...errors, ...errs }).length > 0)
  }

  const inputBase = "bg-transparent w-full text-[#f5f5f0] placeholder:text-[#f5f5f0]/25 outline-none text-sm"

  const fieldClass = (field: keyof CardDetails) =>
    `border rounded-xl px-3 py-3 transition-all ${
      touched[field] && errors[field]
        ? "border-red-500/60 bg-red-500/5"
        : "border-[#ff8a3d]/20 bg-[#080618]/60 focus-within:border-[#ff8a3d]/60 focus-within:ring-1 focus-within:ring-[#ff8a3d]/25"
    }`

  return (
    <div className="space-y-3">
      {/* Card number */}
      <div>
        <div className={`flex items-center gap-3 ${fieldClass("number")}`}>
          <input
            type="text"
            inputMode="numeric"
            value={card.number}
            onChange={handleNumberChange}
            onBlur={() => handleBlur("number")}
            placeholder="1234 5678 9012 3456"
            autoComplete="cc-number"
            maxLength={brand === "amex" ? 17 : 19}
            className={`${inputBase} flex-1`}
            aria-label="Card number"
          />
          <div className="flex-shrink-0">
            {brand === "visa" ? <VisaIcon /> :
             brand === "mastercard" ? <MastercardIcon /> :
             brand === "amex" ? <AmexIcon /> :
             <CardPlaceholderIcon />}
          </div>
        </div>
        {touched.number && errors.number && (
          <p className="text-red-400 text-xs mt-1">{errors.number}</p>
        )}
      </div>

      {/* Expiry + CVC row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className={fieldClass("expiry")}>
            <input
              type="text"
              inputMode="numeric"
              value={card.expiry}
              onChange={handleExpiryChange}
              onBlur={() => handleBlur("expiry")}
              placeholder="MM/YY"
              autoComplete="cc-exp"
              maxLength={5}
              className={inputBase}
              aria-label="Expiry date"
            />
          </div>
          {touched.expiry && errors.expiry && (
            <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>
          )}
        </div>
        <div>
          <div className={fieldClass("cvc")}>
            <input
              type="text"
              inputMode="numeric"
              value={card.cvc}
              onChange={handleCvcChange}
              onBlur={() => handleBlur("cvc")}
              placeholder="CVC"
              autoComplete="cc-csc"
              maxLength={brand === "amex" ? 4 : 3}
              className={inputBase}
              aria-label="CVC"
            />
          </div>
          {touched.cvc && errors.cvc && (
            <p className="text-red-400 text-xs mt-1">{errors.cvc}</p>
          )}
        </div>
      </div>

      {/* ZIP */}
      <div>
        <div className={fieldClass("zip")}>
          <input
            type="text"
            inputMode="numeric"
            value={card.zip}
            onChange={handleZipChange}
            onBlur={() => handleBlur("zip")}
            placeholder="ZIP code"
            autoComplete="postal-code"
            maxLength={5}
            className={inputBase}
            aria-label="ZIP code"
          />
        </div>
        {touched.zip && errors.zip && (
          <p className="text-red-400 text-xs mt-1">{errors.zip}</p>
        )}
      </div>

      <div className="flex items-center gap-2 text-[#f5f5f0]/30 text-xs">
        <Lock size={10} />
        <span>256-bit TLS encryption · Powered by Stripe</span>
      </div>
    </div>
  )
}

// Export validate function for parent to call on submit
export function validateCard(card: CardDetails, brand: string): CardErrors {
  const errs: CardErrors = {}
  const num = card.number.replace(/\s/g, "")

  if (!num || num.length < 13) errs.number = "Enter a valid card number"
  else if (!luhnCheck(num)) errs.number = "Card number is invalid"

  if (!card.expiry || card.expiry.length < 5) errs.expiry = "Enter MM/YY"
  else {
    const [mm, yy] = card.expiry.split("/")
    const month = parseInt(mm, 10)
    const year = parseInt("20" + yy, 10)
    const now = new Date()
    if (month < 1 || month > 12) errs.expiry = "Invalid month"
    else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errs.expiry = "Card is expired"
    }
  }

  const cvcLen = brand === "amex" ? 4 : 3
  if (!card.cvc || card.cvc.replace(/\D/g, "").length < cvcLen) errs.cvc = `Enter ${cvcLen}-digit CVC`
  if (!card.zip || card.zip.replace(/\D/g, "").length < 5) errs.zip = "Enter ZIP code"

  return errs
}
