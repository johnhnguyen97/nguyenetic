"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clipboard, ClipboardCheck, RefreshCw, ChevronDown } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type FormatKey = "blog" | "tweet" | "linkedin" | "newsletter" | "youtube"

// ─── Mock content library ─────────────────────────────────────────────────────

function hashTopic(topic: string): number {
  return Array.from(topic).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
}

function pickFrom<T>(arr: T[], hash: number): T {
  return arr[Math.abs(hash) % arr.length]
}

const BLOG_TEMPLATES = [
  (t: string) => `# The Complete Guide to ${t}

## 1. Understanding ${t} Fundamentals
- What makes ${t} different from traditional approaches
- The three pillars every practitioner must know
- Common misconceptions that hold teams back

## 2. Building Your ${t} Strategy
- Defining clear objectives and success metrics
- Mapping stakeholders and their expectations
- Creating a phased rollout plan

### 2.1 Quick Wins
- Starting small and iterating fast
- Measuring what matters from day one
- Celebrating progress to build momentum

## 3. Advanced Techniques for ${t}
- Scaling beyond the initial implementation
- Integrating with existing workflows
- Automation and tooling recommendations

## 4. Common Pitfalls to Avoid
- The "big bang" launch mistake
- Ignoring the human side of ${t}
- Under-investing in documentation

## 5. Measuring Success
- Key performance indicators for ${t}
- Building dashboards that tell a story
- Iterating based on real data`,

  (t: string) => `# Why ${t} Is Changing Everything in 2026

## Introduction: The ${t} Revolution
- Market shifts driving urgency
- Early adopters vs. late movers
- What the data actually says

## Part 1: The Business Case for ${t}
- ROI benchmarks from 50+ companies
- Time-to-value expectations
- Risk mitigation strategies

### Calculating Your Potential Return
- Cost reduction scenarios
- Revenue acceleration paths
- Productivity multipliers

## Part 2: The Technical Foundation
- Core infrastructure requirements for ${t}
- Integration patterns that work at scale
- Security and compliance considerations

## Part 3: Team & Culture
- Hiring for ${t} expertise
- Upskilling your existing team
- Leadership alignment strategies

## Part 4: A 90-Day Implementation Roadmap
- Weeks 1–2: Discovery and scoping
- Weeks 3–6: Pilot program
- Weeks 7–12: Scale and optimize

## Conclusion: Your Next Steps`,
]

const TWEET_TEMPLATES = [
  (t: string) => [
    `${t} is one of the most misunderstood topics in the industry right now.\n\nHere's what actually works (a thread):`,
    `First, let's kill the biggest myth: you don't need a massive budget to get started with ${t}.\n\nIn fact, the best results I've seen came from constraints.`,
    `The companies winning with ${t} share 3 traits:\n\n→ They start with a clear problem\n→ They measure outcomes, not activity\n→ They iterate weekly, not quarterly`,
    `Biggest mistake I see? Treating ${t} as a one-time project.\n\nIt's a capability. Build the muscle, not just the output.`,
    `The ROI question everyone asks: "When will we see results?"\n\nHonest answer for ${t}: meaningful signals in 30 days, real traction in 90.`,
    `A framework I use for ${t} decisions:\n\n1. What does success look like in 6 months?\n2. What's the smallest version we could ship?\n3. Who owns accountability for the outcome?`,
    `Tools matter less than people think for ${t}.\n\nA great team with average tools beats an average team with great tools every time.`,
    `The best resource on ${t} that nobody talks about: your own past experiments.\n\nDocument everything. Your future self will thank you.`,
  ],
  (t: string) => [
    `After studying 100+ teams using ${t}, here's what separates the 10x results from the average ones:`,
    `Insight #1: The top teams obsess over ${t} inputs, not outputs.\n\nYou can't control results. You can control the system that produces them.`,
    `Insight #2: Speed wins in ${t}.\n\nNot speed of execution — speed of learning. Ship, measure, adapt.`,
    `Insight #3: Documentation is the secret weapon of ${t}.\n\nThe teams with runbooks outperform those who rely on memory by 3x.`,
    `Insight #4: ${t} has a compounding effect.\n\nEvery small improvement stacks. Month 12 looks nothing like Month 1.`,
    `Insight #5: The biggest blocker to ${t} success isn't technical.\n\nIt's organizational. Get leadership aligned first.`,
    `Insight #6: Simplicity scales. Complexity doesn't.\n\nThe best ${t} implementations I've seen fit on a single page.`,
    `TL;DR for ${t}:\n\n→ Measure inputs\n→ Ship fast\n→ Document everything\n→ Align leadership\n→ Keep it simple\n\nWhat would you add?`,
  ],
]

