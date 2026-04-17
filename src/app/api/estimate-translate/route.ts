import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ask } from "@/lib/ai/client";

const bodySchema = z.object({
  estimate: z.string().min(1).max(5000),
  industry: z.string().min(1),
  style: z.string().min(1),
  photos: z.number().int().min(0).max(4).default(0),
});

function stripJsonFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
}

const SYSTEM_PROMPT = `You are a translator for trade shops. You take a technical estimate in shop-speak and output a JSON object.

Output EXACTLY this JSON shape:
{
  "summary": "One sentence plain-English explanation of what's wrong and what's being done.",
  "lineItems": [
    { "label": "Human-readable description", "note": "Optional muted explanation", "qty": "1", "unit": "each", "price": "$X.XX" }
  ],
  "total": "$X.XX",
  "tax": "$X.XX or null",
  "rootCause": "1-2 paragraph friendly explanation of the root cause and why the fix is necessary.",
  "trustSignals": ["Signal 1", "Signal 2", "Signal 3"]
}

Rules:
- NEVER add work that wasn't in the input
- NEVER change prices from the original estimate
- Explain parts in plain English — "the fan that blows air through your outdoor unit" not "condenser fan motor"
- In rootCause, explain what caused the issue and why the fix is necessary in friendly language
- In trustSignals, list 3 things that reassure the customer this isn't an upsell (e.g. "capacitor replacement is industry-standard preventive" or "labor estimate is at or below published rate")
- If prices aren't in the estimate, omit price fields
- Match the tone style: friendly = warm and reassuring language, professional = respectful and clean, direct = no fluff just facts
- Output ONLY the JSON object. No markdown, no preamble, no explanation outside the JSON.`;

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

    const { estimate, industry, style, photos } = parsed.data;

    const userPrompt = `Industry: ${industry}
Translation style: ${style}
${photos > 0 ? `Photos attached: ${photos} (customer has visual evidence of the issue)\n` : ""}
Technical estimate to translate:
${estimate}`;

    const raw = await ask(userPrompt, {
      model: "sonnet",
      system: SYSTEM_PROMPT,
      maxTokens: 1500,
      temperature: 0.6,
      cache: false,
    });

    const cleaned = stripJsonFences(raw);

    let translation: {
      summary: string;
      lineItems: { label: string; note?: string; qty?: string; unit?: string; price?: string }[];
      total?: string;
      tax?: string | null;
      rootCause: string;
      trustSignals: string[];
    };

    try {
      translation = JSON.parse(cleaned);
      if (!translation.summary || !Array.isArray(translation.lineItems)) {
        throw new Error("Missing required fields");
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, translation });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
