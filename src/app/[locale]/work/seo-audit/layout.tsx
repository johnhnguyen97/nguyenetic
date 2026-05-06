import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Local SEO Audit · Nguyenetic",
  description: "Paste your URL and get a scored local SEO report in 90 seconds. No signup, no credit card. Discover what's keeping you off page 1.",
  openGraph: {
    title: "Free Local SEO Audit Tool",
    description: "Get a comprehensive local SEO score covering on-page, schema, Google Business Profile, citations, performance, and AI search visibility.",
  },
}

export default function SeoAuditLayout({ children }: { children: React.ReactNode }) {
  return children
}
