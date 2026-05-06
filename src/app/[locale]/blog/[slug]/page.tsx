import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Pluggable } from "unified";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Prose } from "@/components/blog/Prose";
import { mdxComponents } from "@/components/blog/MdxComponents";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { TagPill } from "@/components/blog/TagPill";
import {
  getAllPosts,
  getAllSlugLocalePairs,
  getPostBySlug,
} from "@/lib/blog/loader";
import { extractToc } from "@/lib/blog/toc";
import { relatedPosts } from "@/lib/blog/related";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/blog/paths";

export const dynamicParams = false;

export async function generateStaticParams() {
  const pairs = await getAllSlugLocalePairs();
  return pairs.map(({ slug, locale }) => ({ locale, slug }));
}

function postPath(locale: Locale, slug: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}/blog/${slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};

  const path = postPath(locale, slug);
  const canonical = post.canonicalUrl ?? `${SITE_URL}${path}`;
  const ogImage = post.ogImage ?? `/og/${slug}.png`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: "John Nguyen", url: SITE_URL }],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonical,
      publishedTime: `${post.date}T00:00:00.000Z`,
      modifiedTime: post.updated
        ? `${post.updated}T00:00:00.000Z`
        : undefined,
      authors: ["John Nguyen"],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
      creator: "@nguyenetic",
    },
  };
}

const rehypePlugins: Pluggable[] = [
  [rehypeShiki, { theme: "min-dark" }],
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
];

function formatDate(iso: string, locale: Locale) {
  const dt = new Date(iso + "T00:00:00Z");
  return dt.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const post = await getPostBySlug(slug, locale);
  if (!post || post.lang !== locale) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const allPosts = await getAllPosts();
  const toc = extractToc(post.content);
  const related = relatedPosts(post, allPosts, 3);
  const path = postPath(locale, slug);
  const canonical = post.canonicalUrl ?? `${SITE_URL}${path}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: `${post.date}T00:00:00.000Z`,
    dateModified: post.updated
      ? `${post.updated}T00:00:00.000Z`
      : `${post.date}T00:00:00.000Z`,
    author: {
      "@type": "Person",
      name: "John Nguyen",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Nguyenetic",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: post.lang,
    keywords: post.tags.join(", "),
    image: `${SITE_URL}${post.ogImage ?? `/og/${slug}.png`}`,
  };

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <nav className="mb-8 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)]">
          <Link
            href={locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`}
            className="hover:text-[var(--color-warm)] transition-colors"
          >
            ← {t("backToIndex")}
          </Link>
        </nav>

        <article>
          <header className="mb-10 pb-8 border-b border-[var(--color-neutral-border)]">
            <div className="flex items-baseline gap-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)] mb-4">
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              <span aria-hidden>·</span>
              <span>
                {post.readingTimeMinutes} {t("minutesShort")}
              </span>
              {post.draft && (
                <>
                  <span aria-hidden>·</span>
                  <span className="text-[var(--color-warm)] uppercase tracking-wide">
                    draft
                  </span>
                </>
              )}
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[var(--color-paper)]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg text-[var(--color-paper-dim)] leading-relaxed">
              {post.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <TagPill tag={tag} locale={locale} />
                </li>
              ))}
            </ul>
          </header>

          <Prose lang={post.lang}>
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{ mdxOptions: { rehypePlugins } }}
            />
          </Prose>

          <RelatedPosts
            posts={related}
            locale={locale}
            label={t("relatedPosts")}
          />
        </article>
      </main>

      <TableOfContents headings={toc} label={t("toc")} />
      <SiteFooter />
    </div>
  );
}
