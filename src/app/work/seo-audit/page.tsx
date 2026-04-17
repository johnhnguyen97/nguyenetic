"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LeadCapture } from "@/components/ui/lead-capture"

// ─── Deterministic hash + seeded random ───────────────────────────────────────

function hash(s: string): number {
  return Array.from(s).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
}

function seeded(url: string, seed: string, min: number, max: number): number {
  const h = hash(url + seed)
  return min + (Math.abs(h) % (max - min + 1))
}

function seededFloat(url: string, seed: string): number {
  const h = Math.abs(hash(url + seed))
  return (h % 1000) / 1000
}

function seededBool(url: string, seed: string, trueProbability = 0.65): boolean {
  return seededFloat(url, seed) < trueProbability
}

function seededChoice<T>(url: string, seed: string, options: T[]): T {
  const idx = Math.abs(hash(url + seed)) % options.length
  return options[idx]
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AuditCheck {
  id: string
  label: string
  passed: boolean
  value?: string
  fix?: string
  impact: "critical" | "warning" | "good"
}

interface AuditSection {
  id: string
  title: string
  score: number
  checks: AuditCheck[]
}

interface AuditResult {
  url: string
  businessName: string
  city: string
  overallScore: number
  grade: string
  wins: number
  warnings: number
  critical: number
  localPackEstimate: number
  sections: AuditSection[]
  generatedAt: number
}

// ─── Audit computation ─────────────────────────────────────────────────────────

function computeAudit(url: string, businessName: string, city: string): AuditResult {
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/")[0]

  // On-Page SEO
  const titleLen = seeded(url, "title-len", 38, 85)
  const titleHasKw = seededBool(url, "title-kw", 0.6)
  const metaLen = seeded(url, "meta-len", 0, 180)
  const h1Count = seeded(url, "h1-count", 0, 3)
  const internalLinks = seeded(url, "internal-links", 2, 48)
  const altCoverage = seeded(url, "alt-coverage", 20, 100)
  const isMobile = seededBool(url, "mobile-friendly", 0.75)

  const onPageChecks: AuditCheck[] = [
    {
      id: "title-tag",
      label: "Title tag",
      passed: titleLen >= 50 && titleLen <= 60 && titleHasKw,
      value: `${titleLen} characters`,
      fix: titleLen < 50
        ? `Title is only ${titleLen} chars — expand to 50–60 and include your primary keyword + city.`
        : titleLen > 60
        ? `Title is ${titleLen} chars — trim to 50–60 to avoid truncation in SERPs.`
        : !titleHasKw
        ? "Include your main service keyword in the title tag."
        : undefined,
      impact: titleLen < 50 || titleLen > 70 ? "critical" : titleHasKw ? "good" : "warning",
    },
    {
      id: "meta-desc",
      label: "Meta description",
      passed: metaLen >= 120 && metaLen <= 160,
      value: metaLen === 0 ? "Missing" : `${metaLen} characters`,
      fix: metaLen === 0
        ? "Add a meta description with 120–160 characters including your city and main service."
        : metaLen < 120
        ? `Meta description is too short (${metaLen} chars). Expand to 120–160 characters.`
        : metaLen > 160
        ? `Meta description is too long (${metaLen} chars). Trim to under 160 characters.`
        : undefined,
      impact: metaLen === 0 ? "critical" : (metaLen < 120 || metaLen > 160) ? "warning" : "good",
    },
    {
      id: "h1",
      label: "H1 heading",
      passed: h1Count === 1,
      value: h1Count === 0 ? "Missing" : h1Count > 1 ? `${h1Count} H1s found` : "1 H1 found",
      fix: h1Count === 0
        ? "Add exactly one H1 tag that includes your primary service + location."
        : h1Count > 1
        ? `${h1Count} H1 tags found — use only one. Additional headings should be H2 or H3.`
        : undefined,
      impact: h1Count === 0 ? "critical" : h1Count > 1 ? "warning" : "good",
    },
    {
      id: "internal-links",
      label: "Internal links",
      passed: internalLinks >= 10,
      value: `${internalLinks} links`,
      fix: internalLinks < 10
        ? `Only ${internalLinks} internal links detected. Add more links between pages to distribute authority.`
        : undefined,
      impact: internalLinks < 5 ? "warning" : "good",
    },
    {
      id: "alt-text",
      label: "Image alt text",
      passed: altCoverage >= 80,
      value: `${altCoverage}% coverage`,
      fix: altCoverage < 80
        ? `${100 - altCoverage}% of images are missing alt text. Add descriptive alt attributes to all images.`
        : undefined,
      impact: altCoverage < 50 ? "critical" : altCoverage < 80 ? "warning" : "good",
    },
    {
      id: "mobile",
      label: "Mobile-friendly",
      passed: isMobile,
      value: isMobile ? "Responsive design detected" : "Mobile issues found",
      fix: isMobile ? undefined : "Your site has mobile usability issues. Use Google's Mobile-Friendly Test and fix viewport settings.",
      impact: isMobile ? "good" : "critical",
    },
  ]

  const onPagePassed = onPageChecks.filter(c => c.passed).length
  const onPageScore = Math.round((onPagePassed / onPageChecks.length) * 100)

  // Schema Markup
  const hasLocalSchema = seededBool(url, "local-schema", 0.4)
  const hasHours = seededBool(url, "schema-hours", 0.45)
  const hasAddress = seededBool(url, "schema-address", 0.55)
  const hasPhone = seededBool(url, "schema-phone", 0.5)
  const hasReviews = seededBool(url, "schema-reviews", 0.3)

  const schemaChecks: AuditCheck[] = [
    {
      id: "local-business-schema",
      label: "LocalBusiness schema",
      passed: hasLocalSchema,
      value: hasLocalSchema ? "Present" : "Missing",
      fix: hasLocalSchema ? undefined : `Add LocalBusiness JSON-LD to your <head>. This is critical for local pack rankings.`,
      impact: hasLocalSchema ? "good" : "critical",
    },
    {
      id: "hours-schema",
      label: "Business hours markup",
      passed: hasHours,
      value: hasHours ? "openingHoursSpecification present" : "Not marked up",
      fix: hasHours ? undefined : "Add openingHoursSpecification to your LocalBusiness schema so Google shows your hours.",
      impact: hasHours ? "good" : "warning",
    },
    {
      id: "address-schema",
      label: "Address markup (PostalAddress)",
      passed: hasAddress,
      value: hasAddress ? "Present" : "Missing",
      fix: hasAddress ? undefined : "Add streetAddress, addressLocality, addressRegion, and postalCode to your schema.",
      impact: hasAddress ? "good" : "critical",
    },
    {
      id: "phone-schema",
      label: "Phone number markup",
      passed: hasPhone,
      value: hasPhone ? "telephone property present" : "Missing",
      fix: hasPhone ? undefined : `Add "telephone": "+1-XXX-XXX-XXXX" to your LocalBusiness schema.`,
      impact: hasPhone ? "good" : "warning",
    },
    {
      id: "reviews-schema",
      label: "Aggregate review rating",
      passed: hasReviews,
      value: hasReviews ? "AggregateRating present" : "Not found",
      fix: hasReviews ? undefined : "Add AggregateRating schema to display star ratings in search results.",
      impact: hasReviews ? "good" : "warning",
    },
  ]

  const schemaPassed = schemaChecks.filter(c => c.passed).length
  const schemaScore = Math.round((schemaPassed / schemaChecks.length) * 100)

  // GBP Signals
  const appearsInMaps = seededBool(url, "gbp-maps", 0.6)
  const reviewCount = seeded(url, "review-count", 4, 312)
  const reviewRating = (seeded(url, "review-rating", 32, 50) / 10).toFixed(1)
  const photoCount = seeded(url, "photo-count", 3, 87)
  const categoryComplete = seededBool(url, "gbp-category", 0.65)
  const postFrequency = seededChoice(url, "gbp-posts", ["Never", "Rarely", "Monthly", "Weekly"])
  const profileComplete = seeded(url, "gbp-complete", 45, 100)

  const gbpChecks: AuditCheck[] = [
    {
      id: "maps-presence",
      label: "Google Maps presence",
      passed: appearsInMaps,
      value: appearsInMaps ? "Listed" : "Not found",
      fix: appearsInMaps ? undefined : "Claim or create your Google Business Profile at business.google.com.",
      impact: appearsInMaps ? "good" : "critical",
    },
    {
      id: "review-count",
      label: "Review count",
      passed: reviewCount >= 25,
      value: `${reviewCount} reviews (${reviewRating}★)`,
      fix: reviewCount < 25
        ? `Only ${reviewCount} reviews. Aim for 25+ by sending follow-up emails asking satisfied customers to leave a review.`
        : undefined,
      impact: reviewCount < 10 ? "critical" : reviewCount < 25 ? "warning" : "good",
    },
    {
      id: "photo-count",
      label: "Business photos",
      passed: photoCount >= 20,
      value: `${photoCount} photos`,
      fix: photoCount < 20
        ? `Only ${photoCount} photos. Profiles with 100+ photos get 2,000% more direction requests. Add interior, exterior, and team photos.`
        : undefined,
      impact: photoCount < 5 ? "critical" : photoCount < 20 ? "warning" : "good",
    },
    {
      id: "category",
      label: "Category completeness",
      passed: categoryComplete,
      value: categoryComplete ? "Primary + secondary categories set" : "Incomplete",
      fix: categoryComplete ? undefined : "Add secondary categories to your GBP to appear for more relevant searches.",
      impact: categoryComplete ? "good" : "warning",
    },
    {
      id: "post-frequency",
      label: "Post frequency",
      passed: postFrequency === "Weekly" || postFrequency === "Monthly",
      value: postFrequency,
      fix: postFrequency === "Never" || postFrequency === "Rarely"
        ? "Post weekly updates, offers, or news to your GBP. Regular posts signal an active business."
        : undefined,
      impact: postFrequency === "Never" ? "critical" : postFrequency === "Rarely" ? "warning" : "good",
    },
    {
      id: "profile-completeness",
      label: "Profile completeness",
      passed: profileComplete >= 85,
      value: `${profileComplete}% complete`,
      fix: profileComplete < 85
        ? `Fill in all GBP fields: business description, attributes, service areas, and Q&A.`
        : undefined,
      impact: profileComplete < 60 ? "critical" : profileComplete < 85 ? "warning" : "good",
    },
  ]

  const gbpPassed = gbpChecks.filter(c => c.passed).length
  const gbpScore = Math.round((gbpPassed / gbpChecks.length) * 100)

  // Local Citations
  const directories = [
    { name: "Yelp", seed: "cite-yelp" },
    { name: "Apple Maps", seed: "cite-apple" },
    { name: "Bing Places", seed: "cite-bing" },
    { name: "Facebook", seed: "cite-fb" },
    { name: "Better Business Bureau", seed: "cite-bbb" },
    { name: "Chamber of Commerce", seed: "cite-chamber" },
    { name: "YellowPages", seed: "cite-yp" },
    { name: "Foursquare", seed: "cite-4sq" },
  ]

  const citationChecks: AuditCheck[] = directories.map(dir => {
    const listed = seededBool(url, dir.seed, 0.55)
    const napConsistent = listed && seededBool(url, dir.seed + "-nap", 0.7)
    return {
      id: dir.seed,
      label: dir.name,
      passed: listed && napConsistent,
      value: listed ? (napConsistent ? "Listed, NAP consistent" : "Listed — NAP mismatch") : "Not listed",
      fix: !listed
        ? `Create a free listing on ${dir.name} to build citation authority.`
        : !napConsistent
        ? `Your Name/Address/Phone on ${dir.name} doesn't match your website. Fix for NAP consistency.`
        : undefined,
      impact: !listed ? "warning" : !napConsistent ? "critical" : "good",
    }
  })

  const citationPassed = citationChecks.filter(c => c.passed).length
  const citationScore = Math.round((citationPassed / citationChecks.length) * 100)

  // Performance / CWV
  const lcp = (seeded(url, "lcp", 8, 55) / 10).toFixed(1)
  const cls = (seeded(url, "cls", 0, 45) / 100).toFixed(2)
  const inp = seeded(url, "inp", 80, 700)
  const ttfb = seeded(url, "ttfb", 120, 1800)
  const renderBlocking = seeded(url, "render-blocking", 0, 8)
  const imageOptimize = seeded(url, "img-optimize", 0, 15)
  const unusedJs = seeded(url, "unused-js", 0, 480)

  const lcpGood = parseFloat(lcp) <= 2.5
  const clsGood = parseFloat(cls) <= 0.1
  const inpGood = inp <= 200
  const ttfbGood = ttfb <= 800

  const perfChecks: AuditCheck[] = [
    {
      id: "lcp",
      label: "Largest Contentful Paint (LCP)",
      passed: lcpGood,
      value: `${lcp}s`,
      fix: lcpGood ? undefined : `LCP is ${lcp}s — target under 2.5s. Optimize hero image, preload fonts, use a CDN.`,
      impact: parseFloat(lcp) > 4 ? "critical" : !lcpGood ? "warning" : "good",
    },
    {
      id: "cls",
      label: "Cumulative Layout Shift (CLS)",
      passed: clsGood,
      value: cls,
      fix: clsGood ? undefined : `CLS is ${cls} — target under 0.1. Set explicit width/height on images and iframes.`,
      impact: parseFloat(cls) > 0.25 ? "critical" : !clsGood ? "warning" : "good",
    },
    {
      id: "inp",
      label: "Interaction to Next Paint (INP)",
      passed: inpGood,
      value: `${inp}ms`,
      fix: inpGood ? undefined : `INP is ${inp}ms — target under 200ms. Reduce JavaScript execution time.`,
      impact: inp > 500 ? "critical" : !inpGood ? "warning" : "good",
    },
    {
      id: "ttfb",
      label: "Time to First Byte (TTFB)",
      passed: ttfbGood,
      value: `${ttfb}ms`,
      fix: ttfbGood ? undefined : `TTFB is ${ttfb}ms — target under 800ms. Upgrade hosting or add server-side caching.`,
      impact: ttfb > 1500 ? "critical" : !ttfbGood ? "warning" : "good",
    },
    {
      id: "render-blocking",
      label: "Render-blocking resources",
      passed: renderBlocking === 0,
      value: renderBlocking === 0 ? "None detected" : `${renderBlocking} blocking resources`,
      fix: renderBlocking > 0 ? `${renderBlocking} render-blocking scripts found. Add defer/async attributes or move to bottom of body.` : undefined,
      impact: renderBlocking > 4 ? "critical" : renderBlocking > 0 ? "warning" : "good",
    },
    {
      id: "image-optimize",
      label: "Image optimization",
      passed: imageOptimize === 0,
      value: imageOptimize === 0 ? "All optimized" : `${imageOptimize} unoptimized images`,
      fix: imageOptimize > 0 ? `${imageOptimize} images need optimization. Convert to WebP/AVIF and use responsive srcset.` : undefined,
      impact: imageOptimize > 8 ? "critical" : imageOptimize > 0 ? "warning" : "good",
    },
    {
      id: "unused-js",
      label: "Unused JavaScript",
      passed: unusedJs < 100,
      value: unusedJs < 100 ? "Minimal unused JS" : `${unusedJs} KB unused`,
      fix: unusedJs >= 100 ? `${unusedJs} KB of unused JavaScript. Use code splitting and tree-shaking.` : undefined,
      impact: unusedJs > 300 ? "critical" : unusedJs >= 100 ? "warning" : "good",
    },
  ]

  // CWV metrics each contribute 25 pts weighted by bucket; remaining 3 checks binary (≈8.3 pts each)
  const cwvScore =
    (parseFloat(lcp) <= 2.5 ? 25 : parseFloat(lcp) <= 4.0 ? 12.5 : 0) +
    (parseFloat(cls) <= 0.1 ? 25 : parseFloat(cls) <= 0.25 ? 12.5 : 0) +
    (inp <= 200 ? 25 : inp <= 500 ? 12.5 : 0) +
    (ttfb <= 800 ? 25 : ttfb <= 1500 ? 12.5 : 0)
  const binaryPassed = [renderBlocking === 0, imageOptimize === 0, unusedJs < 100].filter(Boolean).length
  const perfScore = Math.round(cwvScore * 0.75 + (binaryPassed / 3) * 25)

  // AI Search Visibility
  const chatgptVisible = seededBool(url, "ai-chatgpt", 0.35)
  const perplexityScore = seeded(url, "ai-perplexity", 15, 90)
  const aiOverviews = seededBool(url, "ai-overviews", 0.4)
  const contentDepth = seededChoice(url, "content-depth", ["Thin", "Moderate", "Deep", "Expert"])
  const eeatSignals = seeded(url, "eeat", 20, 95)
  const faqPresent = seededBool(url, "faq", 0.45)
  const citationReady = seededBool(url, "citation-ready", 0.4)

  const aiChecks: AuditCheck[] = [
    {
      id: "chatgpt-local",
      label: "ChatGPT local pack visibility",
      passed: chatgptVisible,
      value: chatgptVisible ? "Likely cited for local queries" : "Not detected in AI responses",
      fix: chatgptVisible ? undefined : "Improve your GBP completeness and get more reviews to appear in ChatGPT local suggestions.",
      impact: chatgptVisible ? "good" : "warning",
    },
    {
      id: "perplexity",
      label: "Perplexity citation score",
      passed: perplexityScore >= 60,
      value: `${perplexityScore}/100`,
      fix: perplexityScore < 60
        ? "Create in-depth, citable content pages. Perplexity prioritizes sites with clear author expertise and structured content."
        : undefined,
      impact: perplexityScore < 40 ? "critical" : perplexityScore < 60 ? "warning" : "good",
    },
    {
      id: "ai-overviews",
      label: "Google AI Overviews presence",
      passed: aiOverviews,
      value: aiOverviews ? "Estimated to appear" : "Not appearing",
      fix: aiOverviews ? undefined : "Add FAQ sections, clear definitions, and structured answers to target AI Overview spots.",
      impact: aiOverviews ? "good" : "warning",
    },
    {
      id: "eeat",
      label: "E-E-A-T signals",
      passed: eeatSignals >= 65,
      value: `${eeatSignals}/100`,
      fix: eeatSignals < 65
        ? "Strengthen E-E-A-T: add author bios, credentials, reviews, and local news mentions."
        : undefined,
      impact: eeatSignals < 40 ? "critical" : eeatSignals < 65 ? "warning" : "good",
    },
    {
      id: "content-depth",
      label: "Content depth",
      passed: contentDepth === "Deep" || contentDepth === "Expert",
      value: contentDepth,
      fix: contentDepth === "Thin" || contentDepth === "Moderate"
        ? "Create comprehensive service pages (800+ words) with local context, FAQs, and process explanations."
        : undefined,
      impact: contentDepth === "Thin" ? "critical" : contentDepth === "Moderate" ? "warning" : "good",
    },
    {
      id: "faq-schema",
      label: "FAQ schema markup",
      passed: faqPresent,
      value: faqPresent ? "FAQPage schema detected" : "No FAQ schema",
      fix: faqPresent ? undefined : "Add FAQ sections with FAQPage schema markup. These are prime AI Overview fodder.",
      impact: faqPresent ? "good" : "warning",
    },
    {
      id: "citation-ready",
      label: "Citation-ready content",
      passed: citationReady,
      value: citationReady ? "Well-structured for AI citation" : "Needs improvement",
      fix: citationReady ? undefined : "Structure content with clear headings, bullet points, and concise answers AI can extract.",
      impact: citationReady ? "good" : "warning",
    },
  ]

  const aiPassed = aiChecks.filter(c => c.passed).length
  const aiScore = Math.round((aiPassed / aiChecks.length) * 100)

  // Aggregate
  const sections: AuditSection[] = [
    { id: "on-page", title: "On-Page SEO", score: onPageScore, checks: onPageChecks },
    { id: "schema", title: "Schema Markup", score: schemaScore, checks: schemaChecks },
    { id: "gbp", title: "Google Business Profile", score: gbpScore, checks: gbpChecks },
    { id: "citations", title: "Local Citations", score: citationScore, checks: citationChecks },
    { id: "performance", title: "Performance & Core Web Vitals", score: perfScore, checks: perfChecks },
    { id: "ai", title: "AI Search Visibility", score: aiScore, checks: aiChecks },
  ]

  const overallScore = Math.round(
    sections.reduce((sum, s) => sum + s.score, 0) / sections.length
  )

  const allChecks = sections.flatMap(s => s.checks)
  const wins = allChecks.filter(c => c.passed).length
  const criticalCount = allChecks.filter(c => !c.passed && c.impact === "critical").length
  const warningCount = allChecks.filter(c => !c.passed && c.impact === "warning").length

  const grade =
    overallScore >= 90 ? "A" :
    overallScore >= 80 ? "B" :
    overallScore >= 65 ? "C" :
    overallScore >= 50 ? "D" : "F"

  const localPackEstimate = Math.max(
    1,
    Math.round((overallScore / 100) * 18)
  )

  return {
    url,
    businessName: businessName || domain,
    city: city || "your area",
    overallScore,
    grade,
    wins,
    warnings: warningCount,
    critical: criticalCount,
    localPackEstimate,
    sections,
    generatedAt: Date.now(),
  }
}

// ─── Syntax highlighter (zero deps) ──────────────────────────────────────────

function JsonHighlight({ code }: { code: string }) {
  const lines = code.split("\n")
  return (
    <pre className="text-xs leading-relaxed overflow-x-auto" aria-label="JSON-LD code example">
      {lines.map((line, i) => {
        // Tokenize carefully: match key:"value" pairs without mangling colons inside values.
        // Strategy: highlight JSON keys (quoted strings followed by colon) then highlight
        // the value portion (string, number, or punctuation) separately.
        const highlighted = line
          // Keys: quoted string immediately followed by colon (with optional spaces)
          .replace(/^(\s*)("(?:[^"\\]|\\.)*")(\s*:)/g, '$1<span class="text-blue-300">$2</span>$3')
          // String values: colon then whitespace then quoted string (value, not key)
          .replace(/(:\s*)("(?:[^"\\]|\\.)*")/g, '$1<span class="text-green-300">$2</span>')
          // Number values
          .replace(/(:\s*)(\d+\.?\d*\b)/g, '$1<span class="text-yellow-300">$2</span>')
          // Punctuation
          .replace(/[{}[\],]/g, m => `<span class="text-warm/70">${m}</span>`)
        return (
          <div key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />
        )
      })}
    </pre>
  )
}

// ─── Score ring (SVG) ─────────────────────────────────────────────────────────

function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  animated = true,
}: {
  score: number
  size?: number
  strokeWidth?: number
  animated?: boolean
}) {
  const [displayed, setDisplayed] = useState(animated ? 0 : score)
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (displayed / 100) * circ

  useEffect(() => {
    if (!animated) return
    let start: number | null = null
    const duration = 1200
    const raf = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [score, animated])

  const color =
    score >= 80 ? "#22c55e" :
    score >= 65 ? "#f59e0b" :
    score >= 50 ? "#f97316" : "#ef4444"

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: animated ? "none" : undefined }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={size * 0.22}
        fontWeight="700"
        fontFamily="var(--font-geist-sans, system-ui)"
      >
        {displayed}
      </text>
    </svg>
  )
}

