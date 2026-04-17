"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Users, Clock } from "lucide-react"

const TIME_SLOTS = [
  { time: "17:00", label: "5:00 PM", available: 6 },
  { time: "17:30", label: "5:30 PM", available: 4 },
  { time: "18:00", label: "6:00 PM", available: 2 },
  { time: "18:30", label: "6:30 PM", available: 8 },
  { time: "19:00", label: "7:00 PM", available: 1 },
  { time: "19:30", label: "7:30 PM", available: 3 },
  { time: "20:00", label: "8:00 PM", available: 0 },
  { time: "20:30", label: "8:30 PM", available: 5 },
  { time: "21:00", label: "9:00 PM", available: 2 },
]

const DEPOSIT_PER_PERSON = 15

function getAvailabilityLabel(available: number): { label: string; color: string } {
  if (available === 0) return { label: "Waitlist", color: "text-red-400" }
  if (available <= 2) return { label: `${available} left`, color: "text-amber-400" }
  return { label: `${available} open`, color: "text-emerald-400" }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"]

interface StepDateProps {
  date: string
  time: string
  party: number
  onChange: (date: string, time: string, party: number) => void
  onNext: () => void
}

export function StepDate({ date, time, party, onChange, onNext }: StepDateProps) {
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  const deposit = party * DEPOSIT_PER_PERSON
  const canContinue = date !== "" && time !== "" && party >= 2

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const todayStr = today.toISOString().split("T")[0]

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11)
      setCalYear(y => y - 1)
    } else {
      setCalMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0)
      setCalYear(y => y + 1)
    } else {
      setCalMonth(m => m + 1)
    }
  }

  function selectDate(day: number) {
    const str = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    if (str < todayStr) return
    onChange(str, time, party)
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-[#f5f5f0] mb-1">
          Pick a date
        </h2>
        <p className="text-[#f5f5f0]/50 text-sm">
          Reserve your table · ${DEPOSIT_PER_PERSON}/person deposit
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-[#080618]/40 backdrop-blur-md border border-[#ff8a3d]/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ff8a3d]/10 text-[#f5f5f0]/60 hover:text-[#f5f5f0] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[#f5f5f0] font-display font-medium text-sm">
            {MONTH_NAMES[calMonth]} {calYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ff8a3d]/10 text-[#f5f5f0]/60 hover:text-[#f5f5f0] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-[#f5f5f0]/30 text-xs font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />
            const dayStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isPast = dayStr < todayStr
            const isSelected = dayStr === date
            const isToday = dayStr === todayStr

            return (
              <button
                key={day}
                onClick={() => selectDate(day)}
                disabled={isPast}
                aria-label={`${MONTH_NAMES[calMonth]} ${day}, ${calYear}`}
                aria-pressed={isSelected}
                className={[
                  "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                  isPast ? "text-[#f5f5f0]/20 cursor-not-allowed" : "cursor-pointer",
                  isSelected
                    ? "bg-gradient-to-br from-[#ffb68d] to-[#ff8a3d] text-[#080618] shadow-[0_0_12px_rgba(255,138,61,0.4)]"
                    : !isPast
                    ? "text-[#f5f5f0]/80 hover:bg-[#ff8a3d]/15 hover:text-[#f5f5f0]"
                    : "",
                  isToday && !isSelected ? "ring-1 ring-[#ff8a3d]/40 text-[#ff8a3d]" : "",
                ].join(" ")}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {date && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-[#ff8a3d]" />
            <span className="text-[#f5f5f0]/60 text-sm font-medium">Available times</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(slot => {
              const avail = getAvailabilityLabel(slot.available)
              const isSelected = time === slot.time

              return (
                <button
                  key={slot.time}
                  onClick={() => onChange(date, slot.time, party)}
                  aria-pressed={isSelected}
                  className={[
                    "flex flex-col items-center py-2.5 px-2 rounded-xl border text-sm transition-all",
                    isSelected
                      ? "border-[#ff8a3d] bg-[#ff8a3d]/15 text-[#f5f5f0]"
                      : "border-[#ff8a3d]/15 bg-[#080618]/40 text-[#f5f5f0]/70 hover:border-[#ff8a3d]/35 hover:text-[#f5f5f0]",
                  ].join(" ")}
                >
                  <span className="font-medium">{slot.label}</span>
                  <span className={`text-xs mt-0.5 ${isSelected ? "text-[#ff8a3d]" : avail.color}`}>
                    {avail.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Party size */}
      {date && time && (
        <div className="bg-[#080618]/40 backdrop-blur-md border border-[#ff8a3d]/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-[#ff8a3d]" />
            <span className="text-[#f5f5f0]/60 text-sm font-medium">Party size</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onChange(date, time, Math.max(2, party - 1))}
                aria-label="Decrease party size"
                className="w-10 h-10 rounded-xl border border-[#ff8a3d]/25 text-[#f5f5f0]/70 hover:border-[#ff8a3d]/50 hover:text-[#f5f5f0] transition-all flex items-center justify-center text-lg font-light"
              >
                −
              </button>
              <span className="text-2xl font-display font-semibold text-[#f5f5f0] w-8 text-center">
                {party}
              </span>
              <button
                onClick={() => onChange(date, time, Math.min(12, party + 1))}
                aria-label="Increase party size"
                className="w-10 h-10 rounded-xl border border-[#ff8a3d]/25 text-[#f5f5f0]/70 hover:border-[#ff8a3d]/50 hover:text-[#f5f5f0] transition-all flex items-center justify-center text-lg font-light"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <div className="text-[#f5f5f0]/40 text-xs mb-0.5">Deposit total</div>
              <div className="text-[#ff8a3d] font-display font-semibold text-xl">
                ${deposit}
              </div>
              <div className="text-[#f5f5f0]/30 text-xs">${DEPOSIT_PER_PERSON}/person</div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className={[
          "w-full py-3.5 px-6 rounded-xl font-display font-medium text-base transition-all",
          canContinue
            ? "bg-gradient-to-br from-[#ffb68d] to-[#ff8a3d] text-[#080618] hover:shadow-[0_0_20px_rgba(255,138,61,0.35)] hover:-translate-y-0.5 active:translate-y-0"
            : "bg-[#080618]/60 border border-[#ff8a3d]/15 text-[#f5f5f0]/30 cursor-not-allowed",
        ].join(" ")}
      >
        {canContinue
          ? `Continue — ${party} guests · $${deposit} deposit`
          : "Select date, time & party size"}
      </button>
    </div>
  )
}
