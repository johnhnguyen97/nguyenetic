import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import type { Post } from "@/lib/blog/schema";
import { TagPill } from "./TagPill";

function localePrefix(locale: Locale) {
  return locale === routing.defaultLocale ? "" : `/${locale}`;
}

function formatDate(iso: string, locale: Locale) {
  const dt = new Date(iso + "T00:00:00Z");
  return dt.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const href = `${localePrefix(locale)}/blog/${post.slug}`;
  return (
    <article className="group relative border-b border-[var(--color-neutral-border)] py-8 first:border-t">
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm)] rounded-sm"
      >
        <div className="flex items-baseline gap-3 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)] mb-2">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMinutes} min</span>
          {post.draft && (
            <>
              <span aria-hidden>·</span>
              <span className="text-[var(--color-warm)] uppercase tracking-wide">draft</span>
            </>
          )}
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight text-[var(--color-paper)] group-hover:text-[var(--color-warm)] transition-colors">
          {post.title}
        </h2>
        <p className="mt-3 text-base text-[var(--color-paper-dim)] max-w-2xl leading-relaxed">
          {post.description}
        </p>
      </Link>
      <ul className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li key={tag}>
            <TagPill tag={tag} locale={locale} />
          </li>
        ))}
      </ul>
    </article>
  );
}
