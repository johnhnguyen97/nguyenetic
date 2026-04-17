"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Minus } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const springEase = [0.22, 1, 0.36, 1] as const

interface Message {
  id: number
  text: string
  isBot: boolean
  role: "user" | "assistant"
}

const GREETING_EN = "Hi! I'm **Moxie**, your AI assistant. Ask me anything about web development, SEO, or custom apps!"
const GREETING_JA = "こんにちは！**モクシー**です。ウェブ開発、SEO、カスタムアプリについて何でも聞いてください！"

const PROMPT_CHIPS_EN = [
  "What services do you offer?",
  "Show me your work",
  "日本語で話す",
]
const PROMPT_CHIPS_JA = [
  "どのサービスを提供していますか？",
  "実績を見せてください",
  "Switch to English",
]

// Hexagon SVG path for a regular hexagon centered at (28,28), radius 22
const HEX_PATH = "M28 6 L48 17 L48 39 L28 50 L8 39 L8 17 Z"

function HexagonMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hex-grad" x1="8" y1="6" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb68d" />
          <stop offset="100%" stopColor="#ff8a3d" />
        </linearGradient>
        <filter id="hex-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={HEX_PATH} fill="url(#hex-grad)" filter="url(#hex-glow)" />
      <text
        x="28"
        y="33"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#080618"
        fontFamily="system-ui, sans-serif"
      >
        M
      </text>
    </svg>
  )
}

function SmallHexMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hex-sm-grad" x1="8" y1="6" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb68d" />
          <stop offset="100%" stopColor="#ff8a3d" />
        </linearGradient>
      </defs>
      <path d={HEX_PATH} fill="url(#hex-sm-grad)" />
      <text x="28" y="33" textAnchor="middle" fontSize="16" fontWeight="700" fill="#080618" fontFamily="system-ui, sans-serif">M</text>
    </svg>
  )
}

function TypingDots() {
  return (
    <div className="flex gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full"
          style={{ background: "#ff8a3d" }}
        />
      ))}
    </div>
  )
}

