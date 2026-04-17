"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Trash2, TrendingDown, PlusCircle, BarChart2, Zap, Mail } from "lucide-react"
import { LeadCapture } from "@/components/ui/lead-capture"

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "Protein" | "Produce" | "Dairy" | "Bakery" | "Dry Goods" | "Prepared" | "Other"
type Unit = "lb" | "oz" | "each" | "gal" | "L"
type Reason = "Expired" | "Prep error" | "Over-produced" | "Customer return" | "Spoiled" | "Other"

interface Entry {
  id: string
  date: string
  item: string
  category: Category
  quantity: number
  unit: Unit
  cost: number
  reason: Reason
  notes?: string
}

// ─── Deterministic seed data ──────────────────────────────────────────────────

function seedEntries(): Entry[] {
  // Anchor to today so the "last 7 days" KPI always has data
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  function d(daysAgo: number): string {
    const dt = new Date(base)
    dt.setDate(base.getDate() - daysAgo)
    return dt.toISOString().slice(0, 10)
  }

  return [
    { id: "s001", date: d(13), item: "Atlantic Salmon", category: "Protein", quantity: 2.5, unit: "lb", cost: 48, reason: "Expired", notes: "Over-ordered for weekend" },
    { id: "s002", date: d(13), item: "Croissants", category: "Bakery", quantity: 12, unit: "each", cost: 18, reason: "Over-produced" },
    { id: "s003", date: d(12), item: "Whole Milk", category: "Dairy", quantity: 1, unit: "gal", cost: 6, reason: "Spoiled" },
    { id: "s004", date: d(12), item: "Romaine Lettuce", category: "Produce", quantity: 3, unit: "each", cost: 9, reason: "Expired" },
    { id: "s005", date: d(11), item: "Chicken Breast", category: "Protein", quantity: 3, unit: "lb", cost: 22, reason: "Prep error", notes: "Butchered wrong cut" },
    { id: "s006", date: d(11), item: "Heavy Cream", category: "Dairy", quantity: 0.5, unit: "gal", cost: 8, reason: "Spoiled" },
    { id: "s007", date: d(10), item: "Sourdough Loaves", category: "Bakery", quantity: 4, unit: "each", cost: 16, reason: "Over-produced" },
    { id: "s008", date: d(10), item: "Heirloom Tomatoes", category: "Produce", quantity: 2, unit: "lb", cost: 12, reason: "Expired" },
    { id: "s009", date: d(9), item: "Tuna", category: "Protein", quantity: 1.5, unit: "lb", cost: 36, reason: "Customer return", notes: "Customer complained about temp" },
    { id: "s010", date: d(9), item: "Greek Yogurt", category: "Dairy", quantity: 4, unit: "each", cost: 10, reason: "Expired" },
    { id: "s011", date: d(8), item: "Avocados", category: "Produce", quantity: 6, unit: "each", cost: 9, reason: "Spoiled", notes: "Ripened too fast" },
    { id: "s012", date: d(8), item: "Beef Tenderloin", category: "Protein", quantity: 1, unit: "lb", cost: 42, reason: "Prep error" },
    { id: "s013", date: d(7), item: "Pasta Dough", category: "Prepared", quantity: 2, unit: "lb", cost: 14, reason: "Over-produced" },
    { id: "s014", date: d(7), item: "Brioche Buns", category: "Bakery", quantity: 8, unit: "each", cost: 12, reason: "Over-produced" },
    { id: "s015", date: d(6), item: "Spinach", category: "Produce", quantity: 1, unit: "lb", cost: 7, reason: "Expired" },
    { id: "s016", date: d(6), item: "Atlantic Salmon", category: "Protein", quantity: 1.5, unit: "lb", cost: 29, reason: "Over-produced" },
    { id: "s017", date: d(5), item: "Gruyère Cheese", category: "Dairy", quantity: 0.5, unit: "lb", cost: 11, reason: "Expired" },
    { id: "s018", date: d(5), item: "Mushroom Risotto", category: "Prepared", quantity: 3, unit: "each", cost: 21, reason: "Customer return" },
    { id: "s019", date: d(4), item: "Branzino", category: "Protein", quantity: 2, unit: "lb", cost: 38, reason: "Expired" },
    { id: "s020", date: d(4), item: "Butter", category: "Dairy", quantity: 1, unit: "lb", cost: 6, reason: "Spoiled" },
    { id: "s021", date: d(3), item: "Croissants", category: "Bakery", quantity: 9, unit: "each", cost: 13, reason: "Over-produced" },
    { id: "s022", date: d(3), item: "Mixed Greens", category: "Produce", quantity: 0.5, unit: "lb", cost: 5, reason: "Expired" },
    { id: "s023", date: d(2), item: "Duck Breast", category: "Protein", quantity: 1, unit: "lb", cost: 27, reason: "Prep error" },
    { id: "s024", date: d(2), item: "Crème Brûlée Mix", category: "Prepared", quantity: 6, unit: "each", cost: 18, reason: "Over-produced" },
    { id: "s025", date: d(1), item: "Strawberries", category: "Produce", quantity: 1, unit: "lb", cost: 8, reason: "Spoiled" },
    { id: "s026", date: d(1), item: "Parmesan", category: "Dairy", quantity: 0.25, unit: "lb", cost: 5, reason: "Expired" },
    { id: "s027", date: d(0), item: "Chicken Stock", category: "Prepared", quantity: 2, unit: "gal", cost: 12, reason: "Expired" },
    { id: "s028", date: d(0), item: "Wagyu Burger", category: "Protein", quantity: 0.5, unit: "lb", cost: 18, reason: "Customer return" },
  ]
}