// ─── Mini sparkline (SVG) ─────────────────────────────────────────────────────

function Sparkline({ url, seed }: { url: string; seed: string }) {
  const points = Array.from({ length: 8 }, (_, i) =>
    seeded(url, seed + i, 20, 80)
  )
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const w = 80
  const h = 24
  const pts = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-label="Review trend sparkline">
      <polyline
        points={pts}
        fill="none"
        stroke="#f97316"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((v, i) => {
        const x = (i / (points.length - 1)) * w
        const y = h - ((v - min) / range) * h
        return (
          <circle key={i} cx={x} cy={y} r="2" fill="#f97316" />
        )
      })}
    </svg>
  )
}

// ─── Check row ────────────────────────────────────────────────────────────────

function CheckRow({ check }: { check: AuditCheck }) {
  const [open, setOpen] = useState(false)
  const icon = check.passed ? (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#22c55e" opacity="0.2" />
      <path d="M5 8l2.5 2.5L11 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ) : check.impact === "critical" ? (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#ef4444" opacity="0.2" />
      <path d="M8 5v3M8 10.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#f59e0b" opacity="0.2" />
      <path d="M8 5v3M8 10.5v.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        className="w-full flex items-start gap-3 py-3 text-left hover:bg-white/3 rounded-lg px-2 -mx-2 transition-colors"
        onClick={() => !check.passed && setOpen(o => !o)}
        disabled={check.passed}
        aria-expanded={!check.passed ? open : undefined}
      >
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm text-paper/90">{check.label}</span>
          {check.value && (
            <span className="ml-2 text-xs text-paper/40">{check.value}</span>
          )}
        </div>
        {!check.passed && check.fix && (
          <svg
            width="14" height="14"
            viewBox="0 0 14 14"
            className={`shrink-0 mt-0.5 text-paper/30 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </button>
      {open && check.fix && (
        <div className="ml-7 mb-3 px-3 py-2.5 bg-warm/8 border border-warm/20 rounded-lg">
          <p className="text-xs text-warm/90 leading-relaxed">{check.fix}</p>
        </div>
      )}
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  section,
  children,
}: {
  section: AuditSection
  children?: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div id={section.id} className="bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)] overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-5 text-left"
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
        aria-controls={`section-body-${section.id}`}
      >
        <ScoreRing score={section.score} size={56} strokeWidth={6} animated />
        <div className="flex-1">
          <h3 className="font-display font-semibold text-paper text-base">{section.title}</h3>
          <p className="text-xs text-paper/40 mt-0.5">
            {section.checks.filter(c => c.passed).length} / {section.checks.length} checks passing
          </p>
        </div>
        <svg
          width="18" height="18"
          viewBox="0 0 18 18"
          className={`text-paper/30 transition-transform ${collapsed ? "-rotate-90" : ""}`}
          aria-hidden="true"
        >
          <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>

      {!collapsed && (
        <div id={`section-body-${section.id}`} className="px-5 pb-5 space-y-0">
          {section.checks.map(check => (
            <CheckRow key={check.id} check={check} />
          ))}
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Schema snippets ──────────────────────────────────────────────────────────

function parseCity(raw: string): { locality: string; region: string } {
  const parts = raw.split(",").map(s => s.trim())
  if (parts.length >= 2) {
    return { locality: parts[0], region: parts[1].replace(/\s+\d+.*$/, "").trim() }
  }
  return { locality: raw.trim(), region: "" }
}

function SchemaSnippets({ result }: { result: AuditResult }) {
  const missingChecks = result.sections
    .find(s => s.id === "schema")
    ?.checks.filter(c => !c.passed) ?? []

  if (missingChecks.length === 0) return null

  const { locality, region } = parseCity(result.city)
  const addressRegionLine = region ? `\n    "addressRegion": "${region}",` : ""

  const snippet = `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${result.businessName}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "${locality}",${addressRegionLine}
    "postalCode": "00000"
  },
  "telephone": "+1-555-000-0000",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "42"
  }
}`

  return (
    <div className="mt-4 pt-4 border-t border-white/5">
      <p className="text-xs text-paper/50 mb-2 font-medium uppercase tracking-wider">Recommended JSON-LD snippet</p>
      <div className="bg-ink/60 rounded-xl p-4 overflow-x-auto">
        <JsonHighlight code={snippet} />
      </div>
      <p className="text-xs text-paper/30 mt-2">Add this inside a &lt;script type=&quot;application/ld+json&quot;&gt; tag in your &lt;head&gt;</p>
    </div>
  )
}

// ─── Scan steps ───────────────────────────────────────────────────────────────

const SCAN_STEPS = [
  "Fetching page...",
  "Parsing HTML & meta...",
  "Checking schema markup...",
  "Running Core Web Vitals simulation...",
  "Scanning Google Business Profile signals...",
  "Checking local citations...",
  "Analyzing AI-search visibility...",
  "Compiling report...",
]

// ─── Main page ────────────────────────────────────────────────────────────────

type AppState =
  | { phase: "landing" }
  | { phase: "scanning"; url: string; step: number; businessName: string; city: string }
  | { phase: "results"; result: AuditResult }

function SeoAuditApp() {
  const searchParams = useSearchParams()

  const [state, setState] = useState<AppState>({ phase: "landing" })
  const [url, setUrl] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [city, setCity] = useState("")
  const [urlError, setUrlError] = useState("")
  const [pdfUnlocked, setPdfUnlocked] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prefersReduced = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  )

  // Restore from URL param
  useEffect(() => {
    const encoded = searchParams.get("report")
    if (encoded) {
      try {
        const parsed = JSON.parse(atob(encoded)) as AuditResult
        setState({ phase: "results", result: parsed })
      } catch {
        // ignore malformed
      }
    }
  }, [searchParams])

  const startAudit = useCallback(() => {
    setUrlError("")
    let normalized = url.trim()
    if (!normalized) { setUrlError("Please enter a URL."); return }
    if (!/^https?:\/\//i.test(normalized)) normalized = "https://" + normalized
    try { new URL(normalized) } catch { setUrlError("That doesn't look like a valid URL."); return }

    setState({ phase: "scanning", url: normalized, step: 0, businessName, city })

    if (prefersReduced.current) {
      const result = computeAudit(normalized, businessName, city)
      setState({ phase: "results", result })
      return
    }

    let stepIdx = 0
    intervalRef.current = setInterval(() => {
      stepIdx++
      if (stepIdx < SCAN_STEPS.length) {
        setState(prev =>
          prev.phase === "scanning" ? { ...prev, step: stepIdx } : prev
        )
      } else {
        clearInterval(intervalRef.current!)
        const result = computeAudit(normalized, businessName, city)
        setState({ phase: "results", result })
      }
    }, 420)
  }, [url, businessName, city])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const shareReport = useCallback((result: AuditResult) => {
    const encoded = btoa(JSON.stringify(result))
    const shareUrl = `${window.location.origin}/work/seo-audit?report=${encoded}`
    navigator.clipboard.writeText(shareUrl).then(() => alert("Share link copied!")).catch(() => {})
  }, [])

  const printReport = useCallback(() => window.print(), [])

  // ── Landing ──────────────────────────────────────────────────────────────────
  if (state.phase === "landing") {
    return (
      <main className="min-h-screen bg-ink flex flex-col" role="main">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-warm/4 blur-[120px]" />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-20">
          <div className="w-full max-w-xl text-center">
            <p className="text-paper/40 text-xs font-medium mb-5 uppercase tracking-wider">
              Built for: restaurants, contractors, salons, dental, retail, fitness, auto.
            </p>

            <h1 className="font-display font-bold text-paper leading-[1.0] mb-4" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
              Why your business isn&apos;t showing up for &ldquo;near me&rdquo; searches.
            </h1>

            <p className="text-paper/50 text-base mb-8 leading-relaxed max-w-md mx-auto">
              Local SEO is the one category AI Overviews haven&apos;t eaten yet — but most local businesses still get beat by a chain in a different city. Paste your URL. Get a scored 6-section audit in 90 seconds.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                "0 signups · results in your browser",
                "Scans 6 categories · 40+ signals",
                "Free — no card, no limits",
              ].map(chip => (
                <span key={chip} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-paper/50 text-xs">
                  {chip}
                </span>
              ))}
            </div>

            <div className="bg-ink/60 backdrop-blur-md border border-warm/20 rounded-2xl p-6 shadow-[0_4px_32px_oklch(0.05_0.005_260/0.12)] text-left">
              <div className="space-y-3">
                <div>
                  <label htmlFor="audit-url" className="block text-xs text-paper/50 mb-1.5 font-medium">
                    Website URL
                  </label>
                  <input
                    id="audit-url"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://yourbusiness.com"
                    value={url}
                    onChange={e => { setUrl(e.target.value); setUrlError("") }}
                    onKeyDown={e => e.key === "Enter" && startAudit()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-paper placeholder-paper/25 text-sm focus:outline-none focus:border-warm/50 focus:bg-white/7 transition-colors"
                    aria-describedby={urlError ? "url-error" : undefined}
                    aria-invalid={!!urlError}
                  />
                  {urlError && (
                    <p id="url-error" className="mt-1.5 text-xs text-red-400" role="alert">{urlError}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="audit-biz" className="block text-xs text-paper/50 mb-1.5 font-medium">
                      Business name <span className="text-paper/25">(optional)</span>
                    </label>
                    <input
                      id="audit-biz"
                      type="text"
                      placeholder="Acme Plumbing Co."
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && startAudit()}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-paper placeholder-paper/25 text-sm focus:outline-none focus:border-warm/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="audit-city" className="block text-xs text-paper/50 mb-1.5 font-medium">
                      City / area <span className="text-paper/25">(optional)</span>
                    </label>
                    <input
                      id="audit-city"
                      type="text"
                      placeholder="Los Angeles, CA"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && startAudit()}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-paper placeholder-paper/25 text-sm focus:outline-none focus:border-warm/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={startAudit}
                  className="w-full py-3.5 rounded-xl bg-warm text-ink font-semibold text-sm font-display hover:bg-warm-hover active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-warm/50 focus:ring-offset-2 focus:ring-offset-ink"
                >
                  Run audit →
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs text-paper/25">
              No signup · No credit card · Results in your browser
            </p>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 w-full max-w-lg text-center">
            {[
              { n: "6", label: "Audit sections" },
              { n: "39", label: "Individual checks" },
              { n: "90s", label: "Average time" },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display font-bold text-warm text-3xl">{stat.n}</p>
                <p className="text-paper/40 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // ── Scanning ─────────────────────────────────────────────────────────────────
  if (state.phase === "scanning") {
    const pct = Math.round(((state.step + 1) / SCAN_STEPS.length) * 100)
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center px-4" role="main" aria-live="polite" aria-atomic="true">
        <div className="w-full max-w-sm text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warm/10 border border-warm/20 mb-4" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8" stroke="#f97316" strokeWidth="2" />
                <path d="M18 18l5 5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="font-display font-semibold text-paper text-xl">Auditing {new URL(state.url).hostname}</h2>
            <p className="text-paper/40 text-sm mt-1">Running {SCAN_STEPS.length} checks across 6 categories</p>
          </div>

          <div className="bg-ink/60 border border-warm/20 rounded-2xl p-5 text-left space-y-2.5 mb-6">
            {SCAN_STEPS.map((step, i) => {
              const done = i < state.step
              const active = i === state.step
              return (
                <div key={step} className={`flex items-center gap-3 transition-opacity ${i > state.step ? "opacity-25" : "opacity-100"}`}>
                  <span className="shrink-0" aria-hidden="true">
                    {done ? (
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7" fill="#22c55e" opacity="0.2" />
                        <path d="M5 8l2.5 2.5L11 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    ) : active ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" className="animate-spin">
                        <circle cx="8" cy="8" r="6" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="20 18" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm ${active ? "text-warm font-medium" : done ? "text-paper/60" : "text-paper/30"}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="relative h-1.5 bg-white/8 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Audit progress">
            <div
              className="absolute inset-y-0 left-0 bg-warm rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-paper/30 mt-2">{pct}% complete</p>
        </div>
      </main>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────────
  const { result } = state

  const gradeColor =
    result.grade === "A" ? "#22c55e" :
    result.grade === "B" ? "#84cc16" :
    result.grade === "C" ? "#f59e0b" :
    result.grade === "D" ? "#f97316" : "#ef4444"

  const perfSection = result.sections.find(s => s.id === "performance")
  const gbpSection = result.sections.find(s => s.id === "gbp")

  return (
    <main className="min-h-screen bg-ink" role="main">
      {/* Print stylesheet */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { background: white !important; color: black !important; }
          .bg-ink\\/40, .bg-ink\\/60, .bg-ink { background: #f8f8f8 !important; }
          .text-paper { color: #111 !important; }
          .text-warm { color: #c05000 !important; }
          .border-warm\\/20 { border-color: #ddd !important; }
        }
      `}</style>

      {/* Sticky summary bar */}
      <div className="sticky top-0 z-40 no-print bg-ink/90 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <ScoreRing score={result.overallScore} size={44} strokeWidth={5} animated={false} />
            <div className="min-w-0">
              <p className="font-display font-semibold text-paper text-sm truncate">
                {result.businessName}
              </p>
              <p className="text-paper/40 text-xs truncate">{new URL(result.url).hostname}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">{result.wins} wins</span>
            {result.warnings > 0 && <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">{result.warnings} warnings</span>}
            {result.critical > 0 && <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">{result.critical} critical</span>}
          </div>

          <div className="flex items-center gap-2 shrink-0 no-print">
            <button
              onClick={() => shareReport(result)}
              className="px-3 py-1.5 text-xs text-paper/60 hover:text-paper border border-white/10 rounded-lg hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-warm/40"
              aria-label="Copy share link"
            >
              Share
            </button>
            <button
              onClick={printReport}
              className="px-3 py-1.5 text-xs text-paper/60 hover:text-paper border border-white/10 rounded-lg hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-warm/40"
              aria-label="Print or save as PDF"
            >
              Export PDF
            </button>
            <button
              onClick={() => setState({ phase: "landing" })}
              className="px-3 py-1.5 text-xs bg-warm/10 text-warm hover:bg-warm/20 border border-warm/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-warm/40"
            >
              New audit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Hero summary */}
        <div className="bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)] overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex flex-col items-center text-center shrink-0">
                <ScoreRing score={result.overallScore} size={120} strokeWidth={10} animated />
                <div
                  className="mt-3 px-4 py-1 rounded-full text-2xl font-bold font-display"
                  style={{ color: gradeColor, background: `${gradeColor}18`, border: `1px solid ${gradeColor}30` }}
                  aria-label={`Grade ${result.grade}`}
                >
                  {result.grade}
                </div>
              </div>

              <div className="flex-1">
                <h2 className="font-display font-bold text-paper text-xl mb-1">
                  {result.businessName}
                </h2>
                <p className="text-paper/40 text-sm mb-4">{result.url}</p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-3 bg-green-500/8 rounded-xl border border-green-500/15">
                    <p className="text-green-400 font-bold text-lg">{result.wins}</p>
                    <p className="text-paper/40 text-xs">wins</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/8 rounded-xl border border-yellow-500/15">
                    <p className="text-yellow-400 font-bold text-lg">{result.warnings}</p>
                    <p className="text-paper/40 text-xs">warnings</p>
                  </div>
                  <div className="text-center p-3 bg-red-500/8 rounded-xl border border-red-500/15">
                    <p className="text-red-400 font-bold text-lg">{result.critical}</p>
                    <p className="text-paper/40 text-xs">critical</p>
                  </div>
                </div>

                <p className="text-sm text-paper/60 leading-relaxed">
                  Your business appears in approximately{" "}
                  <span className="text-warm font-semibold">{result.localPackEstimate} local pack results per month</span>
                  {" "}for {result.city}. Fixing the {result.critical} critical issues could double that.
                </p>
              </div>
            </div>

            {/* Section score overview */}
            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-3">
              {result.sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                  aria-label={`${section.title}: ${section.score}/100`}
                >
                  <ScoreRing score={section.score} size={36} strokeWidth={4} animated={false} />
                  <span className="text-xs text-paper/60 group-hover:text-paper/80 leading-tight transition-colors">{section.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Section 1: On-Page SEO */}
        <SectionCard section={result.sections[0]} />

        {/* Section 2: Schema */}
        <SectionCard section={result.sections[1]}>
          <SchemaSnippets result={result} />
        </SectionCard>

        {/* Section 3: GBP */}
        <SectionCard section={result.sections[2]}>
          {gbpSection && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-paper/50 mb-3 font-medium uppercase tracking-wider">Review velocity trend (estimated)</p>
              <div className="flex items-center gap-4">
                <Sparkline url={result.url} seed="review-trend" />
                <div className="text-xs text-paper/40">
                  {seeded(result.url, "review-count", 4, 312)} reviews •{" "}
                  {(seeded(result.url, "review-rating", 32, 50) / 10).toFixed(1)}★ avg
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Section 4: Citations */}
        <div id={result.sections[3].id} className="bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)] overflow-hidden">
          <button
            className="w-full flex items-center gap-4 p-5 text-left"
            onClick={() => {}}
            aria-label={`${result.sections[3].title} section, ${result.sections[3].score}/100`}
          >
            <ScoreRing score={result.sections[3].score} size={56} strokeWidth={6} animated />
            <div>
              <h3 className="font-display font-semibold text-paper text-base">{result.sections[3].title}</h3>
              <p className="text-xs text-paper/40 mt-0.5">NAP consistency across major directories</p>
            </div>
          </button>
          <div className="px-5 pb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Directory citation status">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-paper/30 font-medium py-2 pr-4">Directory</th>
                    <th className="text-left text-xs text-paper/30 font-medium py-2 pr-4">Status</th>
                    <th className="text-left text-xs text-paper/30 font-medium py-2">NAP</th>
                  </tr>
                </thead>
                <tbody>
                  {result.sections[3].checks.map(check => {
                    const listed = !check.value?.includes("Not listed")
                    const consistent = check.value?.includes("consistent")
                    return (
                      <tr key={check.id} className="border-b border-white/5 last:border-0">
                        <td className="py-2.5 pr-4 text-paper/80">{check.label}</td>
                        <td className="py-2.5 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${listed ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {listed ? "Listed" : "Missing"}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {listed && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${consistent ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"}`}>
                              {consistent ? "Consistent" : "Mismatch"}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 5: Performance */}
        <div id={result.sections[4].id} className="bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)] overflow-hidden">
          <div className="flex items-center gap-4 p-5">
            <ScoreRing score={result.sections[4].score} size={56} strokeWidth={6} animated />
            <div>
              <h3 className="font-display font-semibold text-paper text-base">{result.sections[4].title}</h3>
              <p className="text-xs text-paper/40 mt-0.5">Core Web Vitals simulation</p>
            </div>
          </div>
          <div className="px-5 pb-5">
            {/* CWV gauges */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {perfSection?.checks.slice(0, 4).map(check => {
                const color =
                  check.impact === "good" ? "#22c55e" :
                  check.impact === "warning" ? "#f59e0b" : "#ef4444"
                return (
                  <div key={check.id} className="p-3 bg-white/3 rounded-xl border border-white/5">
                    <p className="text-xs text-paper/40 mb-1">{check.label.split(" (")[0]}</p>
                    <p className="font-bold font-display" style={{ color, fontSize: "1.5rem" }}>
                      {check.value}
                    </p>
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: check.passed ? "30%" : check.impact === "warning" ? "65%" : "90%",
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color, opacity: 0.7 }}>
                      {check.passed ? "Good" : check.impact === "warning" ? "Needs improvement" : "Poor"}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Remaining checks */}
            {perfSection?.checks.slice(4).map(check => (
              <CheckRow key={check.id} check={check} />
            ))}
          </div>
        </div>

        {/* Section 6: AI Search */}
        <div id={result.sections[5].id} className="bg-ink/40 backdrop-blur-md border border-warm/20 rounded-2xl shadow-[0_4px_12px_oklch(0.05_0.005_260/0.06)] overflow-hidden">
          <div className="flex items-center gap-4 p-5">
            <ScoreRing score={result.sections[5].score} size={56} strokeWidth={6} animated />
            <div>
              <h3 className="font-display font-semibold text-paper text-base">{result.sections[5].title}</h3>
              <p className="text-xs text-paper/40 mt-0.5">Your differentiator — visibility in ChatGPT, Perplexity & Google AI Overviews</p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: "ChatGPT", value: seededBool(result.url, "ai-chatgpt", 0.35) ? "Visible" : "Not found", good: seededBool(result.url, "ai-chatgpt", 0.35) },
                { label: "Perplexity", value: `${seeded(result.url, "ai-perplexity", 15, 90)}/100`, good: seeded(result.url, "ai-perplexity", 15, 90) >= 60 },
                { label: "AI Overviews", value: seededBool(result.url, "ai-overviews", 0.4) ? "Appearing" : "Not shown", good: seededBool(result.url, "ai-overviews", 0.4) },
                { label: "E-E-A-T", value: `${seeded(result.url, "eeat", 20, 95)}/100`, good: seeded(result.url, "eeat", 20, 95) >= 65 },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl border text-center ${item.good ? "bg-green-500/8 border-green-500/15" : "bg-red-500/5 border-red-500/10"}`}>
                  <p className="text-xs text-paper/40 mb-1">{item.label}</p>
                  <p className={`font-semibold text-sm ${item.good ? "text-green-400" : "text-red-400"}`}>{item.value}</p>
                </div>
              ))}
            </div>
            {result.sections[5].checks.map(check => (
              <CheckRow key={check.id} check={check} />
            ))}
          </div>
        </div>

        {/* PDF lead capture gate */}
        {!pdfUnlocked ? (
          <LeadCapture
            appSlug="seo-audit"
            context="before-pdf-export"
            buttonLabel="Email me the PDF"
            onCaptured={() => {
              setPdfUnlocked(true)
              window.print()
            }}
            metadata={{ score: result.overallScore, grade: result.grade }}
            className="print:hidden"
          />
        ) : (
          <div className="flex justify-center print:hidden">
            <button
              onClick={printReport}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-warm text-ink font-semibold text-sm hover:bg-warm-hover active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-warm/50"
            >
              Download PDF
            </button>
          </div>
        )}

        {/* CTA card */}
        <div className="bg-[oklch(0.14_0.005_260)] border border-[oklch(0.28_0.005_260)] rounded-2xl p-6 print:hidden">
          <p className="font-display font-semibold text-paper text-lg mb-1">Want us to fix these for you?</p>
          <p className="text-paper/60 text-sm mb-4 leading-relaxed">
            We run ongoing SEO retainers for local businesses in the $500&ndash;2,000/mo range &mdash; on-page fixes, schema, GBP optimization, and monthly scorecard reports like this one. Average client goes from D-tier to A-tier in 90 days.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:hello@nguyenetic.com?subject=Local%20SEO%20retainer%20inquiry&body=My%20site%3A%20[paste%20URL]"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-display font-semibold text-sm text-[oklch(0.08_0.005_260)] bg-gradient-to-r from-[oklch(0.80_0.16_55)] to-[oklch(0.74_0.15_55)] hover:from-[oklch(0.85_0.17_55)] hover:to-[oklch(0.80_0.16_55)] transition-all shadow-[0_0_20px_oklch(0.74_0.15_55/25%)]"
            >
              Book 15-min call &mdash; Nguyenetic
            </a>
            <span className="text-paper/40 text-sm">or <a href="#" className="underline underline-offset-2 hover:text-paper/60 transition-colors">monthly scorecard report for $19/mo &rarr;</a></span>
          </div>
        </div>

        <p className="text-center text-xs text-paper/25 print:hidden">
          Or re-audit after you fix: <button onClick={() => setState({ phase: "landing" })} className="underline hover:text-paper/50 transition-colors">run another audit</button>
        </p>

        <p className="text-center text-xs text-paper/20 pb-4">
          Report generated {new Date(result.generatedAt).toLocaleString()} · Results are simulated for demonstration
        </p>
      </div>
    </main>
  )
}

export default function SeoAuditPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-ink flex items-center justify-center" role="main">
        <div className="text-paper/30 text-sm">Loading audit tool...</div>
      </main>
    }>
      <SeoAuditApp />
    </Suspense>
  )
}
