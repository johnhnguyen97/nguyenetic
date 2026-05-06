import type { TocHeading } from "@/lib/blog/toc";

export function TableOfContents({
  headings,
  label,
}: {
  headings: TocHeading[];
  label: string;
}) {
  if (headings.length === 0) return null;
  return (
    <nav
      aria-label={label}
      className="hidden xl:block fixed top-32 right-8 w-56 max-h-[calc(100vh-12rem)] overflow-y-auto"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-jetbrains)] text-[var(--color-paper-dim)] mb-3">
        {label}
      </p>
      <ul className="space-y-2 text-xs">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: `${(h.depth - 2) * 0.75}rem` }}
          >
            <a
              href={`#${h.id}`}
              className="block leading-snug text-[var(--color-paper-dim)] hover:text-[var(--color-warm)] transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
