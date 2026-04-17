import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ask } from "@/lib/ai/client";

const bodySchema = z.object({
  review: z.string().min(1).max(2000),
  industry: z.string().min(1),
  voice: z.string().min(1),
  refineInstruction: z.string().optional(),
  previousDraft: z.string().optional(),
});

function stripJsonFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
}

function buildSystemPrompt(industry: string, voice: string): string {
  return `You are an expert review responder for ${industry} businesses. You write replies that are human, specific, and never robotic.

Output EXACTLY 3 replies as a JSON array of objects with this shape:
[{"label": string, "reply": string, "rationale": string}]

Rules:
- Keep each reply under 160 characters
- Write ALL 3 drafts in the ${voice} tone — never override it with a different tone
- Vary each draft by angle: draft 1 is empathetic (leads with acknowledgment), draft 2 is factual (centers on what happened/will happen), draft 3 is action-oriented (focuses on next steps)
- Reference specific details from the review — never give generic responses
- Never apologize for something that wasn't the business's fault
- Never use exclamation points in the firm draft
- The "rationale" is one sentence explaining WHY this approach works for this review
- Output ONLY the JSON array. No markdown, no preamble.`;
}

function buildRefineSystemPrompt(): string {
  return `You are an expert review responder. Refine the given draft reply according to the instruction.

Output EXACTLY 1 reply as a JSON array with a single object:
[{"label": string, "reply": string, "rationale": string}]

Rules:
- Keep the reply under 160 characters
- The label should reflect the refinement (e.g., "Shortened", "Warmer", "More Apologetic", or a custom descriptor)
- The rationale explains what changed and why it works better
- Output ONLY the JSON array. No markdown, no preamble.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request: " + parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { review, industry, voice, refineInstruction, previousDraft } = parsed.data;

    let systemPrompt: string;
    let userPrompt: string;

    if (refineInstruction && previousDraft) {
      systemPrompt = buildRefineSystemPrompt();
      userPrompt = `Original review:\n${review}\n\nPrevious draft:\n${previousDraft}\n\nRefinement instruction: ${refineInstruction}`;
    } else {
      systemPrompt = buildSystemPrompt(industry, voice);
      userPrompt = `Review to respond to:\n${review}`;
    }

    const raw = await ask(userPrompt, {
      model: "haiku",
      system: systemPrompt,
      maxTokens: 600,
      temperature: 0.8,
      cache: false,
    });

    const cleaned = stripJsonFences(raw);

    let drafts: { label: string; reply: string; rationale: string }[];
    try {
      drafts = JSON.parse(cleaned);
      if (!Array.isArray(drafts)) throw new Error("Not an array");
    } catch {
      drafts = [{ label: "Draft", reply: cleaned.slice(0, 300), rationale: "AI response parsed as plain text." }];
    }

    return NextResponse.json({ ok: true, drafts });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
