import { z } from "zod";
import { routing, type Locale } from "@/i18n/routing";

// YAML auto-parses unquoted `2026-05-05` as a Date object. Coerce both Date and string into a YYYY-MM-DD string.
const isoDate = z.preprocess(
  (val) => (val instanceof Date ? val.toISOString().slice(0, 10) : val),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
);

export const PostFrontmatter = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(40).max(200),
  date: isoDate,
  updated: isoDate.optional(),
  tags: z.array(z.string().min(1)).min(1).max(6),
  ogImage: z.string().optional(),
  lang: z.enum(routing.locales),
  draft: z.boolean().default(false),
  canonicalUrl: z.string().url().optional(),
  devToUrl: z.string().url().optional(),
  zennUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatter>;

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTimeMinutes: number;
  filePath: string;
};

export type { Locale };
