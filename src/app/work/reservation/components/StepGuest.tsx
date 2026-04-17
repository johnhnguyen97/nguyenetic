"use client"

import { useState, useCallback } from "react"
import { Plus, X, User, Mail, Phone, MessageSquare } from "lucide-react"

export interface GuestDetails {
  name: string
  email: string
  phone: string
  note: string
  extraEmails: string[]
}

interface FieldError {
  name?: string
  email?: string
  phone?: string
  extraEmails?: Record<number, string>
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length === 10
}

interface StepGuestProps {
  details: GuestDetails
  onChange: (details: GuestDetails) => void
  onNext: () => void
  onBack: () => void
}

export function StepGuest({ details, onChange, onNext, onBack }: StepGuestProps) {
  const [errors, setErrors] = useState<FieldError>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const update = useCallback((field: keyof GuestDetails, value: string | string[]) => {
    onChange({ ...details, [field]: value })
  }, [details, onChange])

  function validate(): boolean {
    const errs: FieldError = {}
    if (!details.name.trim()) errs.name = "Name is required"
    if (!details.email) errs.email = "Email is required"
    else if (!validateEmail(details.email)) errs.email = "Enter a valid email"
    if (!details.phone) errs.phone = "Phone is required"
    else if (!validatePhone(details.phone)) errs.phone = "Enter a 10-digit phone number"

    const extraEmailErrors: Record<number, string> = {}
    details.extraEmails.forEach((em, i) => {
      if (em && !validateEmail(em)) extraEmailErrors[i] = "Invalid email"
    })
    if (Object.keys(extraEmailErrors).length > 0) errs.extraEmails = extraEmailErrors

    setErrors(errs)
    const allTouched: Record<string, boolean> = {
      name: true, email: true, phone: true,
    }
    details.extraEmails.forEach((_, i) => { allTouched[`extra-${i}`] = true })
    setTouched(allTouched)

    return Object.keys(errs).length === 0 &&
      Object.keys(extraEmailErrors).length === 0
  }

  function handleSubmit() {
    if (validate()) onNext()
  }

  function addExtraEmail() {
    if (details.extraEmails.length < 3) {
      update("extraEmails", [...details.extraEmails, ""])
    }
  }

  function removeExtraEmail(i: number) {
    const updated = details.extraEmails.filter((_, idx) => idx !== i)
    update("extraEmails", updated)
  }

  function updateExtraEmail(i: number, value: string) {
    const updated = [...details.extraEmails]
    updated[i] = value
    update("extraEmails", updated)
  }

  const inputBase = "w-full bg-[#080618]/60 border rounded-xl px-4 py-3 text-[#f5f5f0] placeholder:text-[#f5f5f0]/25 outline-none transition-all text-sm"
  const inputNormal = `${inputBase} border-[#ff8a3d]/20 focus:border-[#ff8a3d]/60 focus:ring-1 focus:ring-[#ff8a3d]/25`
  const inputError = `${inputBase} border-red-500/60 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/25`

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-semibold text-[#f5f5f0] mb-1">
          Your details
        </h2>
        <p className="text-[#f5f5f0]/50 text-sm">
          We&apos;ll send your confirmation here.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="flex items-center gap-1.5 text-[#f5f5f0]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
          <User size={11} />
          Name
        </label>
        <input
          type="text"
          value={details.name}
          onChange={e => update("name", e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, name: true }))}
          placeholder="Full name"
          autoComplete="name"
          className={touched.name && errors.name ? inputError : inputNormal}
        />
        {touched.name && errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-1.5 text-[#f5f5f0]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
          <Mail size={11} />
          Email
        </label>
        <input
          type="email"
          value={details.email}
          onChange={e => update("email", e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, email: true }))}
          placeholder="you@example.com"
          autoComplete="email"
          className={touched.email && errors.email ? inputError : inputNormal}
        />
        {touched.email && errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="flex items-center gap-1.5 text-[#f5f5f0]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
          <Phone size={11} />
          Phone
        </label>
        <input
          type="tel"
          value={details.phone}
          onChange={e => update("phone", formatPhone(e.target.value))}
          onBlur={() => setTouched(t => ({ ...t, phone: true }))}
          placeholder="(555) 000-0000"
          autoComplete="tel"
          className={touched.phone && errors.phone ? inputError : inputNormal}
        />
        {touched.phone && errors.phone && (
          <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="flex items-center gap-1.5 text-[#f5f5f0]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
          <MessageSquare size={11} />
          Note to kitchen
          <span className="text-[#f5f5f0]/30 normal-case tracking-normal ml-1">(optional)</span>
        </label>
        <textarea
          value={details.note}
          onChange={e => update("note", e.target.value)}
          placeholder="Allergies, occasion, seating preference…"
          rows={3}
          className={`${inputNormal} resize-none`}
        />
      </div>

      {/* Extra guest emails */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-[#f5f5f0]/60 text-xs font-medium uppercase tracking-wider">
            <Mail size={11} />
            Split-bill notifications
            <span className="text-[#f5f5f0]/30 normal-case tracking-normal ml-1">(optional)</span>
          </label>
          {details.extraEmails.length < 3 && (
            <button
              onClick={addExtraEmail}
              className="flex items-center gap-1 text-[#ff8a3d]/70 hover:text-[#ff8a3d] text-xs transition-colors"
            >
              <Plus size={11} />
              Add guest
            </button>
          )}
        </div>

        {details.extraEmails.length === 0 && (
          <p className="text-[#f5f5f0]/25 text-xs py-1">
            Add up to 3 guest emails to receive a copy of the confirmation.
          </p>
        )}

        <div className="space-y-2">
          {details.extraEmails.map((em, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="email"
                value={em}
                onChange={e => updateExtraEmail(i, e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, [`extra-${i}`]: true }))}
                placeholder={`Guest ${i + 1} email`}
                className={
                  touched[`extra-${i}`] && errors.extraEmails?.[i]
                    ? `${inputError} flex-1`
                    : `${inputNormal} flex-1`
                }
              />
              <button
                onClick={() => removeExtraEmail(i)}
                className="w-10 flex-shrink-0 flex items-center justify-center rounded-xl border border-[#ff8a3d]/15 text-[#f5f5f0]/40 hover:text-red-400 hover:border-red-500/30 transition-all"
                aria-label="Remove guest email"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {details.extraEmails.map((_, i) =>
            touched[`extra-${i}`] && errors.extraEmails?.[i] ? (
              <p key={`err-${i}`} className="text-red-400 text-xs">{errors.extraEmails![i]}</p>
            ) : null
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 px-4 rounded-xl border border-[#ff8a3d]/20 text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:border-[#ff8a3d]/40 transition-all font-medium text-sm"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-[2] py-3.5 px-6 rounded-xl bg-gradient-to-br from-[#ffb68d] to-[#ff8a3d] text-[#080618] font-display font-medium text-base hover:shadow-[0_0_20px_rgba(255,138,61,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          Continue to payment
        </button>
      </div>
    </div>
  )
}