export function ChatbotDemo() {
  const { language, t } = useLanguage()
  const isJapanese = language === "ja"
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const greetingText = isJapanese ? GREETING_JA : GREETING_EN
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: greetingText, isBot: true, role: "assistant" },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Update greeting on language change (idempotent — only touches message id:1)
  useEffect(() => {
    setMessages((prev) => {
      const updated = [...prev]
      const idx = updated.findIndex((m) => m.id === 1)
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], text: isJapanese ? GREETING_JA : GREETING_EN }
      }
      return updated
    })
  }, [isJapanese])

  // Escape key closes panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isOpen])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isTyping) return

    const userMessage: Message = {
      id: Date.now(),
      text: msg,
      isBot: false,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const apiMessages = [...messages.slice(1), userMessage].map((m) => ({
        role: m.role,
        content: m.text,
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, isJapanese }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to get response")

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: data.message, isBot: true, role: "assistant" },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: isJapanese
            ? "申し訳ありません、エラーが発生しました。もう一度お試しください。"
            : "Sorry, I encountered an error. Please try again!",
          isBot: true,
          role: "assistant",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, messages, isJapanese])

  const chips = isJapanese ? PROMPT_CHIPS_JA : PROMPT_CHIPS_EN
  const showChips = input.length === 0 && messages.length <= 2

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating hex button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, ease: springEase }}
        onClick={() => { setIsOpen(true); setIsMinimized(false) }}
        aria-label="Open Moxie AI chat"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${isOpen ? "hidden" : ""}`}
        style={{ filter: "drop-shadow(0 0 16px oklch(0.74 0.15 55 / 0.10))" }}
      >
        <HexagonMark size={56} />
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: "oklch(0.74 0.15 55 / 0.2)" }}
        />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.28, ease: springEase }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="moxie-panel-title"
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-1.5rem)] rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.08 0.005 260 / 0.97)",
              border: "1px solid oklch(0.74 0.15 55 / 0.2)",
              boxShadow: "0 0 32px oklch(0.74 0.15 55 / 0.08), 0 24px 72px oklch(0.05 0.005 260 / 0.10)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div
                className="w-8 h-1 rounded-full"
                style={{ background: "oklch(0.74 0.15 55 / 0.3)" }}
              />
            </div>

            {/* Header */}
            <div className="px-4 pb-3 flex items-center gap-3">
              <SmallHexMark />
              <div className="flex-1 min-w-0">
                <div
                  id="moxie-panel-title"
                  className="font-semibold text-sm tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: "#f5f5f0" }}
                >
                  Moxie AI
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.74 0.15 55)" }}>
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
                  />
                  <span>{t("Online", "オンライン")}</span>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized((v) => !v)}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm"
                style={{ color: "oklch(0.74 0.15 55 / 0.6)" }}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm"
                style={{ color: "oklch(0.74 0.15 55 / 0.6)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Collapsible body */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: springEase }}
                  style={{ overflow: "hidden" }}
                >
                  {/* Divider */}
                  <div style={{ height: 1, background: "oklch(0.74 0.15 55 / 0.1)" }} />

                  {/* Messages */}
                  <div
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                    className="h-72 overflow-y-auto p-4 space-y-4"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "oklch(0.28 0.005 260) transparent" }}
                  >
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                      >
                        {message.isBot && (
                          <div className="flex-shrink-0 mt-0.5">
                            <SmallHexMark />
                          </div>
                        )}
                        <div
                          className={`max-w-[78%] px-3 py-2.5 text-sm leading-relaxed ${
                            message.isBot
                              ? "rounded-2xl rounded-tl-sm"
                              : "rounded-2xl rounded-br-sm"
                          }`}
                          style={
                            message.isBot
                              ? {
                                  background: "oklch(0.12 0.005 260 / 0.7)",
                                  border: "1px solid oklch(0.74 0.15 55 / 0.08)",
                                  color: "#f5f5f0",
                                }
                              : {
                                  background: "oklch(0.14 0.005 260 / 0.8)",
                                  border: "1px solid oklch(0.74 0.15 55 / 0.15)",
                                  color: "#f5f5f0",
                                }
                          }
                        >
                          {message.isBot ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code: ({ children, className }) => {
                                  const isBlock = className?.includes("language-")
                                  return isBlock ? (
                                    <pre
                                      className="rounded-md p-3 font-mono text-xs overflow-x-auto my-2"
                                      style={{ background: "oklch(0.08 0.005 260 / 0.9)" }}
                                    >
                                      <code>{children}</code>
                                    </pre>
                                  ) : (
                                    <code
                                      className="font-mono text-xs px-1 py-0.5 rounded"
                                      style={{ background: "oklch(0.08 0.005 260 / 0.9)", color: "#ffb68d" }}
                                    >
                                      {children}
                                    </code>
                                  )
                                },
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline-offset-4 hover:underline"
                                    style={{ color: "#ff8a3d" }}
                                  >
                                    {children}
                                  </a>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>
                                ),
                                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                strong: ({ children }) => (
                                  <strong style={{ color: "#ffb68d" }}>{children}</strong>
                                ),
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                          ) : (
                            message.text
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <div className="flex-shrink-0"><SmallHexMark /></div>
                        <div
                          className="rounded-2xl rounded-tl-sm px-3 py-2.5"
                          style={{
                            background: "oklch(0.12 0.005 260 / 0.7)",
                            border: "1px solid oklch(0.74 0.15 55 / 0.08)",
                          }}
                        >
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Prompt chips */}
                  <AnimatePresence>
                    {showChips && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3 pb-2 flex flex-wrap gap-1.5"
                      >
                        {chips.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleSend(chip)}
                            className="px-3 py-1.5 text-xs rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm"
                            style={{
                              border: "1px solid oklch(0.74 0.15 55 / 0.3)",
                              color: "oklch(0.74 0.15 55)",
                              background: "transparent",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "oklch(0.74 0.15 55 / 0.1)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent"
                            }}
                          >
                            {chip}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input area */}
                  <div
                    className="px-3 pb-3"
                    style={{ borderTop: "1px solid oklch(0.74 0.15 55 / 0.08)" }}
                  >
                    <form
                      onSubmit={(e) => { e.preventDefault(); handleSend() }}
                      className="flex items-end gap-2 pt-3"
                    >
                      <div className="flex-1 relative">
                        <textarea
                          ref={inputRef}
                          rows={1}
                          value={input}
                          onChange={(e) => {
                            setInput(e.target.value)
                            // Auto-expand, max 3 rows
                            e.target.style.height = "auto"
                            e.target.style.height = Math.min(e.target.scrollHeight, 72) + "px"
                          }}
                          onKeyDown={handleTextareaKeyDown}
                          placeholder={t("Type a message…", "メッセージを入力…")}
                          className="w-full resize-none bg-transparent text-sm py-2 pr-1 transition-all focus:outline-none"
                          style={{
                            color: "#f5f5f0",
                            borderBottom: "1px solid oklch(0.74 0.15 55 / 0.25)",
                            maxHeight: "72px",
                            lineHeight: "1.5",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderBottomColor = "oklch(0.74 0.15 55 / 0.8)"
                            e.target.style.boxShadow = "0 1px 0 0 oklch(0.74 0.15 55 / 0.12)"
                          }}
                          onBlur={(e) => {
                            e.target.style.borderBottomColor = "oklch(0.74 0.15 55 / 0.25)"
                            e.target.style.boxShadow = "none"
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        aria-label="Send message"
                        className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm focus-visible:ring-offset-1"
                        style={{
                          background: "linear-gradient(135deg, #ffb68d, #ff8a3d)",
                          color: "#080618",
                        }}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                    <p
                      className="text-[10px] text-center mt-2"
                      style={{ color: "oklch(0.74 0.15 55 / 0.4)" }}
                    >
                      {t("Moxie is trained for your business", "Moxieはあなたのビジネスのために訓練されています")}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
