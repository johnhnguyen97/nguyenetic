import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/loader";
import { SITE_URL } from "@/lib/blog/paths";
import { routing, type Locale } from "@/i18n/routing";
import { slugifyTag } from "@/lib/blog/tags";

function localePath(locale: Locale, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

// Build the alternates.languages map for a path that exists in every locale
// (e.g. the home page or the blog index).
function multiLocaleLanguages(path: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const loc of routing.locales) {
    langs[loc] = localePath(loc, path);
  }
  langs["x-default"] = localePath(routing.defaultLocale, path);
  return langs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: multiLocaleLanguages("/") },
    },
    ...routing.locales.map((loc) => ({
      url: localePath(loc, "/blog"),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: multiLocaleLanguages("/blog") },
    })),
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
    // For posts, only include hreflang for locales where THIS slug actually
    // exists. We don't fabricate sibling URLs that would 404.
    const siblings = posts.filter((q) => q.slug === p.slug);
    const languages: Record<string, string> = {};
    for (const sib of siblings) {
      languages[sib.lang] = localePath(sib.lang, `/blog/${sib.slug}`);
    }
    return {
      url: localePath(p.lang, `/blog/${p.slug}`),
      lastModified: new Date(`${p.updated ?? p.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: siblings.length > 1 ? { languages } : undefined,
    };
  });

  // Tag archives — emit one URL per (locale, unique tag-slug) pair that has at
  // least one post in that locale.
  const tagPairs = new Set<string>();
  for (const p of posts) {
    for (const tag of p.tags) {
      tagPairs.add(`${p.lang}::${slugifyTag(tag)}`);
    }
  }
  const tagEntries: MetadataRoute.Sitemap = Array.from(tagPairs).map((key) => {
    const [locale, tagSlug] = key.split("::");
    return {
      url: localePath(locale as Locale, `/blog/tags/${tagSlug}`),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    };
  });

  return [...staticEntries, ...postEntries, ...tagEntries];
}
