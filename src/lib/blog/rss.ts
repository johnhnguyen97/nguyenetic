import "server-only";

import { Feed } from "feed";
import { getPostsByLocale } from "./loader";
import { SITE_URL } from "./paths";
import { routing, localeNames, type Locale } from "@/i18n/routing";

function postUrl(locale: Locale, slug: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}/blog/${slug}`;
}

function feedUrl(locale: Locale): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}/blog/feed.xml`;
}

export async function buildFeedXml(locale: Locale): Promise<string> {
  const posts = await getPostsByLocale(locale);

  const feed = new Feed({
    title: `Nguyenetic — ${localeNames[locale]}`,
    description:
      "Notes from building Tashinamu, agency client work, and learning Japanese as a Vietnamese-American engineer headed to Japan.",
    id: feedUrl(locale),
    link: `${SITE_URL}${locale === routing.defaultLocale ? "" : `/${locale}`}/blog`,
    language: locale,
    image: `${SITE_URL}/og-image.png`,
    favicon: `${SITE_URL}/favicon.svg`,
    copyright: `© ${new Date().getFullYear()} John Nguyen`,
    feedLinks: { rss: feedUrl(locale) },
    author: {
      name: "John Nguyen",
      email: "hello@nguyenetic.com",
      link: SITE_URL,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: postUrl(locale, post.slug),
      link: post.canonicalUrl ?? postUrl(locale, post.slug),
      description: post.description,
      content: post.description,
      author: [
        { name: "John Nguyen", email: "hello@nguyenetic.com", link: SITE_URL },
      ],
      date: new Date(`${post.updated ?? post.date}T00:00:00.000Z`),
      published: new Date(`${post.date}T00:00:00.000Z`),
      category: post.tags.map((t) => ({ name: t })),
      image: post.ogImage
        ? `${SITE_URL}${post.ogImage}`
        : `${SITE_URL}/og/${post.slug}.png`,
    });
  }

  return feed.rss2();
}
