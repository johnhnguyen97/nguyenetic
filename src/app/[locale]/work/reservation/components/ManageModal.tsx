"use client"

import { useState } from "react"
import { X, Edit2, Trash2, Check } from "lucide-react"

interface ManageModalProps {
  confirmationId: string
  date: string
  time: string
  party: number
  guestName: string
  deposit: number
  onClose: () => void
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

export function ManageModal({
  confirmationId,
  date,
  time,
  party,
  guestName,
  deposit,
  onClose,
}: ManageModalProps) {
  const [action, setAction] = useState<"idle" | "modifying" | "cancelling" | "modified" | "cancelled">("idle")

  function handleModify() {
    setAction("modifying")
    setTimeout(() => setAction("modified"), 1200)
  }

  function handleCancel() {
    setAction("cancelling")
    setTimeout(() => setAction("cancelled"), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0d0d1f] border border-[#ff8a3d]/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ff8a3d]/10">
          <h3 className="text-[#f5f5f0] font-display font-semibold">Manage reservation</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#f5f5f0]/40 hover:text-[#f5f5f0] hover:bg-[#ff8a3d]/10 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {action === "cancelled" ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <Check size={22} className="text-red-400" />
              </div>
              <p className="text-[#f5f5f0] font-medium mb-1">Reservation cancelled</p>
              <p className="text-[#f5f5f0]/50 text-sm">${deposit} refund processing to your card</p>
              <button onClick={onClose} className="mt-4 text-[#ff8a3d]/70 hover:text-[#ff8a3d] text-sm transition-colors">
                Close
              </button>
            </div>
          ) : action === "modified" ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Check size={22} className="text-emerald-400" />
              </div>
              <p className="text-[#f5f5f0] font-medium mb-1">Request sent!</p>
              <p className="text-[#f5f5f0]/50 text-sm">We&apos;ll confirm availability and reply within 1 hour.</p>
              <button onClick={onClose} className="mt-4 text-[#ff8a3d]/70 hover:text-[#ff8a3d] text-sm transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#080618]/60 border border-[#ff8a3d]/10 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#f5f5f0]/50">Confirmation</span>
                  <span className="text-[#f5f5f0] font-mono">#{confirmationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f5f5f0]/50">Guest</span>
                  <span className="text-[#f5f5f0]">{guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f5f5f0]/50">Date & time</span>
                  <span className="text-[#f5f5f0]">{formatDate(date)} · {formatTime(time)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f5f5f0]/50">Party</span>
                  <span className="text-[#f5f5f0]">{party} guests</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleModify}
                  disabled={action === "modifying"}
                  className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-[#ff8a3d]/20 bg-[#ff8a3d]/5 text-[#f5f5f0]/80 hover:text-[#f5f5f0] hover:border-[#ff8a3d]/40 transition-all text-sm"
                >
                  {action === "modifying" ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <Edit2 size={14} className="text-[#ff8a3d]" />
                  )}
                  {action === "modifying" ? "Sending request…" : "Request modification"}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={action === "cancelling"}
                  className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400/80 hover:text-red-400 hover:border-red-500/40 transition-all text-sm"
                >
                  {action === "cancelling" ? (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <Trash2 size={14} />
                  )}
                  {action === "cancelling" ? "Processing cancellation…" : "Cancel reservation"}
                </button>
              </div>

              <p className="text-[#f5f5f0]/25 text-xs text-center">
                Free cancellation up to 24h before your reservation.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
