import type { ReactNode } from "react";

// Wrapper that scopes blog post typography. Styles live in globals.css
// under `.prose-blog` so they can use Tailwind v4 @theme tokens.
export function Prose({
  children,
  lang,
}: {
  children: ReactNode;
  lang?: string;
}) {
  return (
    <div className="prose-blog" data-lang={lang}>
      {children}
    </div>
  );
}