const LINKEDIN_TEMPLATES = [
  (t: string) => `3 years ago, I knew nothing about ${t}.

Today, it's one of the most valuable skills I have.

Here's what the journey taught me:

**The first year is humbling.**
You think you understand ${t} until you try to implement it. Then reality hits. That friction is where the real learning happens.

**The second year is about systems.**
I stopped chasing tactics and started building repeatable processes. Game-changer.

**The third year is about teaching.**
Explaining ${t} to others revealed gaps in my own understanding. If you can't simplify it, you don't know it well enough.

The one thing I'd tell someone starting with ${t} today:

Don't wait until you feel ready. Ship something imperfect. Learn faster than anyone else.

What's your experience been with ${t}? Drop a comment — I read every one.

#${t.replace(/\s+/g, "")} #Growth #Strategy`,

  (t: string) => `Hot take: Most companies are doing ${t} backwards.

They invest in tools before strategy. They hire specialists before developing internal capability. They optimize for vanity metrics before proving real value.

Here's the framework that actually works:

→ **Define the problem first.** What specific outcome does ${t} enable?
→ **Start embarrassingly small.** A pilot you can learn from beats a perfect plan every time.
→ **Build measurement into the design.** Not as an afterthought.
→ **Share learnings publicly.** Transparency accelerates improvement.

The companies I've seen crush ${t}? They're not the ones with the biggest budgets.

They're the ones with the clearest thinking.

What's your approach to ${t}? I'd love to hear what's working.`,
]

const NEWSLETTER_TEMPLATES = [
  (t: string) => `**Subject: The ${t} playbook — everything I've learned this quarter**

---

Hey there,

If you've been following my work, you know I've been heads-down on ${t} for the past 90 days. Today, I'm sharing everything.

**What I got wrong at first**

I assumed ${t} was primarily a technical challenge. It's not. The hardest part is human: getting buy-in, changing habits, and sustaining momentum when the initial excitement fades.

**What actually moved the needle**

Three things made the biggest difference:

1. **Weekly reviews.** Not monthly. Weekly. The feedback loop compression alone is worth it.
2. **A single owner.** Not a committee. One person with clear accountability and authority.
3. **Public commitments.** We shared our ${t} goals with stakeholders. That accountability changed everything.

**The tool that surprised me**

I won't name names, but the simplest solution — the one I almost dismissed — ended up being the most effective for ${t}. Never underestimate boring.

**What's next**

Next quarter, I'm doubling down on the feedback loop work. I'll share what I find.

Until then,
[Your Name]

*P.S. — Hit reply and tell me where you are in your ${t} journey. I read every response.*`,
]

const YOUTUBE_TEMPLATES = [
  (t: string) => `[0:00] HOOK
"I spent 90 days obsessing over ${t} so you don't have to. Here's everything I wish someone told me from day one."

[0:15] INTRO & CREDIBILITY
Introduce yourself, why you're qualified to talk about ${t}, quick preview of what's covered.

[1:00] THE PROBLEM
Most people approach ${t} wrong. They [common mistake]. The result? Wasted time and frustration.

[2:30] THE FRAMEWORK
Introduce the 3-part framework for ${t}:
• Part 1: Foundation — what you need before you start
• Part 2: Execution — the daily/weekly system
• Part 3: Optimization — how to 10x your results

[5:00] DEEP DIVE — PART 1: FOUNDATION
Walk through the foundation piece. Show examples, use screen share or visuals.

[9:30] DEEP DIVE — PART 2: EXECUTION
Live walkthrough of the execution system for ${t}. Practical, specific, actionable.

[14:00] DEEP DIVE — PART 3: OPTIMIZATION
Advanced tips for people who have the basics down. Results from real implementations.

[18:00] COMMON MISTAKES
The top 3 mistakes with ${t} (and exactly how to avoid them).

[20:30] RECAP & CALL TO ACTION
Summarize the framework. Ask viewers to comment their biggest insight.
Direct to a free resource/newsletter for deeper ${t} content.

[22:00] OUTRO
Like, subscribe, next video preview.`,
]

