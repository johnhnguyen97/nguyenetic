import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { EmptyLocaleNotice } from "@/components/blog/EmptyLocaleNotice";
import { PostCard } from "@/components/blog/PostCard";
import { getPostsByLocale } from "@/lib/blog/loader";
import { routing, type Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "blog" });
  const path = safeLocale === routing.defaultLocale ? "/blog" : `/${safeLocale}/blog`;
  return {
    title: t("indexTitle"),
    description: t("indexDescription"),
    alternates: { canonical: path },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getPostsByLocale(locale);

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <header className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)] mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-[1.05] text-[var(--color-paper)]">
            {t("indexTitle")}
          </h1>
          <p className="mt-6 text-lg text-[var(--color-paper-dim)] max-w-2xl leading-relaxed">
            {t("indexDescription")}
          </p>
        </header>

        {posts.length === 0 ? (
          <EmptyLocaleNotice locale={locale} />
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
