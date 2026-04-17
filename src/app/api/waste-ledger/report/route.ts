import { NextRequest, NextResponse } from 'next/server'
import { ask, ClaudeConfigError, ClaudeAPIError, ClaudeTimeoutError } from '@/lib/ai'

interface Entry {
  id: string
  date: string
  item: string
  category: string
  quantity: number
  unit: string
  cost: number
  reason: string
  notes?: string
}

interface CategoryTotal {
  category: string
  total: number
  count: number
}

interface ReasonBreakdown {
  reason: string
  count: number
  total: number
}

function aggregateEntries(entries: Entry[]) {
  const byCategory: Record<string, CategoryTotal> = {}
  const byReason: Record<string, ReasonBreakdown> = {}
  const byDay: Record<string, number> = {}
  const byItem: Record<string, { total: number; count: number; reasons: Record<string, number> }> = {}

  let grandTotal = 0

  for (const e of entries) {
    grandTotal += e.cost

    // Category
    if (!byCategory[e.category]) byCategory[e.category] = { category: e.category, total: 0, count: 0 }
    byCategory[e.category].total += e.cost
    byCategory[e.category].count += 1

    // Reason
    if (!byReason[e.reason]) byReason[e.reason] = { reason: e.reason, count: 0, total: 0 }
    byReason[e.reason].count += 1
    byReason[e.reason].total += e.cost

    // Day of week
    const dow = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' })
    byDay[dow] = (byDay[dow] ?? 0) + e.cost

    // Item
    if (!byItem[e.item]) byItem[e.item] = { total: 0, count: 0, reasons: {} }
    byItem[e.item].total += e.cost
    byItem[e.item].count += 1
    byItem[e.item].reasons[e.reason] = (byItem[e.item].reasons[e.reason] ?? 0) + 1
  }

  const topCategories = Object.values(byCategory).sort((a, b) => b.total - a.total).slice(0, 5)
  const topItems = Object.entries(byItem).sort((a, b) => b[1].total - a[1].total).slice(0, 5)
  const worstDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]
  const topReason = Object.values(byReason).sort((a, b) => b.total - a.total)[0]

  return { grandTotal, topCategories, topItems, worstDay, topReason, byReason }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { entries: Entry[] }
    const { entries } = body

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'No entries provided' }, { status: 400 })
    }

    const agg = aggregateEntries(entries)

    const dataBlock = `
WASTE SUMMARY (${entries.length} entries):
Total waste cost: $${agg.grandTotal.toFixed(2)}

TOP CATEGORIES:
${agg.topCategories.map(c => `- ${c.category}: $${c.total.toFixed(2)} (${c.count} entries)`).join('\n')}

TOP WASTED ITEMS:
${agg.topItems.map(([name, d]) => `- ${name}: $${d.total.toFixed(2)} (${d.count}x), top reason: ${Object.entries(d.reasons).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? 'unknown'}`).join('\n')}

WASTE BY REASON:
${Object.values(agg.byReason).sort((a,b)=>b.total-a.total).map(r => `- ${r.reason}: $${r.total.toFixed(2)} (${r.count} entries)`).join('\n')}
${agg.worstDay ? `\nWORST DAY: ${agg.worstDay[0]} ($${agg.worstDay[1].toFixed(2)} lost)` : ''}
`.trim()

    const system = `You are a restaurant operations consultant who helps owners cut food waste and save money. You give concrete, specific, actionable advice — not generic tips. When you say "reduce batch size," you name the item, the current assumed batch, and the target batch. When you cite a savings estimate, do the math from the data given.`

    const prompt = `${dataBlock}

Based on this week's waste data, produce a report with exactly this structure (use markdown):

## Top 3 Insights

For each insight:
**Insight [N]: [One sharp sentence naming the specific problem]**
Action: [One specific action — name the item, quantity, or process change]
Estimated savings: $[X]/month if fixed (show your math briefly)

## Quick Win

One thing they can do TODAY that takes under 5 minutes.

Keep the whole response under 350 words. Be direct. No filler.`

    const markdown = await ask(prompt, {
      model: 'sonnet',
      system,
      maxTokens: 800,
      cache: false,
    })

    return NextResponse.json({ ok: true, markdown })
  } catch (err) {
    if (err instanceof ClaudeConfigError) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 })
    }
    if (err instanceof ClaudeTimeoutError) {
      return NextResponse.json({ error: 'AI request timed out. Please try again.' }, { status: 504 })
    }
    if (err instanceof ClaudeAPIError) {
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 502 })
    }
    console.error('[waste-ledger/report]', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
