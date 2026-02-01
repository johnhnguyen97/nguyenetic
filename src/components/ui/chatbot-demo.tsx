"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Sparkles, Languages } from "lucide-react"

const springEase = [0.22, 1, 0.36, 1] as const

interface Message {
  id: number
  text: string
  isBot: boolean
  role: "user" | "assistant"
}

export function ChatbotDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! 👋 I'm Moxie, your AI assistant. Ask me anything about web development, SEO, or custom apps!",
      isBot: true,
      role: "assistant"
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isJapanese, setIsJapanese] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update greeting when language changes
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([
        {
          id: 1,
          text: isJapanese
            ? "こんにちは！👋 モクシーです。ウェブ開発、SEO、カスタムアプリについて何でも聞いてください！"
            : "Hi! 👋 I'm Moxie, your AI assistant. Ask me anything about web development, SEO, or custom apps!",
          isBot: true,
          role: "assistant"
        }
      ])
    }
  }, [isJapanese])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
      role: "user"
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    setError(null)

    try {
      // Prepare messages for API (exclude the greeting, include all conversation)
      const apiMessages = [...messages.slice(1), userMessage].map(m => ({
        role: m.role,
        content: m.text
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          isJapanese
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.message,
          isBot: true,
          role: "assistant"
        }
      ])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)

      // Add error message as bot response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: isJapanese
            ? "申し訳ありません、エラーが発生しました。もう一度お試しください。"
            : "Sorry, I encountered an error. Please try again!",
          isBot: true,
          role: "assistant"
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleLanguage = () => {
    setIsJapanese(!isJapanese)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, ease: springEase }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyber to-accent-sakura text-white shadow-lg shadow-accent-cyber/30 flex items-center justify-center hover:scale-110 transition-transform ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle className="w-6 h-6" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-accent-cyber/30 animate-ping" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: springEase }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-accent-cyber/10 overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-4 py-3 bg-gradient-to-r from-accent-cyber/20 via-accent-sakura/10 to-accent-gold/20 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyber to-accent-sakura flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Moxie</div>
                  <div className="text-xs text-accent-cyber flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{isJapanese ? "AIアシスタント" : "AI Assistant"}</span>
                  </div>
                </div>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isJapanese
                      ? "bg-accent-sakura/20 text-accent-sakura"
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}
                  title={isJapanese ? "Switch to English" : "日本語に切り替え"}
                >
                  <Languages className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-muted/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Japanese mode indicator */}
              {isJapanese && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-1 right-16 px-2 py-0.5 bg-accent-sakura/20 rounded-full"
                >
                  <span className="text-[10px] text-accent-sakura font-medium">日本語</span>
                </motion.div>
              )}
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${message.isBot ? "bg-gradient-to-br from-accent-cyber to-accent-sakura" : "bg-accent-gold"}`}>
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    message.isBot
                      ? "bg-muted/50 rounded-tl-sm"
                      : "bg-gradient-to-r from-accent-cyber to-accent-sakura text-white rounded-tr-sm"
                  }`}>
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyber to-accent-sakura flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-full bg-accent-cyber"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-muted/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isJapanese ? "メッセージを入力..." : "Type a message..."}
                  className="flex-1 px-4 py-2.5 rounded-full bg-background border border-border text-sm focus:outline-none focus:border-accent-cyber/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-cyber to-accent-sakura text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                {isJapanese
                  ? "Moxieはあなたのデータでトレーニングされます"
                  : "Moxie is powered by AI — trained for your business"
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
