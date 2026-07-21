export interface FaqItem {
  q: string;
  a: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

/**
 * Editorial comparison table rendered right after the ranked-list summary.
 * First column holds the ranked entry name; the other 3-5 columns compare
 * price, strengths and ideal use case. Kept crawlable for table rich results.
 */
export interface ComparisonTable {
  caption: string;
  columns: string[];
  rows: string[][];
}

export type ArticleCategory = 'top-10' | 'top-5' | 'news';

/** Editorial hero image (1200x675 JPEG under /images/articoli/). */
export interface ArticleImage {
  src: string;
  alt: string;
}

export type NewsSubcategory =
  | 'Bonus & Fisco'
  | 'Normative'
  | 'Mercato'
  | 'Innovazione'
  | 'Sostenibilità';

export interface Article {
  slug: string;
  /** SEO title (max ~60 chars) */
  title: string;
  /** optional different H1 */
  h1?: string;
  category: ArticleCategory;
  /** for news articles */
  subcategory?: NewsSubcategory;
  /** ~150 chars, used as meta description too */
  excerpt: string;
  keywords: string[];
  /** ISO date, spread across June–July 2026 */
  publishedAt: string;
  updatedAt: string;
  author: { name: string; role: string };
  /** minutes */
  readingTime: number;
  /** 3–5 Q&A for AEO/FAQ rich results */
  faq: FaqItem[];
  /** optional comparison table for Top-N listicles (table rich snippets) */
  table?: ComparisonTable;
  /** editorial hero image, attached from articleImages.ts in data/articles/index.ts */
  image?: ArticleImage;
  /** body, >= 4000 characters total of paragraph text */
  sections: ContentSection[];
}

export const SITE_NAME = 'Edilizia 24 Ore';
export const SITE_URL = 'https://www.edilizia24ore.it';
export const SITE_DESCRIPTION =
  "Il portale dell'edilizia italiana: news quotidiane su bonus edilizi, normative, mercato immobiliare, innovazione e sostenibilità, più guide e classifiche per professionisti e privati.";

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  'top-10': 'Top 10',
  'top-5': 'Top 5',
  news: 'News',
};

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  'top-10':
    'Le classifiche complete di Edilizia 24 Ore: i dieci migliori prodotti, materiali, software e professionisti del settore delle costruzioni, selezionati dalla redazione con criteri di qualità, prestazioni, prezzo e affidabilità. Ogni classifica è aggiornata al 2026 e nasce da test, schede tecniche e confronto diretto, per aiutarti a scegliere in modo consapevole per il tuo cantiere o la tua casa.',
  'top-5':
    'Le selezioni rapide di Edilizia 24 Ore: cinque scelte essenziali per andare dritti al punto. Errori da evitare in ristrutturazione, bonus da non perdere, tendenze di design, strumenti da cantiere e soluzioni smart: ogni lista Top 5 concentra il meglio della nostra esperienza redazionale in pochi punti chiari, verificati e aggiornati al 2026.',
  news: "Tutte le notizie dal mondo dell'edilizia e delle costruzioni: bonus e agevolazioni fiscali, normative e decreti, andamento del mercato immobiliare, innovazione di prodotto e di cantiere, sostenibilità ambientale. La redazione di Edilizia 24 Ore aggiorna quotidianamente questa sezione con articoli di approfondimento, dati ufficiali e guide pratiche per professionisti e privati.",
};

/* ------------------------------------------------------------------ */
/* News subcategories (thematic news-blog sections)                    */
/* ------------------------------------------------------------------ */

export type NewsSubcategorySlug =
  | 'bonus-fisco'
  | 'normative'
  | 'mercato'
  | 'innovazione'
  | 'sostenibilita';

export const NEWS_SUBCATEGORY_BY_SLUG: Record<NewsSubcategorySlug, NewsSubcategory> = {
  'bonus-fisco': 'Bonus & Fisco',
  normative: 'Normative',
  mercato: 'Mercato',
  innovazione: 'Innovazione',
  sostenibilita: 'Sostenibilità',
};

export const NEWS_SUBCATEGORY_SLUG_BY_NAME: Record<NewsSubcategory, NewsSubcategorySlug> = {
  'Bonus & Fisco': 'bonus-fisco',
  Normative: 'normative',
  Mercato: 'mercato',
  Innovazione: 'innovazione',
  Sostenibilità: 'sostenibilita',
};