function generateContent(topic: string, format: FormatKey): string {
  const hash = hashTopic(topic.toLowerCase().trim())
  const t = topic.trim() || "this topic"

  switch (format) {
    case "blog":
      return pickFrom(BLOG_TEMPLATES, hash)(t)
    case "tweet": {
      const thread = pickFrom(TWEET_TEMPLATES, hash)(t)
      return thread.map((tweet, i) => `${i + 1}/${thread.length}  ${tweet}`).join("\n\n---\n\n")
    }
    case "linkedin":
      return pickFrom(LINKEDIN_TEMPLATES, hash)(t)
    case "newsletter":
      return pickFrom(NEWSLETTER_TEMPLATES, hash)(t)
    case "youtube":
      return pickFrom(YOUTUBE_TEMPLATES, hash)(t)
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200))
}

// ─── Format renderers ─────────────────────────────────────────────────────────

function BlogRenderer({ content }: { content: string }) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  const toggleSection = (i: number) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  // Parse into H1/H2/H3 structure
  const lines = content.split("\n")
  const sections: { level: number; text: string; index: number; children: string[] }[] = []
  let current: (typeof sections)[0] | null = null

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      sections.push({ level: 1, text: line.slice(2), index: sections.length, children: [] })
      current = sections[sections.length - 1]
    } else if (line.startsWith("## ")) {
      sections.push({ level: 2, text: line.slice(3), index: sections.length, children: [] })
      current = sections[sections.length - 1]
    } else if (line.startsWith("### ")) {
      if (current && current.level === 2) {
        current.children.push(`__h3__${line.slice(4)}`)
      }
    } else if (line.startsWith("- ")) {
      if (current) current.children.push(line.slice(2))
    }
  })

  return (
    <div className="space-y-2">
      {sections.map((s) => (
        <div key={s.index}>
          {s.level === 1 ? (
            <h3 className="text-lg font-display text-paper font-semibold mb-3">{s.text}</h3>
          ) : (
            <div className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(s.index)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-paper/80 hover:text-paper hover:bg-warm/5 transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
              >
                <span className="text-left font-medium">{s.text}</span>
                <motion.div
                  animate={{ rotate: collapsed.has(s.index) ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} className="text-warm/60 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {!collapsed.has(s.index) && s.children.length > 0 && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="pl-4 pb-2 space-y-1 overflow-hidden"
                  >
                    {s.children.map((child, ci) =>
                      child.startsWith("__h3__") ? (
                        <li key={ci} className="text-xs font-medium text-warm/70 pt-1">
                          {child.slice(6)}
                        </li>
                      ) : (
                        <li key={ci} className="text-xs text-paper/50 flex gap-2">
                          <span className="text-warm/40 mt-0.5">•</span>
                          {child}
                        </li>
                      )
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TweetRenderer({ content }: { content: string }) {
  const tweets = content.split("\n\n---\n\n")
  return (
    <div className="space-y-3 relative">
      {/* Thread line */}
      <div className="absolute left-[22px] top-12 bottom-12 w-0.5 bg-warm/10 rounded-full" />
      {tweets.map((tweet, i) => {
        const [numberLine, ...rest] = tweet.split("\n")
        const tweetText = rest.join("\n").trim() || numberLine
        const label = numberLine.match(/^\d+\/\d+/) ? numberLine.split("  ")[0] : `${i + 1}/${tweets.length}`
        return (
          <div key={i} className="flex gap-3 relative z-10">
            <div className="w-9 h-9 rounded-full bg-warm/20 border border-warm/30 flex items-center justify-center flex-shrink-0 text-xs font-medium text-warm">
              Y
            </div>
            <div className="flex-1 bg-ink/60 border border-warm/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-paper/80">@you</span>
                <span className="text-xs text-paper/30">· Just now</span>
                <span className="ml-auto text-xs text-warm/50">{label}</span>
              </div>
              <p className="text-sm text-paper/80 whitespace-pre-wrap leading-relaxed">{tweetText}</p>
              <div className="flex gap-5 mt-3 text-paper/20 text-xs">
                <span>💬 4</span>
                <span>🔁 12</span>
                <span>❤️ 47</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LinkedInRenderer({ content }: { content: string }) {
  return (
    <div className="bg-ink/60 border border-warm/10 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-warm/20 border border-warm/30 flex items-center justify-center text-sm font-medium text-warm">
          JN
        </div>
        <div>
          <p className="text-sm font-medium text-paper">John Nguyen</p>
          <p className="text-xs text-paper/40">Founder · Nguyenetic</p>
        </div>
      </div>
      <p className="text-sm text-paper/80 whitespace-pre-wrap leading-relaxed">{content}</p>
      <div className="flex gap-5 mt-4 pt-3 border-t border-warm/10 text-paper/30 text-xs">
        <span>👍 128</span>
        <span>💬 34 comments</span>
        <span>🔁 Share</span>
      </div>
    </div>
  )
}

function NewsletterRenderer({ content }: { content: string }) {
  const lines = content.split("\n")
  return (
    <div className="bg-ink/60 border border-warm/10 rounded-xl overflow-hidden">
      <div className="bg-warm/10 border-b border-warm/10 px-5 py-3">
        {lines[0].startsWith("**Subject:") && (
          <p className="text-xs font-medium text-warm">
            {lines[0].replace(/\*\*/g, "")}
          </p>
        )}
      </div>
      <div className="p-5">
        <p className="text-sm text-paper/80 whitespace-pre-wrap leading-relaxed">
          {lines.slice(2).join("\n")}
        </p>
      </div>
    </div>
  )
}

function YouTubeRenderer({ content }: { content: string }) {
  const segments = content.split("\n").reduce<{ timestamp: string; title: string; body: string }[]>(
    (acc, line) => {
      const match = line.match(/^\[(\d+:\d+)\]\s+(.+)/)
      if (match) {
        acc.push({ timestamp: match[1], title: match[2], body: "" })
      } else if (acc.length > 0 && line.trim()) {
        acc[acc.length - 1].body += (acc[acc.length - 1].body ? "\n" : "") + line.trim()
      }
      return acc
    },
    []
  )

  return (
    <div className="space-y-2">
      {segments.map((seg, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span className="text-xs font-mono text-warm/60 bg-warm/10 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
            {seg.timestamp}
          </span>
          <div>
            <p className="text-sm font-medium text-paper/90">{seg.title}</p>
            {seg.body && (
              <p className="text-xs text-paper/45 mt-0.5 leading-relaxed">{seg.body}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const FORMATS: { key: FormatKey; label: string }[] = [
  { key: "blog", label: "Blog Outline" },
  { key: "tweet", label: "Tweet Thread" },
  { key: "linkedin", label: "LinkedIn Post" },
  { key: "newsletter", label: "Newsletter" },
  { key: "youtube", label: "YouTube Script" },
]

export function ContentGenerator() {
  const [topic, setTopic] = useState("")
  const [format, setFormat] = useState<FormatKey>("blog")
  const [displayedContent, setDisplayedContent] = useState("")
  const [fullContent, setFullContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [topicError, setTopicError] = useState(false)
  const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      clearTimeout(streamRef.current)
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const startStream = useCallback(
    (content: string) => {
      stopStream()
      setDisplayedContent("")
      indexRef.current = 0
      setIsStreaming(true)

      const stream = () => {
        if (indexRef.current >= content.length) {
          setIsStreaming(false)
          return
        }
        // Stream 1-3 chars per tick for realism
        const chunkSize = Math.floor(Math.random() * 3) + 1
        indexRef.current = Math.min(indexRef.current + chunkSize, content.length)
        setDisplayedContent(content.slice(0, indexRef.current))
        const delay = 8 + Math.random() * 7
        streamRef.current = setTimeout(stream, delay)
      }
      stream()
    },
    [stopStream]
  )

  const generate = useCallback(() => {
    const trimmed = topic.trim()
    if (!trimmed) {
      setTopicError(true)
      return
    }
    setTopicError(false)
    const content = generateContent(trimmed, format)
    setFullContent(content)
    startStream(content)
  }, [topic, format, startStream])

  const regenerate = useCallback(() => {
    if (!fullContent) return
    startStream(fullContent)
  }, [fullContent, startStream])

  // Re-generate when switching format after a generation
  const handleFormatChange = useCallback(
    (f: FormatKey) => {
      setFormat(f)
      if (topic.trim() && fullContent) {
        const trimmed = topic.trim()
        const content = generateContent(trimmed, f)
        setFullContent(content)
        startStream(content)
      }
    },
    [topic, fullContent, startStream]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        generate()
      }
    },
    [generate]
  )

  const handleCopy = useCallback(() => {
    const plain = fullContent
    navigator.clipboard.writeText(plain).then(() => {
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 2000)
    })
  }, [fullContent])

  useEffect(() => () => stopStream(), [stopStream])

  const wordCount = displayedContent ? countWords(displayedContent) : 0
  const readMins = readingMinutes(wordCount)
  const hasContent = displayedContent.length > 0

  return (
    <div className="flex flex-col gap-5 bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl p-6 hover:border-warm/60 transition-colors duration-300">
      {/* Input bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <textarea
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value)
              if (topicError && e.target.value.trim()) setTopicError(false)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter a topic…"
            rows={1}
            aria-label="Content topic"
            aria-describedby={topicError ? "topic-error" : undefined}
            aria-invalid={topicError}
            className={`w-full resize-none rounded-xl bg-ink/60 border px-4 py-3 text-paper placeholder:text-paper/30 text-sm leading-relaxed focus:outline-none transition-all duration-200 ${
              topicError
                ? "border-red-500/60 focus:border-red-500"
                : "border-warm/20 focus:border-warm"
            }`}
            style={{ boxShadow: topicError ? undefined : "0 0 0 0 transparent" }}
          />
          <AnimatePresence>
            {topicError && (
              <motion.p
                id="topic-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute -bottom-5 left-0 text-xs text-red-400"
                role="alert"
              >
                Add a topic to generate content
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={generate}
          disabled={isStreaming}
          className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#ffb68d] to-warm text-ink rounded-xl font-medium px-6 py-3 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm whitespace-nowrap"
        >
          {isStreaming ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                ✦
              </motion.span>
              Generating…
            </>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      {/* Format tabs */}
      <div
        role="tablist"
        aria-label="Output format"
        className="flex flex-wrap gap-1 border-b border-warm/10 pb-1 mt-1"
      >
        {FORMATS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={format === f.key}
            onClick={() => handleFormatChange(f.key)}
            className={`relative px-3 py-1.5 text-xs font-medium rounded-t transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm ${
              format === f.key ? "text-warm" : "text-paper/50 hover:text-paper/80"
            }`}
          >
            {f.label}
            {format === f.key && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm rounded-full"
                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Output area */}
      <div
        className="relative min-h-[220px]"
        tabIndex={hasContent ? 0 : undefined}
        aria-label="Generated content"
      >
        {!hasContent ? (
          <div className="flex items-center justify-center h-full min-h-[160px]">
            <p className="text-paper/25 text-sm">Your content will appear here</p>
          </div>
        ) : (
          <>
            {/* Copy button */}
            <AnimatePresence>
              {!isStreaming && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCopy}
                  aria-label="Copy to clipboard"
                  className="absolute top-0 right-0 z-10 w-9 h-9 rounded-full bg-warm/20 border border-warm/30 flex items-center justify-center text-warm hover:bg-warm hover:text-ink transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm"
                >
                  {hasCopied ? <ClipboardCheck size={15} /> : <Clipboard size={15} />}
                </motion.button>
              )}
            </AnimatePresence>

            <motion.div
              key={format + fullContent.slice(0, 20)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pr-10"
            >
              {format === "blog" && <BlogRenderer content={displayedContent} />}
              {format === "tweet" && <TweetRenderer content={displayedContent} />}
              {format === "linkedin" && <LinkedInRenderer content={displayedContent} />}
              {format === "newsletter" && <NewsletterRenderer content={displayedContent} />}
              {format === "youtube" && <YouTubeRenderer content={displayedContent} />}
            </motion.div>

            {/* Blinking cursor while streaming */}
            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-3.5 bg-warm ml-0.5 align-middle"
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {hasContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between pt-2 border-t border-warm/10"
        >
          <span className="text-xs text-paper/30">
            {wordCount} words · {readMins} min read
          </span>
          <button
            onClick={regenerate}
            disabled={isStreaming}
            className="flex items-center gap-1.5 text-xs text-warm/60 hover:text-warm disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm rounded px-1"
          >
            <RefreshCw size={12} />
            Regenerate
          </button>
        </motion.div>
      )}
    </div>
  )
}
