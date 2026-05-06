import "server-only";

import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

import { CONTENT_DIR } from "./paths";
import { PostFrontmatter, type Post } from "./schema";
import type { Locale } from "@/i18n/routing";

async function readPost(slug: string): Promise<Post> {
  const filePath = path.join(CONTENT_DIR, slug, "index.mdx");
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const parsed = PostFrontmatter.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${filePath}\n${issues}`);
  }

  const stats = readingTime(content);

  return {
    ...parsed.data,
    slug,
    content,
    readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
    filePath,
  };
}

async function listPostSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
      .map((e) => e.name)
      .sort();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const slugs = await listPostSlugs();
  const posts = await Promise.all(slugs.map(readPost));
  const visible =
    process.env.NODE_ENV === "production"
      ? posts.filter((p) => !p.draft)
      : posts;
  return visible.sort((a, b) => b.date.localeCompare(a.date));
});

export const getPostsByLocale = cache(
  async (locale: Locale): Promise<Post[]> => {
    const all = await getAllPosts();
    return all.filter((p) => p.lang === locale);
  },
);

export const getPostBySlug = cache(
  async (slug: string, locale: Locale): Promise<Post | null> => {
    try {
      const post = await readPost(slug);
      if (process.env.NODE_ENV === "production" && post.draft) return null;
      if (post.lang !== locale) return null;
      return post;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  },
);

export const getAllSlugLocalePairs = cache(
  async (): Promise<{ slug: string; locale: Locale }[]> => {
    const all = await getAllPosts();
    return all.map((p) => ({ slug: p.slug, locale: p.lang }));
  },
);

export const getAllTagsByLocale = cache(
  async (locale: Locale): Promise<{ tag: string; count: number }[]> => {
    const posts = await getPostsByLocale(locale);
    const counts = new Map<string, number>();
    for (const p of posts) {
      for (const tag of p.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  },
);