const STORAGE_KEY = "waste-ledger-entries"
const SEED_KEY = "waste-ledger-seeded"
const SEED_DATE_KEY = "waste-ledger-seed-date"

// ─── Mini markdown renderer ────────────────────────────────────────────────────

function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n")
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("## ")) {
      nodes.push(
        <h3 key={i} className="font-display font-semibold text-[oklch(0.97_0.008_80)] text-lg mt-5 mb-2">
          {line.slice(3)}
        </h3>
      )
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      nodes.push(
        <p key={i} className="font-semibold text-[oklch(0.97_0.008_80)] mt-3 mb-1">
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.match(/^\*\*[^*]+\*\*/)) {
      // Inline bold — render as paragraph with mixed bold
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      nodes.push(
        <p key={i} className="text-[oklch(0.75_0.005_260)] text-sm leading-relaxed mb-1">
          {parts.map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j} className="text-[oklch(0.97_0.008_80)]">{p.slice(2, -2)}</strong>
              : p
          )}
        </p>
      )
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      nodes.push(
        <li key={i} className="text-[oklch(0.75_0.005_260)] text-sm leading-relaxed ml-4 list-disc">
          {line.slice(2)}
        </li>
      )
    } else if (line.trim() === "") {
      nodes.push(<div key={i} className="h-1" />)
    } else {
      nodes.push(
        <p key={i} className="text-[oklch(0.75_0.005_260)] text-sm leading-relaxed mb-1">
          {line}
        </p>
      )
    }
    i++
  }

  return nodes
}

// ─── SVG sparkline ─────────────────────────────────────────────────────────────

