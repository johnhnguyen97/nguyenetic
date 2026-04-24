"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useRef, useState, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { Proof } from "@/components/sections/Proof"
import { Services } from "@/components/sections/Services"
import { Work } from "@/components/sections/Work"
import { Contact } from "@/components/sections/Contact"
import { ChatbotDemo } from "@/components/ui/chatbot-demo"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CursorGlow } from "@/components/ui/cursor-glow"

export default function Home() {
  const [easterEggActive, setEasterEggActive] = useState(false)
  const clickCountRef = useRef(0)
  const lastClickTimeRef = useRef(0)

  const handleFooterClick = useCallback(() => {
    const now = Date.now()
    if (now - lastClickTimeRef.current > 3000) clickCountRef.current = 0
    lastClickTimeRef.current = now
    clickCountRef.current += 1
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0
      setEasterEggActive(true)
      setTimeout(() => setEasterEggActive(false), 2000)
    }
  }, [])

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Header />

      <AnimatePresence>
        {easterEggActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{
              background:
                "linear-gradient(135deg, #ff8a3d22 0%, #08061844 35%, #f5f0eb11 65%, #ff8a3d22 100%)",
              animation: "shimmer-cycle 2s ease-in-out",
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer-cycle {
          0%   { opacity: 0; filter: hue-rotate(0deg); }
          25%  { opacity: 1; filter: hue-rotate(30deg); }
          50%  { opacity: 0.6; filter: hue-rotate(60deg); }
          75%  { opacity: 1; filter: hue-rotate(20deg); }
          100% { opacity: 0; filter: hue-rotate(0deg); }
        }
      `}</style>

      <main>
        <Hero />
        <Proof />
        <Services />
        <Work />
        <Contact />
      </main>

      <ChatbotDemo />

      <footer className="border-t border-warm/10 bg-ink px-6 py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <button
              onClick={handleFooterClick}
              className="font-medium transition-colors hover:text-paper focus:outline-none focus-visible:text-paper"
              aria-label="Nguyenetic"
            >
              Nguyenetic
            </button>
          </p>
          <p>◇ signed · shipped · stamped</p>
        </div>
      </footer>
    </>
  )
}
