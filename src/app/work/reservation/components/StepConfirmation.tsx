"use client"

import { useState } from "react"
import { Check, Calendar, Users, Mail, ChevronDown, ChevronUp } from "lucide-react"
import { QrCode } from "./QrCode"

interface StepConfirmationProps {
  date: string
  time: string
  party: number
  deposit: number
  guestName: string
  guestEmail: string
  confirmationId: string
  onManage: () => void
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

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#ff8a3d] text-[#080618] font-medium text-sm px-5 py-2.5 rounded-full shadow-lg z-50 pointer-events-none">
      {message}
    </div>
  )
}

export function StepConfirmation({
  date,
  time,
  party,
  deposit,
  guestName,
  guestEmail,
  confirmationId,
  onManage,
}: StepConfirmationProps) {
  const [toast, setToast] = useState<string | null>(null)
  const [showEmail, setShowEmail] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const qrValue = `RES:${confirmationId}:${date}:${time}:${party}`
  const formattedDate = formatDate(date)
  const formattedTime = formatTime(time)

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast} />}

      {/* Success header */}
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Check size={28} className="text-emerald-400" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-display font-semibold text-[#f5f5f0] mb-1">
          You&apos;re confirmed!
        </h2>
        <p className="text-[#f5f5f0]/50 text-sm">
          Confirmation #{confirmationId}
        </p>
      </div>

      {/* Reservation card */}
      <div className="bg-[#080618]/40 backdrop-blur-md border border-[#ff8a3d]/20 rounded-2xl p-5">
        <div className="flex gap-5">
          {/* QR code */}
          <div className="flex-shrink-0">
            <QrCode value={qrValue} size={120} className="rounded-xl overflow-hidden" />
            <p className="text-[#f5f5f0]/30 text-xs text-center mt-2">Scan at door</p>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="text-[#f5f5f0]/40 text-xs uppercase tracking-wider mb-0.5">Guest</div>
              <div className="text-[#f5f5f0] font-medium text-sm truncate">{guestName}</div>
            </div>
            <div className="flex gap-1.5 items-start">
              <Calendar size={13} className="text-[#ff8a3d] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[#f5f5f0] text-sm">{formattedDate}</div>
                <div className="text-[#f5f5f0]/50 text-xs">{formattedTime}</div>
              </div>
            </div>
            <div className="flex gap-1.5 items-center">
              <Users size={13} className="text-[#ff8a3d] flex-shrink-0" />
              <span className="text-[#f5f5f0] text-sm">{party} guests</span>
            </div>
            <div className="pt-2 border-t border-[#ff8a3d]/10">
              <div className="text-[#f5f5f0]/40 text-xs">Deposit paid</div>
              <div className="text-[#ff8a3d] font-semibold">${deposit}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => showToast("Demo — Apple Wallet pass download would happen here")}
          aria-disabled="true"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#ff8a3d]/20 bg-[#080618]/40 text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:border-[#ff8a3d]/40 transition-all text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
          </svg>
          Apple Wallet <span className="text-[#f5f5f0]/30 text-xs">(demo)</span>
        </button>
        <button
          onClick={() => showToast("Demo — Google Wallet pass download would happen here")}
          aria-disabled="true"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#ff8a3d]/20 bg-[#080618]/40 text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:border-[#ff8a3d]/40 transition-all text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google Wallet <span className="text-[#f5f5f0]/30 text-xs">(demo)</span>
        </button>
      </div>

      {/* Email preview */}
      <div className="bg-[#080618]/40 backdrop-blur-md border border-[#ff8a3d]/15 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowEmail(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm"
        >
          <div className="flex items-center gap-2 text-[#f5f5f0]/60">
            <Mail size={13} />
            <span>Confirmation email preview</span>
            <span className="text-[#f5f5f0]/30 text-xs">→ {guestEmail}</span>
          </div>
          {showEmail
            ? <ChevronUp size={14} className="text-[#f5f5f0]/40" />
            : <ChevronDown size={14} className="text-[#f5f5f0]/40" />}
        </button>

        {showEmail && (
          <div className="border-t border-[#ff8a3d]/10 p-4">
            {/* Email mockup */}
            <div className="bg-[#f5f5f0] rounded-xl p-4 text-[#080618]">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffb68d] to-[#ff8a3d] flex items-center justify-center text-white text-xs font-bold">N</div>
                <div>
                  <div className="text-xs font-semibold">Ichiban Restaurant</div>
                  <div className="text-xs text-gray-500">reservations@ichiban.com</div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1">Your table is confirmed — see you {formattedDate}.</p>
              <p className="text-xs text-gray-600 mb-3">Hi {guestName.split(" ")[0]}, your reservation for {party} guests at {formattedTime} is all set.</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1 mb-3">
                <div className="flex justify-between"><span className="text-gray-500">Confirmation</span><span className="font-medium">#{confirmationId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{formattedDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{formattedTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Deposit paid</span><span className="font-medium text-green-600">${deposit}</span></div>
              </div>
              <div className="bg-[#ff8a3d] text-white text-xs font-medium text-center py-2 rounded-lg">
                View reservation
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Need to cancel? Do it 24h before for a full refund.</p>
            </div>
          </div>
        )}
      </div>

      {/* Manage link */}
      <div className="text-center pt-1">
        <button
          onClick={onManage}
          className="text-[#ff8a3d]/70 hover:text-[#ff8a3d] text-sm transition-colors underline underline-offset-4"
        >
          Manage this reservation
        </button>
      </div>
    </div>
  )
}
