import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const LeadSchema = z.object({
  appSlug: z.string().min(1),
  context: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  source: z.string().default("web"),
});

const DATA_FILE = path.join(process.cwd(), "data", "leads.json");

async function readLeads(): Promise<{ leads: object[] }> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as { leads: object[] };
  } catch {
    return { leads: [] };
  }
}

async function writeLeads(data: { leads: object[] }): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(e => e.message).join(", ");
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const lead = {
    id,
    ...parsed.data,
    capturedAt: new Date().toISOString(),
  };

  try {
    const data = await readLeads();
    data.leads.push(lead);
    await writeLeads(data);
  } catch (err) {
    console.error("leads write error:", err);
    return NextResponse.json({ ok: false, error: "Storage error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id });
}
