import type { Post } from "./schema";

// Score each candidate post by how many tags it shares with `current`,
// then sort by score desc and recency desc. Same-locale only.
export function relatedPosts(
  current: Post,
  all: Post[],
  limit = 3,
): Post[] {
  const currentTags = new Set(current.tags);
  return all
    .filter((p) => p.slug !== current.slug && p.lang === current.lang)
    .map((post) => ({
      post,
      score: post.tags.filter((t) => currentTags.has(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.post.date.localeCompare(a.post.date),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}
