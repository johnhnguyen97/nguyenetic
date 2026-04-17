"use client"

import { useState } from "react"
import { Search } from "lucide-react"

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

interface Reservation {
  id: string
  guestName: string
  party: number
  time: string
  status: "confirmed" | "seated" | "waitlist" | "cancelled"
  deposit: number
  note?: string
  isNew?: boolean
}

function generateMockReservations(newDate: string, newTime: string, newParty: number, newGuestName: string, newDeposit: number): Reservation[] {
  return [
    { id: "RC-8812", guestName: "Emily Chen", party: 4, time: "17:00", status: "confirmed", deposit: 60 },
    { id: "RC-8813", guestName: "Marcus Webb", party: 2, time: "17:30", status: "seated", deposit: 30, note: "Vegetarian" },
    { id: "RC-8814", guestName: "Aiko Tanaka", party: 6, time: "18:00", status: "confirmed", deposit: 90, note: "Birthday celebration" },
    { id: "RC-8815", guestName: "Jordan Lee", party: 3, time: "18:30", status: "confirmed", deposit: 45 },
    { id: "RC-8816", guestName: "Priya Sharma", party: 8, time: "19:00", status: "waitlist", deposit: 120, note: "Anniversary dinner" },
    { id: "RC-8817", guestName: "Tom & Sarah K.", party: 2, time: "19:30", status: "confirmed", deposit: 30 },
    { id: "RC-8818", guestName: "David Osei", party: 5, time: "20:00", status: "cancelled", deposit: 75 },
    { id: "RC-8819", guestName: "Mei Lin", party: 4, time: "20:30", status: "confirmed", deposit: 60, note: "Window seat preferred" },
    {
      id: newTime ? `RC-${Math.floor(Math.random() * 1000) + 8820}` : "RC-8820",
      guestName: newGuestName || "New Guest",
      party: newParty,
      time: newTime || "21:00",
      status: "confirmed",
      deposit: newDeposit,
      isNew: true,
    },
  ]
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  confirmed: { label: "Confirmed", bg: "bg-emerald-500/15", text: "text-emerald-400" },
  seated: { label: "Seated", bg: "bg-blue-500/15", text: "text-blue-400" },
  waitlist: { label: "Waitlist", bg: "bg-amber-500/15", text: "text-amber-400" },
  cancelled: { label: "Cancelled", bg: "bg-red-500/15", text: "text-red-400" },
}

interface OwnerDashboardProps {
  date: string
  time: string
  party: number
  guestName: string
  deposit: number
}

export function OwnerDashboard({ date, time, party, guestName, deposit }: OwnerDashboardProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "confirmed" | "seated" | "waitlist" | "cancelled">("all")

  const reservations = generateMockReservations(date, time, party, guestName, deposit)

  const filtered = reservations.filter(r => {
    const matchSearch = search === "" ||
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || r.status === filter
    return matchSearch && matchFilter
  })

  const totalGuests = reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.party, 0)
  const totalDeposits = reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.deposit, 0)
  const confirmedCount = reservations.filter(r => r.status === "confirmed" || r.status === "seated").length

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-display font-semibold text-[#f5f5f0] mb-0.5">
          Today&apos;s reservations
        </h2>
        <p className="text-[#f5f5f0]/40 text-sm">{formatDate(date) || "Today"}</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#080618]/60 border border-[#ff8a3d]/15 rounded-xl p-3 text-center">
          <div className="text-[#ff8a3d] font-display font-semibold text-xl">{confirmedCount}</div>
          <div className="text-[#f5f5f0]/40 text-xs mt-0.5">Bookings</div>
        </div>
        <div className="bg-[#080618]/60 border border-[#ff8a3d]/15 rounded-xl p-3 text-center">
          <div className="text-[#ff8a3d] font-display font-semibold text-xl">{totalGuests}</div>
          <div className="text-[#f5f5f0]/40 text-xs mt-0.5">Covers</div>
        </div>
        <div className="bg-[#080618]/60 border border-[#ff8a3d]/15 rounded-xl p-3 text-center">
          <div className="text-[#ff8a3d] font-display font-semibold text-xl">${totalDeposits}</div>
          <div className="text-[#f5f5f0]/40 text-xs mt-0.5">Deposits</div>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f5f5f0]/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guest or ID…"
            className="w-full bg-[#080618]/60 border border-[#ff8a3d]/15 rounded-xl pl-8 pr-3 py-2.5 text-[#f5f5f0] placeholder:text-[#f5f5f0]/25 text-sm outline-none focus:border-[#ff8a3d]/40 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as typeof filter)}
          className="bg-[#080618]/60 border border-[#ff8a3d]/15 rounded-xl px-3 py-2.5 text-[#f5f5f0]/70 text-sm outline-none focus:border-[#ff8a3d]/40 transition-all"
          aria-label="Filter by status"
        >
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="seated">Seated</option>
          <option value="waitlist">Waitlist</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservation list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-[#f5f5f0]/30 text-sm text-center py-6">No reservations match your search.</p>
        )}
        {filtered.map(r => {
          const statusCfg = STATUS_CONFIG[r.status]
          return (
            <div
              key={r.id}
              className={[
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                r.isNew
                  ? "border-[#ff8a3d]/50 bg-[#ff8a3d]/8 shadow-[0_0_16px_rgba(255,138,61,0.12)]"
                  : "border-[#ff8a3d]/10 bg-[#080618]/40 hover:border-[#ff8a3d]/25",
              ].join(" ")}
            >
              {/* Time */}
              <div className="w-14 flex-shrink-0 text-center">
                <div className="text-[#f5f5f0] text-xs font-medium">{formatTime(r.time)}</div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#f5f5f0] text-sm font-medium truncate">{r.guestName}</span>
                  {r.isNew && (
                    <span className="flex-shrink-0 text-xs bg-[#ff8a3d]/20 text-[#ff8a3d] px-1.5 py-0.5 rounded-full">New</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#f5f5f0]/40 text-xs">{r.party} guests</span>
                  {r.note && (
                    <span className="text-[#f5f5f0]/30 text-xs truncate">· {r.note}</span>
                  )}
                </div>
              </div>

              {/* Status + deposit */}
              <div className="flex-shrink-0 text-right space-y-1">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                  {statusCfg.label}
                </span>
                <div className="text-[#f5f5f0]/40 text-xs">${r.deposit}</div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[#f5f5f0]/20 text-xs text-center">
        Demo data — {reservations.length} reservations for illustration
      </p>
    </div>
  )
}
