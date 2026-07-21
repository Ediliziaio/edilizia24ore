import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from '@/data/types';

export interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  /** og:image:width / og:image:height (editorial images are 1200x675) */
  ogImageWidth?: number;
  ogImageHeight?: number;
  keywords?: string[];
  robots?: string;
  jsonLd?: Record<string, unknown>[];
  /** article meta (og:article:*) */
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSONLD_ATTR = 'data-seo-head-jsonld';

/* ------------------------------------------------------------------ */
/* SSR / prerender support                                             */
/* During react-dom/server rendering there is no document, so SeoHead  */
/* records its props in a module-level slot instead. The prerender     */
/* entry reads them back right after renderToString and turns them     */
/* into static HTML head tags via seoPropsToHeadHtml().                */
/* ------------------------------------------------------------------ */

let lastSsrProps: SeoHeadProps | null = null;

/** Read and clear the SeoHead props captured during SSR (prerender only). */
export function takeSsrSeoProps(): SeoHeadProps | null {
  const props = lastSsrProps;
  lastSsrProps = null;
  return props;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function fullSeoTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

/** Serialize SeoHead props to static HTML head tags (prerender only). */
export function seoPropsToHeadHtml(props: SeoHeadProps): string {
  const {
    title,
    description,
    canonical,
    ogType = 'website',
    ogImage = `${SITE_URL}/logo.png`,
    ogImageWidth,
    ogImageHeight,
    keywords,
    robots = 'index, follow, max-image-preview:large, max-snippet:-1',
    jsonLd = [],
    publishedTime,
    modifiedTime,
    author,
    section,
  } = props;

  const fullTitle = fullSeoTitle(title);
  const canonicalUrl = canonical ?? SITE_URL + '/';
  const e = escapeHtmlAttr;
  const tags: string[] = [
    `<title>${e(fullTitle)}</title>`,
    `<meta name="description" content="${e(description)}" />`,
    `<meta name="robots" content="${e(robots)}" />`,
  ];
  if (keywords?.length) tags.push(`<meta name="keywords" content="${e(keywords.join(', '))}" />`);
  tags.push(
    `<link rel="canonical" href="${e(canonicalUrl)}" />`,
    `<meta property="og:title" content="${e(fullTitle)}" />`,
    `<meta property="og:description" content="${e(description)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${e(canonicalUrl)}" />`,
    `<meta property="og:image" content="${e(ogImage)}" />`,
    ...(ogImageWidth ? [`<meta property="og:image:width" content="${ogImageWidth}" />`] : []),
    ...(ogImageHeight ? [`<meta property="og:image:height" content="${ogImageHeight}" />`] : []),
    `<meta property="og:site_name" content="${e(SITE_NAME)}" />`,
    `<meta property="og:locale" content="it_IT" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(fullTitle)}" />`,
    `<meta name="twitter:description" content="${e(description)}" />`,
    `<meta name="twitter:image" content="${e(ogImage)}" />`,
  );
  if (ogType === 'article') {
    if (publishedTime) tags.push(`<meta property="article:published_time" content="${e(publishedTime)}" />`);
    if (modifiedTime) tags.push(`<meta property="article:modified_time" content="${e(modifiedTime)}" />`);
    if (author) tags.push(`<meta property="article:author" content="${e(author)}" />`);
    if (section) tags.push(`<meta property="article:section" content="${e(section)}" />`);
  }
  for (const data of jsonLd) {
    const json = JSON.stringify(data).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json" ${JSONLD_ATTR}="true">${json}</script>`);
  }
  return tags.join('\n    ');
}

/**
 * Per-route SEO head manager: sets document.title, meta tags, canonical
 * and injects JSON-LD script tags. Cleans up JSON-LD on unmount/change.
 */
export default function SeoHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = `${SITE_URL}/logo.png`,
  ogImageWidth,
  ogImageHeight,
  keywords,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1',
  jsonLd = [],
  publishedTime,
  modifiedTime,
  author,
  section,
}: SeoHeadProps) {
  // SSR (prerender): no document — record props for the prerender entry.
  if (typeof document === 'undefined') {
    lastSsrProps = {
      title,
      description,
      canonical,
      ogType,
      ogImage,
      ogImageWidth,
      ogImageHeight,
      keywords,
      robots,
      jsonLd,
      publishedTime,
      modifiedTime,
      author,
      section,
    };
    return null;
  }

  useEffect(() => {
    const fullTitle = fullSeoTitle(title);
    document.title = fullTitle;
    const canonicalUrl = canonical ?? SITE_URL + '/';

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    if (keywords?.length) upsertMeta('name', 'keywords', keywords.join(', '));

    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);
    if (ogImageWidth) upsertMeta('property', 'og:image:width', String(ogImageWidth));
    else removeMeta('property', 'og:image:width');
    if (ogImageHeight) upsertMeta('property', 'og:image:height', String(ogImageHeight));
    else removeMeta('property', 'og:image:height');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'it_IT');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    if (ogType === 'article') {
      if (publishedTime) upsertMeta('property', 'article:published_time', publishedTime);
      if (modifiedTime) upsertMeta('property', 'article:modified_time', modifiedTime);
      if (author) upsertMeta('property', 'article:author', author);
      if (section) upsertMeta('property', 'article:section', section);
    }

    upsertCanonical(canonicalUrl);

    // JSON-LD injection (remove prerendered/previous ones first to avoid duplicates)
    document.head
      .querySelectorAll(`script[${JSONLD_ATTR}]`)
      .forEach((s) => s.parentNode?.removeChild(s));
    const scripts: HTMLScriptElement[] = [];
    jsonLd.forEach((data) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(JSONLD_ATTR, 'true');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      scripts.push(script);
    });

    return () => {
      scripts.forEach((s) => s.parentNode?.removeChild(s));
    };
  }, [
    title,
    description,
    canonical,
    ogType,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    robots,
    publishedTime,
    modifiedTime,
    author,
    section,
    keywords,
    jsonLd,
  ]);

  return null;
}
