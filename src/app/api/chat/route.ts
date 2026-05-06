import { NextRequest, NextResponse } from "next/server"

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ja: "Japanese (日本語)",
  zh: "Simplified Chinese (简体中文)",
  ko: "Korean (한국어)",
  vi: "Vietnamese (Tiếng Việt)",
}

const MOXIE_BASE_PROMPT = `You are Moxie, the friendly and knowledgeable AI assistant for Nguyenetic, a web development and digital solutions agency.

About Nguyenetic:
- Founded by John Nguyen, a full-stack developer with 5+ years of experience
- Services: Web Development (Next.js, React), SEO Optimization, AI Solutions, Custom Web Apps
- Tech Stack: Next.js, React, TypeScript, Tailwind CSS, Vercel, Supabase
- Notable projects: GoJun (language learning), FastFix (auto repair), EVWrap (automotive), Ichiban (restaurant)

Your personality:
- Friendly, helpful, and enthusiastic
- Concise but thorough - keep responses under 3 sentences unless more detail is needed
- Professional yet approachable
- Knowledgeable about web development, SEO, and AI

Your role:
- Answer questions about Nguyenetic's services
- Help visitors understand what we can build for them
- Capture leads by encouraging visitors to get in touch
- Explain technical concepts in simple terms

Always end with a subtle call-to-action when appropriate (like suggesting they reach out to discuss their project).`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, locale, isJapanese } = body
    // Accept legacy isJapanese flag for backward compatibility
    const resolvedLocale: string =
      typeof locale === "string" && LANGUAGE_NAMES[locale]
        ? locale
        : isJapanese
          ? "ja"
          : "en"

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add GROQ_API_KEY to environment." },
        { status: 500 }
      )
    }

    const languageName = LANGUAGE_NAMES[resolvedLocale]
    const systemPrompt =
      resolvedLocale === "en"
        ? MOXIE_BASE_PROMPT
        : `${MOXIE_BASE_PROMPT}\n\nIMPORTANT: Always respond in ${languageName}. The user has selected ${languageName} as their language.`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API error: ${response.status}`)
    }

    const data = await response.json()
    const responseMessage = data.choices?.[0]?.message?.content || "I'm having trouble responding right now."

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error("Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: `AI Error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
