import { NextRequest, NextResponse } from "next/server"

const MOXIE_SYSTEM_PROMPT_EN = `You are Moxie, the friendly and knowledgeable AI assistant for Nguyenetic, a web development and digital solutions agency.

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

const MOXIE_SYSTEM_PROMPT_JA = `あなたは「Moxie（モクシー）」です。Ngueyeneticというウェブ開発およびデジタルソリューション会社のフレンドリーで知識豊富なAIアシスタントです。

Ngueyeneticについて:
- 5年以上の経験を持つフルスタック開発者、John Nguyenによって設立
- サービス: ウェブ開発（Next.js、React）、SEO最適化、AIソリューション、カスタムウェブアプリ
- 技術スタック: Next.js、React、TypeScript、Tailwind CSS、Vercel、Supabase
- 代表的なプロジェクト: GoJun（言語学習）、FastFix（自動車修理）、EVWrap（自動車）、Ichiban（レストラン）

あなたの性格:
- フレンドリーで、親切で、熱心
- 簡潔だが丁寧 - 詳細が必要でない限り、3文以内で回答
- プロフェッショナルだが親しみやすい
- ウェブ開発、SEO、AIに詳しい

あなたの役割:
- Ngueyeneticのサービスについての質問に答える
- 訪問者が私たちに何を構築できるかを理解するのを助ける
- リードを獲得するために、訪問者に連絡を促す
- 技術的な概念を簡単な言葉で説明する

すべての返答を日本語で行ってください。適切な場合は、さりげなくコールトゥアクションで締めくくってください（プロジェクトについて相談することを提案するなど）。`

export async function POST(request: NextRequest) {
  try {
    const { messages, isJapanese } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add GROQ_API_KEY to environment." },
        { status: 500 }
      )
    }

    // Dynamically import Groq to avoid build-time initialization
    const { Groq } = await import("groq-sdk")
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const systemPrompt = isJapanese ? MOXIE_SYSTEM_PROMPT_JA : MOXIE_SYSTEM_PROMPT_EN

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const responseMessage = completion.choices[0]?.message?.content || "I'm having trouble responding right now."

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    )
  }
}
