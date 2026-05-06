import { TagPill } from "./TagPill";
import type { Locale } from "@/i18n/routing";

export function TagList({
  tags,
  locale,
}: {
  tags: { tag: string; count: number }[];
  locale: Locale;
}) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => (
        <li key={tag}>
          <TagPill tag={tag} locale={locale} count={count} />
        </li>
      ))}
    </ul>
  );
}