export const NEWS_SUBCATEGORY_SLUGS = Object.keys(
  NEWS_SUBCATEGORY_BY_SLUG,
) as NewsSubcategorySlug[];

export const NEWS_SUBCATEGORY_H1: Record<NewsSubcategorySlug, string> = {
  'bonus-fisco': 'Bonus e Fisco: agevolazioni edilizie 2026',
  normative: 'Normative edilizie: leggi e decreti',
  mercato: 'Mercato immobiliare e delle costruzioni',
  innovazione: 'Innovazione in edilizia e cantiere',
  sostenibilita: 'Sostenibilità edilizia e green building',
};

export const NEWS_SUBCATEGORY_DESCRIPTIONS: Record<NewsSubcategorySlug, string> = {
  'bonus-fisco':
    "Bonus ristrutturazioni 2026, Superbonus, Conto Termico 3.0 e tutte le agevolazioni fiscali per la casa e il cantiere: in questa sezione la redazione di Edilizia 24 Ore spiega aliquote, massimali di spesa, requisiti e scadenze dei principali incentivi edilizi. Trovi guide pratiche su detrazioni, cessione del credito, pratiche ENEA e adempimenti fiscali, con esempi concreti e aggiornamenti continui su decreti e leggi di bilancio. Tutto quello che serve a privati, amministratori e professionisti per non perdere nemmeno un bonus edilizio.",
  normative:
    "Normative edilizie, decreti, recepimenti di direttive europee e regole di cantiere: questa sezione di Edilizia 24 Ore monitora l'evoluzione del quadro legislativo delle costruzioni in Italia. Dalla direttiva Case Green ai criteri ambientali minimi (CAM), dalla sicurezza nei cantieri alle procedure autorizzative, analizziamo ogni provvedimento con linguaggio chiaro e taglio operativo. Schede di sintesi, scadenze, sanzioni e impatti pratici per imprese, tecnici e committenti, sempre aggiornate alle ultime versioni dei testi ufficiali.",
  mercato:
    "Mercato immobiliare, prezzi delle case, costo dei materiali da costruzione e andamento del settore edile: in questa sezione Edilizia 24 Ore raccoglie dati, rapporti e analisi sull'economia delle costruzioni in Italia. Dai rapporti ANCE alle rilevazioni sui prezzi al metro quadro, dall'andamento dei mutui alle previsioni per il 2026, offriamo un quadro chiaro e verificato per chi investe, costruisce o ristruttura. Numeri ufficiali, commenti della redazione e scenari per imprese, professionisti e privati.",
  innovazione:
    "Innovazione in edilizia, nuove tecnologie di cantiere e materiali d'avanguardia: questa sezione di Edilizia 24 Ore racconta come sta cambiando il modo di costruire in Italia. Stampa 3D per l'edilizia, calcestruzzi a basso impatto, fotovoltaico plug & play, software BIM e domotica: testiamo e raccontiamo prodotti, processi e soluzioni digitali che rendono cantieri e abitazioni più efficienti. Notizie, casi studio e schede tecniche per imprese, progettisti e appassionati di edilizia del futuro.",
  sostenibilita:
    "Sostenibilità in edilizia, efficienza energetica e green building: in questa sezione Edilizia 24 Ore segue la transizione ecologica del settore delle costruzioni. Edilizia in legno e CLT, materiali riciclati, rigenerazione urbana, certificazioni ambientali e riduzione delle emissioni di cantiere: raccontiamo progetti, norme e tecnologie che rendono gli edifici più sostenibili. Approfondimenti e guide per progettisti, imprese e cittadini che vogliono costruire e ristrutturare rispettando l'ambiente.",
};

/* ------------------------------------------------------------------ */
/* Guide e Classifiche hub (/guide, replaces Top 10 / Top 5 sections)  */
/* ------------------------------------------------------------------ */

export const GUIDE_H1 = "Guide e Classifiche dell'edilizia";

export const GUIDE_DESCRIPTION =
  "Tutte le guide e le classifiche di Edilizia 24 Ore in un'unica pagina: le classifiche Top 10 con i migliori prodotti, materiali, software e professionisti delle costruzioni, e le selezioni Top 5 con le scelte essenziali della redazione. Pompe di calore, infissi, cappotto termico, bonus edilizi, strumenti da cantiere, domotica e design: ogni guida nasce da test, schede tecniche e confronto diretto, è aggiornata al 2026 e ti aiuta a scegliere in modo consapevole per il tuo cantiere o la tua casa.";
