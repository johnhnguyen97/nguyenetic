"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

interface SiteFooterProps {
  /** When provided, the wordmark becomes a button (used for the home easter egg). */
  onLogoClick?: () => void
}

export function SiteFooter({ onLogoClick }: SiteFooterProps) {
  const t = useTranslations("footer")
  const year = new Date().getFullYear()

  const wordmark = onLogoClick ? (
    <button
      type="button"
      onClick={onLogoClick}
      className="font-medium transition-colors hover:text-paper focus:outline-none focus-visible:text-paper"
      aria-label="Nguyenetic"
    >
      Nguyenetic
    </button>
  ) : (
    <span className="font-medium">Nguyenetic</span>
  )

  return (
    <footer className="border-t border-warm/10 bg-ink px-6 py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        {/* Blog CTA — promotes the blog without being a sales pitch */}
        <p className="text-center font-[family-name:var(--font-instrument)] text-lg text-paper/80 md:text-xl">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 transition-colors hover:text-warm"
          >
            <span className="italic">{t("blogCta")}</span>
            <span
              aria-hidden
              className="text-warm transition-transform group-hover:translate-x-1"
            >
              →
            </span>
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-paper/60 group-hover:text-warm">
              /blog
            </span>
          </Link>
        </p>

        {/* Copyright + tagline */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-warm/10 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40 md:flex-row">
          <p>
            &copy; {year} {wordmark}
          </p>
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  )
}
