import path from "node:path";

export const REPO_ROOT = process.cwd();
export const CONTENT_DIR = path.join(REPO_ROOT, "content", "blog");
export const PUBLIC_BLOG_DIR = path.join(REPO_ROOT, "public", "blog");
export const PUBLIC_OG_DIR = path.join(REPO_ROOT, "public", "og");
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nguyenetic.com";
