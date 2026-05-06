import GithubSlugger from "github-slugger";

export type TocHeading = {
  depth: number;
  id: string;
  text: string;
};

// Parse h2/h3/h4 headings out of MDX source. We skip fenced code blocks so
// `## something` inside a code sample doesn't pollute the ToC. Slugs use the
// same `github-slugger` algorithm as `rehype-slug`, so anchors line up with
// the rendered HTML.
export function extractToc(mdxSource: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  const lines = mdxSource.split(/\r?\n/);

  let inFencedCode = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFencedCode = !inFencedCode;
      continue;
    }
    if (inFencedCode) continue;

    const match = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const rawText = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    headings.push({
      depth,
      id: slugger.slug(rawText),
      text: rawText,
    });
  }

  return headings;
}
