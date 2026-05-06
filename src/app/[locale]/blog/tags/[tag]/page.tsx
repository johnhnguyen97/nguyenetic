import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/blog/PostCard";
import {
  getAllPosts,
  getAllTagsByLocale,
  getPostsByLocale,
} from "@/lib/blog/loader";
import { slugifyTag } from "@/lib/blog/tags";
import { routing, type Locale } from "@/i18n/routing";

export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await getAllPosts();
  const pairs = new Set<string>();
  for (const p of all) {
    for (const tag of p.tags) {
      pairs.add(`${p.lang}::${slugifyTag(tag)}`);
    }
  }
  return Array.from(pairs).map((key) => {
    const [locale, tag] = key.split("::");
    return { locale, tag };
  });
}

async function findTagDisplay(locale: Locale, tagSlug: string) {
  const all = await getAllTagsByLocale(locale);
  const match = all.find(({ tag }) => slugifyTag(tag) === tagSlug);
  return match;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const match = await findTagDisplay(locale, tag);
  if (!match) return {};
  const t = await getTranslations({ locale, namespace: "blog" });
  const title = t("tagArchiveTitle", { tag: match.tag });
  return {
    title,
    description: t("tagArchiveDescription", { tag: match.tag, count: match.count }),
  };
}

export default async function TagArchivePage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tagInfo = await findTagDisplay(locale, tag);
  if (!tagInfo) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const all = await getPostsByLocale(locale);
  const posts = all.filter((p) =>
    p.tags.some((tg) => slugifyTag(tg) === tag),
  );

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <nav className="mb-8 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)]">
          <Link
            href={locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`}
            className="hover:text-[var(--color-warm)] transition-colors"
          >
            ← {t("backToIndex")}
          </Link>
        </nav>

        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)] mb-3">
            {t("tagEyebrow")}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-tight text-[var(--color-paper)]">
            {tagInfo.tag}
          </h1>
          <p className="mt-3 text-[var(--color-paper-dim)] font-[family-name:var(--font-jetbrains)] text-sm">
            {t("postsCount", { count: tagInfo.count })}
          </p>
        </header>

        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </main>
    </div>
  );
}
