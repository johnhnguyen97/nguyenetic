import Link from "next/link";
import { routing, type Locale } from "@/i18n/routing";
import { slugifyTag } from "@/lib/blog/tags";

function tagPath(tag: string, locale: Locale) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}/blog/tags/${slugifyTag(tag)}`;
}

const baseClasses =
  "inline-block text-[10px] uppercase tracking-[0.15em] font-[family-name:var(--font-jetbrains)] border border-[var(--color-neutral-border)] px-2 py-1 rounded-sm";

export function TagPill({
  tag,
  locale,
  linked = true,
  count,
}: {
  tag: string;
  locale: Locale;
  linked?: boolean;
  count?: number;
}) {
  const label = count !== undefined ? `${tag} · ${count}` : tag;
  if (linked) {
    return (
      <Link
        href={tagPath(tag, locale)}
        className={`${baseClasses} text-[var(--color-paper-dim)] hover:text-[var(--color-warm)] hover:border-[var(--color-warm)] transition-colors`}
      >
        {label}
      </Link>
    );
  }
  return (
    <span className={`${baseClasses} text-[var(--color-paper-dim)]`}>
      {label}
    </span>
  );
}
