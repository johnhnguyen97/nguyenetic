"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Languages, Check } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing, localeNames, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { OrbitN } from "@/components/ui/orbit-n"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langButtonRef = useRef<HTMLDivElement | null>(null)
  const t = useTranslations("header")
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { label: t("nav.work"), href: "#work" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.receipts"), href: "#proof" },
    { label: t("nav.contact"), href: "#contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isLangOpen) return
    const onClick = (e: MouseEvent) => {
      if (
        langButtonRef.current &&
        !langButtonRef.current.contains(e.target as Node)
      ) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [isLangOpen])

  const switchLocale = (next: Locale) => {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    router.replace(pathname, { locale: next })
    setIsLangOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "glass py-4" : "py-6"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a
            href="/"
            className="group inline-flex items-center transition-colors hover:text-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-warm rounded"
            aria-label="Nguyenetic — home"
          >
            <OrbitN size={36} />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-warm transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div ref={langButtonRef} className="relative">
              <button
                onClick={() => setIsLangOpen((v) => !v)}
                aria-label={t("languageSwitch")}
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
                  isLangOpen
                    ? "bg-accent-sakura/20 text-accent-sakura"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <Languages className="w-4 h-4" aria-hidden="true" />
                <span className="text-xs font-medium" aria-hidden="true">
                  {localeNames[locale]}
                </span>
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 min-w-[180px] rounded-xl border border-warm/15 bg-ink/95 backdrop-blur-xl py-2 shadow-lg shadow-ink/40"
                  >
                    {routing.locales.map((loc) => (
                      <li key={loc}>
                        <button
                          role="option"
                          aria-selected={loc === locale}
                          onClick={() => switchLocale(loc)}
                          className={cn(
                            "w-full flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors",
                            loc === locale
                              ? "text-warm"
                              : "text-paper/70 hover:text-paper hover:bg-warm/5"
                          )}
                        >
                          <span>{localeNames[loc]}</span>
                          {loc === locale && (
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <a
              href="#contact"
              className="text-sm px-5 py-2.5 rounded-full border border-neutral-border hover:border-warm hover:text-warm transition-all"
            >
              {t("letsTalk")}
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsLangOpen((v) => !v)}
              aria-label={t("languageSwitch")}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                isLangOpen
                  ? "bg-accent-sakura/20 text-accent-sakura"
                  : "hover:bg-muted/50 text-muted-foreground"
              )}
            >
              <Languages className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isLangOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsLangOpen(false)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
            <motion.ul
              role="listbox"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 bg-card border-t border-border p-4 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {routing.locales.map((loc) => (
                <li key={loc}>
                  <button
                    role="option"
                    aria-selected={loc === locale}
                    onClick={() => switchLocale(loc)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-base transition-colors",
                      loc === locale
                        ? "bg-warm/10 text-warm"
                        : "text-paper/80 hover:text-paper hover:bg-warm/5"
                    )}
                  >
                    <span>{localeNames[loc]}</span>
                    {loc === locale && (
                      <Check className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-card border-l border-border p-8 pt-24"
            >
              <div className="space-y-6">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-2xl font-medium font-display hover:text-warm transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6 border-t border-border"
                >
                  <a
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-block px-6 py-3 bg-foreground text-background rounded-full font-medium"
                  >
                    {t("letsTalk")}
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
