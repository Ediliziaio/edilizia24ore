import { articles } from '@/data/articles';
import type { Article } from '@/data/types';

/**
 * Tag system: tags are derived from article keywords at build time.
 * A keyword becomes a tag when it is used by >= 2 articles; the list is
 * limited to the top 20 tags by frequency (see TAG_MIN_ARTICLES / TAG_LIMIT).
 */

export interface TagInfo {
  /** URL slug, e.g. "conto-termico-3-0" */
  slug: string;
  /** Display label, e.g. "Conto termico 3.0" */
  label: string;
  /** Normalized keyword used for matching */
  key: string;
  /** Number of articles using this tag */
  count: number;
}

export const TAG_MIN_ARTICLES = 2;
export const TAG_LIMIT = 20;

const normalizeKeyword = (value: string): string => value.trim().toLowerCase();

/** URL-safe slug for a tag (lowercase, accents stripped, dashes). */
export function slugifyTag(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildTags(): TagInfo[] {
  const freq = new Map<string, number>();
  for (const article of articles) {
    const seen = new Set<string>();
    for (const keyword of article.keywords) {
      const key = normalizeKeyword(keyword);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count >= TAG_MIN_ARTICLES)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'it'))
    .slice(0, TAG_LIMIT)
    .map(([key, count]) => ({
      slug: slugifyTag(key),
      label: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      count,
    }));
}

/** All site tags, ordered by frequency (top 20, >= 2 articles each). */
export const tags: TagInfo[] = buildTags();

export function tagUrl(tag: Pick<TagInfo, 'slug'>): string {
  return `/tag/${tag.slug}`;
}

export function getTagBySlug(slug: string): TagInfo | undefined {
  return tags.find((t) => t.slug === slug);
}

/** Articles carrying this tag, most recent first (articles are pre-sorted). */
export function getArticlesByTag(slug: string): Article[] {
  const tag = getTagBySlug(slug);
  if (!tag) return [];
  return articles.filter((a) => a.keywords.some((k) => normalizeKeyword(k) === tag.key));
}

/** Other tags sharing at least one article with the given tag (best overlap first). */
export function getRelatedTags(slug: string, limit = 8): TagInfo[] {
  const current = getTagBySlug(slug);
  if (!current) return tags.filter((t) => t.slug !== slug).slice(0, limit);
  const currentSlugs = new Set(getArticlesByTag(slug).map((a) => a.slug));
  return tags
    .filter((t) => t.slug !== slug)
    .map((t) => ({
      tag: t,
      shared: getArticlesByTag(t.slug).filter((a) => currentSlugs.has(a.slug)).length,
    }))
    .sort((a, b) => b.shared - a.shared || b.tag.count - a.tag.count)
    .slice(0, limit)
    .map((s) => s.tag);
}
