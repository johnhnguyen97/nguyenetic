// Build-time OG image generator. For each post in /content/blog/, renders a
// 1200×630 PNG to /public/og/<slug>.png via Satori (JSX → SVG) + @resvg/resvg-js
// (SVG → PNG). Idempotent: skips a post if its OG PNG mtime is newer than
// its index.mdx mtime.
//
// JP posts are skipped with a warning until Noto Serif JP is registered in
// Phase 6; the [slug] page falls back to a default OG image until then.

import "tsx";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

import { loadFontsForLocale } from "./og-fonts";

const REPO_ROOT = process.cwd();
const CONTENT_DIR = path.join(REPO_ROOT, "content", "blog");
const OG_DIR = path.join(REPO_ROOT, "public", "og");

type PostMeta = {
  slug: string;
  title: string;
  tags: string[];
  lang: string;
  draft?: boolean;
  mtime: number;
};

function listPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name);

  const out: PostMeta[] = [];
  for (const slug of slugs) {
    const file = path.join(CONTENT_DIR, slug, "index.mdx");
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, "utf-8");
    const { data } = matter(raw);
    out.push({
      slug,
      title: String(data.title ?? slug),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      lang: String(data.lang ?? "en"),
      draft: Boolean(data.draft),
      mtime: fs.statSync(file).mtimeMs,
    });
  }
  return out;
}

function shouldSkip(slug: string, postMtime: number): boolean {
  const out = path.join(OG_DIR, `${slug}.png`);
  if (!fs.existsSync(out)) return false;
  return fs.statSync(out).mtimeMs >= postMtime;
}

// Satori accepts a tree of {type, props} objects. We use `any` at the
// boundary because the React types over-constrain plain prop bags.
type SatoriNode = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };

function titleFontFor(locale: string): string {
  // Noto Serif JP is the JP-character title font; Instrument Serif is Latin.
  // Listing both lets Satori use Noto for kanji/kana and Instrument for Latin.
  return locale === "ja"
    ? "Noto Serif JP, Instrument Serif"
    : "Instrument Serif";
}

function ogCard(post: PostMeta): SatoriNode {
  // Plain JSX-like object tree so Satori can consume it without React runtime.
  // Tokens chosen to match the live --color-ink / --color-warm palette.
  const ink = "#0a0712";
  const inkSoft = "#16101f";
  const paper = "#f0e8db";
  const paperDim = "#9a8b78";
  const warm = "#e6a55a";
  const border = "#2a2334";

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: ink,
        padding: "70px 90px",
        position: "relative",
        fontFamily: titleFontFor(post.lang),
      },
      children: [
        // Top wordmark — bar separator instead of a glyph (avoids glyph fallback issues)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              letterSpacing: "0.25em",
              color: paperDim,
              textTransform: "uppercase",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 28,
                    height: 2,
                    background: warm,
                    display: "flex",
                  },
                },
              },
              "NGUYENETIC",
            ],
          },
        },
        // Spacer
        {
          type: "div",
          props: { style: { flex: "1 1 auto" } },
        },
        // Title
        {
          type: "div",
          props: {
            style: {
              fontFamily: titleFontFor(post.lang),
              fontSize: post.lang === "ja" ? 64 : 78,
              lineHeight: 1.15,
              color: paper,
              maxWidth: 980,
              letterSpacing: "-0.01em",
              display: "flex",
            },
            children: post.title,
          },
        },
        // Tags row
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 36,
            },
            children: post.tags.slice(0, 4).map((tag) => ({
              type: "div",
              props: {
                style: {
                  fontFamily: "JetBrains Mono",
                  fontSize: 18,
                  letterSpacing: "0.15em",
                  color: paperDim,
                  textTransform: "uppercase",
                  border: `1px solid ${border}`,
                  borderRadius: 4,
                  padding: "6px 14px",
                  background: inkSoft,
                  display: "flex",
                },
                children: tag,
              },
            })),
          },
        },
        // Right-edge warm bar
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: 6,
              background: warm,
            },
          },
        },
      ],
    },
  };
}

async function renderOne(post: PostMeta) {
  const fonts = loadFontsForLocale(post.lang);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(ogCard(post) as any, {
    width: 1200,
    height: 630,
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    })),
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();
  fs.mkdirSync(OG_DIR, { recursive: true });
  fs.writeFileSync(path.join(OG_DIR, `${post.slug}.png`), png);
}

async function main() {
  const posts = listPosts();
  if (posts.length === 0) {
    console.log("[og] no posts found, nothing to do");
    return;
  }

  let rendered = 0;
  let skipped = 0;

  for (const post of posts) {
    if (post.draft && process.env.NODE_ENV === "production") continue;
    if (shouldSkip(post.slug, post.mtime)) {
      skipped++;
      continue;
    }
    if (post.lang !== "en" && post.lang !== "ja") {
      console.warn(
        `[og] skipping ${post.slug} (lang=${post.lang}): only en + ja supported so far`,
      );
      continue;
    }
    await renderOne(post);
    console.log(`[og] rendered  /public/og/${post.slug}.png  (lang=${post.lang})`);
    rendered++;
  }

  console.log(`[og] done: rendered=${rendered} skipped(unchanged)=${skipped}`);
}

main().catch((err) => {
  console.error("[og] generation failed:", err);
  process.exit(1);
});