function Sparkline({ entries }: { entries: Entry[] }) {
  const days = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of entries) {
      map[e.date] = (map[e.date] ?? 0) + e.cost
    }
    const sorted = Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-14)
    return sorted
  }, [entries])

  if (days.length < 2) return null

  const W = 260
  const H = 48
  const max = Math.max(...days.map(([, v]) => v), 1)
  const pts = days.map(([, v], i) => {
    const x = (i / (days.length - 1)) * W
    const y = H - (v / max) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const path = `M ${pts.join(" L ")}`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden className="w-full h-12">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.74 0.15 55)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.74 0.15 55)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L ${W},${H} L 0,${H} Z`}
        fill="url(#spark-fill)"
      />
      <path d={path} stroke="oklch(0.74 0.15 55)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Horizontal bar chart ─────────────────────────────────────────────────────

function CategoryBars({ entries }: { entries: Entry[] }) {
  const cats = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of entries) {
      map[e.category] = (map[e.category] ?? 0) + e.cost
    }
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 5)
  }, [entries])

  const total = cats.reduce((s, [, v]) => s + v, 0)
  const max = cats[0]?.[1] ?? 1

  return (
    <div className="space-y-2.5">
      {cats.map(([cat, val]) => (
        <div key={cat} className="flex items-center gap-3 text-sm">
          <span className="w-20 shrink-0 text-[oklch(0.75_0.005_260)] text-xs truncate">{cat}</span>
          <div className="flex-1 h-5 bg-[oklch(0.14_0.005_260)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(val / max) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[oklch(0.74_0.15_55)] to-[oklch(0.80_0.16_55)] rounded-full"
            />
          </div>
          <span className="w-20 text-right shrink-0 text-[oklch(0.74_0.15_55)] text-xs font-mono">
            ${val.toFixed(0)} · {((val / total) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Top items table ───────────────────────────────────────────────────────────

function TopItemsTable({ entries }: { entries: Entry[] }) {
  const items = useMemo(() => {
    const map: Record<string, { total: number; category: string; reasons: Record<string, number> }> = {}
    for (const e of entries) {
      if (!map[e.item]) map[e.item] = { total: 0, category: e.category, reasons: {} }
      map[e.item].total += e.cost
      map[e.item].reasons[e.reason] = (map[e.item].reasons[e.reason] ?? 0) + 1
    }
    return Object.entries(map).sort(([, a], [, b]) => b.total - a.total).slice(0, 5)
  }, [entries])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Top wasted items">
        <thead>
          <tr className="border-b border-[oklch(0.22_0.005_260)]">
            <th className="text-left py-2 px-3 text-[oklch(0.55_0.005_260)] font-medium text-xs uppercase tracking-wide">Item</th>
            <th className="text-left py-2 px-3 text-[oklch(0.55_0.005_260)] font-medium text-xs uppercase tracking-wide">Category</th>
            <th className="text-right py-2 px-3 text-[oklch(0.55_0.005_260)] font-medium text-xs uppercase tracking-wide">Wasted $</th>
            <th className="text-left py-2 px-3 text-[oklch(0.55_0.005_260)] font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Top reason</th>
          </tr>
        </thead>
        <tbody>
          {items.map(([name, d], i) => {
            const topReason = Object.entries(d.reasons).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—"
            return (
              <motion.tr
                key={name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-[oklch(0.18_0.005_260)] hover:bg-[oklch(0.14_0.005_260/50%)] transition-colors"
              >
                <td className="py-2.5 px-3 text-[oklch(0.90_0.008_80)] font-medium">{name}</td>
                <td className="py-2.5 px-3 text-[oklch(0.65_0.005_260)]">{d.category}</td>
                <td className="py-2.5 px-3 text-right text-[oklch(0.74_0.15_55)] font-mono font-semibold">${d.total.toFixed(0)}</td>
                <td className="py-2.5 px-3 text-[oklch(0.55_0.005_260)] text-xs hidden sm:table-cell">{topReason}</td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── New entry form ────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = ["Protein", "Produce", "Dairy", "Bakery", "Dry Goods", "Prepared", "Other"]
const UNITS: Unit[] = ["lb", "oz", "each", "gal", "L"]
const REASONS: Reason[] = ["Expired", "Prep error", "Over-produced", "Customer return", "Spoiled", "Other"]

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

interface FormState {
  item: string
  category: Category
  quantity: string
  unit: Unit
  cost: string
  reason: Reason
  date: string
  notes: string
}

function defaultForm(): FormState {
  return { item: "", category: "Protein", quantity: "", unit: "lb", cost: "", reason: "Expired", date: today(), notes: "" }
}

function AddEntryForm({ onAdd }: { onAdd: (e: Entry) => void }) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [error, setError] = useState("")
  const shouldReduce = useReducedMotion()

  function set(k: keyof FormState, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.item.trim()) { setError("Item name is required."); return }
    const qty = parseFloat(form.quantity)
    const cost = parseFloat(form.cost)
    if (isNaN(qty) || qty <= 0) { setError("Enter a valid quantity."); return }
    if (isNaN(cost) || cost <= 0) { setError("Enter a valid cost."); return }

    const entry: Entry = {
      id: `u${Date.now()}`,
      date: form.date,
      item: form.item.trim(),
      category: form.category,
      quantity: qty,
      unit: form.unit,
      cost,
      reason: form.reason,
      notes: form.notes.trim() || undefined,
    }
    onAdd(entry)
    setForm(defaultForm)
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] text-[oklch(0.97_0.008_80)] placeholder:text-[oklch(0.45_0.01_260)] text-sm focus:outline-none focus:border-[oklch(0.74_0.15_55/60%)] transition-colors"
  const selectCls = `${inputCls} appearance-none cursor-pointer`

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      noValidate
      aria-label="Log waste entry"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Item name *</label>
          <input
            type="text"
            placeholder="e.g. Atlantic Salmon"
            value={form.item}
            onChange={e => set("item", e.target.value)}
            className={inputCls}
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Category</label>
          <select value={form.category} onChange={e => set("category", e.target.value as Category)} className={selectCls}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Qty *</label>
            <input
              type="number"
              placeholder="2.5"
              value={form.quantity}
              min="0"
              step="0.01"
              onChange={e => set("quantity", e.target.value)}
              className={inputCls}
              required
              aria-required="true"
            />
          </div>
          <div className="w-20">
            <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Unit</label>
            <select value={form.unit} onChange={e => set("unit", e.target.value as Unit)} className={selectCls}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Cost ($) *</label>
          <input
            type="number"
            placeholder="48.00"
            value={form.cost}
            min="0"
            step="0.01"
            onChange={e => set("cost", e.target.value)}
            className={inputCls}
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Reason</label>
          <select value={form.reason} onChange={e => set("reason", e.target.value as Reason)} className={selectCls}>
            {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => set("date", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.55_0.005_260)] mb-1.5 uppercase tracking-wide">Notes (optional)</label>
          <input
            type="text"
            placeholder="Any context..."
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs" role="alert">{error}</p>}

      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-display font-semibold text-sm text-[oklch(0.08_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] transition-all shadow-[0_0_20px_oklch(0.74_0.15_55/25%)] flex items-center gap-2"
      >
        <Trash2 size={15} aria-hidden />
        Log waste
      </button>
    </motion.form>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) { setDisplay(value); return }
    const start = display
    const diff = value - start
    const duration = 500
    const startTime = performance.now()

    function frame(now: number) {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(start + diff * eased)
      if (t < 1) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <>{prefix}{display.toFixed(0)}</>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WasteLedgerPage() {
  const shouldReduce = useReducedMotion()
  const [entries, setEntries] = useState<Entry[]>([])
  const [hydrated, setHydrated] = useState(false)

  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [leadCaptured, setLeadCaptured] = useState(false)

  // Load from localStorage, seed if empty or seed is stale (date changed)
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const seedDate = localStorage.getItem(SEED_DATE_KEY)
      const raw = localStorage.getItem(STORAGE_KEY)
      const seeded = localStorage.getItem(SEED_KEY)

      // Reseed daily so rolling window always has data
      if (seeded && seedDate !== today) {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(SEED_KEY)
      }

      const freshRaw = localStorage.getItem(STORAGE_KEY)
      const freshSeeded = localStorage.getItem(SEED_KEY)
      if (freshRaw) {
        setEntries(JSON.parse(freshRaw) as Entry[])
      } else if (!freshSeeded) {
        const seed = seedEntries()
        setEntries(seed)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
        localStorage.setItem(SEED_KEY, "1")
        localStorage.setItem(SEED_DATE_KEY, today)
      }
    } catch {
      setEntries(seedEntries())
    }
    setHydrated(true)
  }, [])

  // Persist entries on change (after hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch { /* quota exceeded — ignore */ }
  }, [entries, hydrated])

  const handleAdd = useCallback((entry: Entry) => {
    setEntries(prev => [entry, ...prev])
    // Clear old report on new data
    setReportMarkdown(null)
    setReportError(null)
  }, [])

  // Dashboard metrics
  const thisWeek = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)
    return entries.filter(e => new Date(e.date) >= cutoff)
  }, [entries])

  const weekCost = useMemo(() => thisWeek.reduce((s, e) => s + e.cost, 0), [thisWeek])

  const topCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of thisWeek) map[e.category] = (map[e.category] ?? 0) + e.cost
    return Object.entries(map).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "None"
  }, [thisWeek])

  async function generateReport() {
    setReportLoading(true)
    setReportError(null)
    setReportMarkdown(null)

    try {
      const res = await fetch("/api/waste-ledger/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: thisWeek.length > 0 ? thisWeek : entries }),
      })
      const data = await res.json() as { ok?: boolean; markdown?: string; error?: string }
      if (!res.ok || !data.ok) {
        setReportError(data.error ?? "Failed to generate report.")
      } else {
        setReportMarkdown(data.markdown ?? "")
      }
    } catch {
      setReportError("Network error. Please try again.")
    } finally {
      setReportLoading(false)
    }
  }

  const cardCls = "bg-[oklch(0.08_0.005_260/40%)] backdrop-blur-md border border-[oklch(0.74_0.15_55/12%)] rounded-2xl p-5"
  const fadeIn = (delay = 0) => shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay } }

  return (
    <main className="min-h-screen bg-[oklch(0.08_0.005_260)] text-[oklch(0.97_0.008_80)]">

      {/* Back nav */}
      <nav className="sticky top-0 z-10 border-b border-[oklch(0.22_0.005_260)] bg-[oklch(0.08_0.005_260/80%)] backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/#work"
            className="flex items-center gap-1.5 text-[oklch(0.55_0.005_260)] hover:text-[oklch(0.97_0.008_80)] text-sm transition-colors"
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={16} aria-hidden />
            Back
          </Link>
          <span className="text-[oklch(0.28_0.005_260)]">·</span>
          <span className="font-display font-semibold text-sm text-[oklch(0.74_0.15_55)]">Waste Ledger</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* ── Section 1: Hero ── */}
        <section aria-labelledby="hero-heading">
          <motion.p {...fadeIn(0)} className="text-[oklch(0.55_0.005_260)] text-sm tracking-widest uppercase mb-4">
            Built for: single-location restaurants, bars, cafés, ghost kitchens.
          </motion.p>
          <motion.h1
            id="hero-heading"
            {...fadeIn(0.05)}
            className="font-display font-bold leading-tight mb-5"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            Stop throwing{" "}
            <span className="text-[oklch(0.74_0.15_55)]">$400 a week</span>
            <br />in the dumpster.
          </motion.h1>
          <motion.p {...fadeIn(0.1)} className="text-[oklch(0.75_0.005_260)] text-lg max-w-2xl leading-relaxed">
            Log 10 seconds of waste each night. Get a weekly Claude-generated report showing exactly where the money went, and what a 30% cut would save you.
          </motion.p>
        </section>

        {/* ── Section 2: Live Dashboard ── */}
        <section aria-labelledby="dashboard-heading">
          <motion.h2
            id="dashboard-heading"
            {...fadeIn(0.15)}
            className="font-display font-semibold text-2xl mb-6 flex items-center gap-2"
          >
            <BarChart2 size={22} className="text-[oklch(0.74_0.15_55)]" aria-hidden />
            Live dashboard
          </motion.h2>

          {hydrated && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* This week cost */}
              <motion.div {...fadeIn(0.18)} className={cardCls}>
                <p className="text-[oklch(0.55_0.005_260)] text-xs uppercase tracking-wide mb-1">This week&apos;s waste</p>
                <p className="font-display font-bold text-4xl text-[oklch(0.74_0.15_55)]">
                  <AnimatedNumber value={weekCost} />
                </p>
                <p className="text-[oklch(0.55_0.005_260)] text-xs mt-1">{thisWeek.length} {thisWeek.length === 1 ? "entry" : "entries"} · last 7 days</p>
              </motion.div>

              {/* Top category */}
              <motion.div {...fadeIn(0.21)} className={cardCls}>
                <p className="text-[oklch(0.55_0.005_260)] text-xs uppercase tracking-wide mb-1">Top waste category</p>
                <p className="font-display font-bold text-3xl text-[oklch(0.90_0.008_80)]">{topCategory}</p>
                <p className="text-[oklch(0.55_0.005_260)] text-xs mt-1">This week&apos;s biggest leak</p>
              </motion.div>

              {/* Trend sparkline */}
              <motion.div {...fadeIn(0.24)} className={`${cardCls} sm:col-span-2 lg:col-span-1`}>
                <p className="text-[oklch(0.55_0.005_260)] text-xs uppercase tracking-wide mb-2">14-day trend</p>
                <Sparkline entries={entries} />
              </motion.div>
            </div>
          )}

          {/* Category bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div {...fadeIn(0.27)} className={cardCls}>
              <p className="font-display font-semibold text-sm mb-4 text-[oklch(0.97_0.008_80)]">Waste by category</p>
              {hydrated && <CategoryBars entries={thisWeek.length > 0 ? thisWeek : entries} />}
            </motion.div>

            {/* Top items */}
            <motion.div {...fadeIn(0.30)} className={cardCls}>
              <p className="font-display font-semibold text-sm mb-3 text-[oklch(0.97_0.008_80)]">Top 5 most-wasted items</p>
              {hydrated && <TopItemsTable entries={thisWeek.length > 0 ? thisWeek : entries} />}
            </motion.div>
          </div>
        </section>

        {/* ── Section 3: Add entry ── */}
        <section aria-labelledby="add-entry-heading">
          <motion.h2
            id="add-entry-heading"
            {...fadeIn(0.32)}
            className="font-display font-semibold text-2xl mb-6 flex items-center gap-2"
          >
            <PlusCircle size={22} className="text-[oklch(0.74_0.15_55)]" aria-hidden />
            Log tonight&apos;s waste
          </motion.h2>
          <motion.div {...fadeIn(0.34)} className={cardCls}>
            <AddEntryForm onAdd={handleAdd} />
          </motion.div>

          {/* Recent entries */}
          <AnimatePresence>
            {entries.slice(0, 5).map((e) => (
              <motion.div
                key={e.id}
                initial={shouldReduce ? {} : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={shouldReduce ? {} : { opacity: 0, height: 0 }}
                className="mt-2 border-b border-[oklch(0.18_0.005_260)] py-2.5 px-1 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[oklch(0.74_0.15_55)] font-mono text-xs">{e.date}</span>
                  <span className="text-[oklch(0.90_0.008_80)]">{e.item}</span>
                  <span className="text-[oklch(0.55_0.005_260)] text-xs hidden sm:inline">{e.reason}</span>
                </div>
                <span className="text-[oklch(0.74_0.15_55)] font-mono font-semibold">${e.cost.toFixed(0)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* ── Section 4: AI weekly report ── */}
        <section aria-labelledby="report-heading">
          <motion.h2
            id="report-heading"
            {...fadeIn(0.36)}
            className="font-display font-semibold text-2xl mb-2 flex items-center gap-2"
          >
            <Zap size={22} className="text-[oklch(0.74_0.15_55)]" aria-hidden />
            This week&apos;s AI-generated insights
          </motion.h2>
          <motion.p {...fadeIn(0.38)} className="text-[oklch(0.65_0.005_260)] text-sm mb-6">
            Claude analyzes your waste patterns and surfaces the three highest-leverage fixes.
          </motion.p>

          <motion.div {...fadeIn(0.40)} className={cardCls}>
            {!reportMarkdown && !reportLoading && (
              <div className="text-center py-8">
                <p className="text-[oklch(0.65_0.005_260)] text-sm mb-5">
                  Ready to analyze {thisWeek.length > 0 ? thisWeek.length : entries.length} entries.
                </p>
                <button
                  onClick={generateReport}
                  className="px-6 py-2.5 rounded-xl font-display font-semibold text-sm text-[oklch(0.08_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] transition-all shadow-[0_0_20px_oklch(0.74_0.15_55/25%)]"
                >
                  Generate report
                </button>
                {reportError && (
                  <p className="text-red-400 text-xs mt-3" role="alert">{reportError}</p>
                )}
              </div>
            )}

            {reportLoading && (
              <div className="space-y-3 py-4" aria-busy="true" aria-label="Generating report">
                {[1, 0.7, 0.5, 0.8, 0.6].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 rounded-full bg-[oklch(0.18_0.005_260)] animate-pulse"
                    style={{ width: `${w * 100}%` }}
                  />
                ))}
                <p className="text-[oklch(0.55_0.005_260)] text-xs mt-2">Claude is analyzing your waste data…</p>
              </div>
            )}

            {reportMarkdown && (
              <motion.div
                initial={shouldReduce ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose-sm"
              >
                {renderMarkdown(reportMarkdown)}
                <div className="mt-5 pt-4 border-t border-[oklch(0.22_0.005_260)] flex justify-between items-center">
                  <p className="text-[oklch(0.45_0.005_260)] text-xs">Generated by Claude Sonnet</p>
                  <button
                    onClick={generateReport}
                    className="text-[oklch(0.74_0.15_55)] hover:text-[oklch(0.80_0.16_55)] text-xs underline transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* ── Section 5: Funnel CTA ── */}
        <section aria-labelledby="cta-heading">
          <motion.div {...fadeIn(0.42)} className={`${cardCls} border-[oklch(0.74_0.15_55/25%)]`}>
            <h2 id="cta-heading" className="font-display font-bold text-2xl mb-2">
              Get this emailed to you every Monday.
            </h2>
            <p className="text-[oklch(0.75_0.005_260)] text-sm mb-6">
              Weekly AI-generated waste report straight to your inbox. First month free. $39/mo after.
            </p>

            {leadCaptured ? (
              <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[oklch(0.74_0.15_55/10%)] border border-[oklch(0.74_0.15_55/25%)] rounded-xl p-4 text-center"
              >
                <p className="font-display font-semibold text-[oklch(0.97_0.008_80)]">You&apos;re on the list.</p>
                <p className="text-[oklch(0.75_0.005_260)] text-sm mt-1">You&apos;ll get your first report next Monday.</p>
              </motion.div>
            ) : (
              <LeadCapture
                appSlug="waste-ledger"
                context="weekly-email-signup"
                buttonLabel="Start free month"
                onCaptured={() => setLeadCaptured(true)}
                metadata={{
                  weeklyCost: Math.round(weekCost),
                  topCategory,
                }}
              />
            )}
          </motion.div>

          {/* Secondary CTA */}
          <motion.div {...fadeIn(0.44)} className="mt-4">
            <a
              href="mailto:hello@nguyenetic.com?subject=Multi-location waste tracking"
              className={`${cardCls} block hover:border-[oklch(0.74_0.15_55/25%)] transition-colors group`}
            >
              <p className="text-[oklch(0.90_0.008_80)] text-sm group-hover:text-[oklch(0.97_0.008_80)] transition-colors">
                <span className="flex items-center gap-2">
                  <Mail size={15} className="text-[oklch(0.74_0.15_55)]" aria-hidden />
                  Need help setting up waste tracking for a multi-location operation?
                </span>
              </p>
              <p className="text-[oklch(0.55_0.005_260)] text-xs mt-1 ml-5">hello@nguyenetic.com → Multi-location waste tracking</p>
            </a>
          </motion.div>
        </section>

        {/* ── Section 6: How it works ── */}
        <section aria-labelledby="how-heading">
          <motion.h2
            id="how-heading"
            {...fadeIn(0.46)}
            className="font-display font-semibold text-xl mb-6 text-[oklch(0.97_0.008_80)]"
          >
            How this works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Trash2 size={20} aria-hidden />,
                title: "Log 10 seconds of waste each night",
                body: "One entry per item: category, quantity, cost, and why it got tossed. Done in the time it takes to walk to the dumpster.",
                delay: 0.48,
              },
              {
                icon: <Zap size={20} aria-hidden />,
                title: "AI finds the patterns you miss",
                body: "Claude spots that your salmon over-order happens every Friday, that prep errors spike on Mondays, and that your dairy spoilage outpaces every other category.",
                delay: 0.51,
              },
              {
                icon: <TrendingDown size={20} aria-hidden />,
                title: "Monday morning: the savings list",
                body: "Three specific actions, ranked by dollar impact. Not 'reduce waste' — 'cut salmon batch from 3lb to 1.5lb on Fridays, saves ~$120/mo.'",
                delay: 0.54,
              },
            ].map(({ icon, title, body, delay }) => (
              <motion.div key={title} {...fadeIn(delay)} className={cardCls}>
                <div className="w-9 h-9 rounded-xl bg-[oklch(0.74_0.15_55/15%)] border border-[oklch(0.74_0.15_55/25%)] flex items-center justify-center text-[oklch(0.74_0.15_55)] mb-3">
                  {icon}
                </div>
                <p className="font-display font-semibold text-sm text-[oklch(0.97_0.008_80)] mb-1.5">{title}</p>
                <p className="text-[oklch(0.65_0.005_260)] text-xs leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
