import type { ReactNode } from "react";

const variants = {
  note: {
    border: "border-[var(--color-neutral-border)]",
    accent: "text-[var(--color-paper-dim)]",
    label: "NOTE",
  },
  info: {
    border: "border-[var(--color-warm)]",
    accent: "text-[var(--color-warm)]",
    label: "INFO",
  },
  warn: {
    border: "border-[var(--color-warm-hover)]",
    accent: "text-[var(--color-warm-hover)]",
    label: "WARN",
  },
} as const;

type CalloutVariant = keyof typeof variants;

export function Callout({
  variant = "note",
  children,
}: {
  variant?: CalloutVariant;
  children: ReactNode;
}) {
  const v = variants[variant];
  return (
    <aside
      className={`my-6 border-l-2 ${v.border} pl-5 py-1 not-prose-inherit`}
    >
      <div
        className={`${v.accent} font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] mb-2`}
      >
        {v.label}
      </div>
      <div className="text-[var(--color-paper)] leading-relaxed">{children}</div>
    </aside>
  );
}
