import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "./Callout";

// Server-side MDX component map. Code blocks are styled by Shiki + globals.css
// (see .prose-blog rules); we intentionally don't override `code`/`pre` here so
// Shiki's inline styles survive.

export const mdxComponents = {
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isExternal =
      typeof href === "string" && (href.startsWith("http") || href.startsWith("mailto:"));
    if (isExternal) {
      return (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    }
    return <Link href={href ?? "#"}>{children}</Link>;
  },
  Callout,
};
