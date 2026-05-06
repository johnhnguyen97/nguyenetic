import Link from "next/link";
import type { Post } from "@/lib/blog/schema";
import { routing, type Locale } from "@/i18n/routing";

function postPath(post: Post) {
  const prefix = post.lang === routing.defaultLocale ? "" : `/${post.lang}`;
  return `${prefix}/blog/${post.slug}`;
}

export function RelatedPosts({
  posts,
  locale,
  label,
}: {
  posts: Post[];
  locale: Locale;
  label: string;
}) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-16 pt-10 border-t border-[var(--color-neutral-border)]">
      <p className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)] mb-4">
        {label}
      </p>
      <ul className="space-y-4">
        {posts.map((post) => {
          const dt = new Date(post.date + "T00:00:00Z").toLocaleDateString(
            locale,
            { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" },
          );
          return (
            <li key={post.slug}>
              <Link
                href={postPath(post)}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm)] rounded-sm"
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-paper)] group-hover:text-[var(--color-warm)] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="mt-1 text-xs font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)]">
                  {dt} · {post.readingTimeMinutes} min
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
