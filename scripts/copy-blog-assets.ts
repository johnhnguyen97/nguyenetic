// Mirror co-located images from /content/blog/<slug>/*.{png,jpg,jpeg,svg,webp,gif}
// into /public/blog/<slug>/* so MDX can reference them with absolute paths.
// Idempotent: only copies if the source is newer than the target.

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const CONTENT_DIR = path.join(REPO_ROOT, "content", "blog");
const PUBLIC_BLOG_DIR = path.join(REPO_ROOT, "public", "blog");
const ASSET_EXTS = new Set([".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".avif"]);

function copyAsset(src: string, dst: string): boolean {
  if (fs.existsSync(dst)) {
    const sm = fs.statSync(src).mtimeMs;
    const dm = fs.statSync(dst).mtimeMs;
    if (dm >= sm) return false;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  return true;
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log("[assets] no content/blog dir, nothing to do");
    return;
  }
  const slugs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name);

  let copied = 0;
  let skipped = 0;
  for (const slug of slugs) {
    const slugDir = path.join(CONTENT_DIR, slug);
    const files = fs.readdirSync(slugDir, { withFileTypes: true });
    for (const f of files) {
      if (!f.isFile()) continue;
      const ext = path.extname(f.name).toLowerCase();
      if (!ASSET_EXTS.has(ext)) continue;
      const src = path.join(slugDir, f.name);
      const dst = path.join(PUBLIC_BLOG_DIR, slug, f.name);
      if (copyAsset(src, dst)) copied++;
      else skipped++;
    }
  }

  console.log(`[assets] done: copied=${copied} skipped(unchanged)=${skipped}`);
}

main();
