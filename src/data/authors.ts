/**
 * Editorial roster — single source of truth for authorship.
 *
 * E-E-A-T: every article byline MUST resolve to one of these people, the same
 * ones listed on /chi-siamo, each with a dedicated /autore/<slug> page carrying
 * Person structured data. Author names that do not appear here are a trust
 * signal failure (unverifiable authorship) on YMYL topics such as tax bonuses.
 */

export interface Author {
  /** URL slug -> /autore/<slug> */
  slug: string;
  /** Full display name, including professional title */
  name: string;
  /** Editorial role */
  role: string;
  /** Short bio shown on the author page and in the article author box */
  bio: string;
  /** Professional credential (schema.org hasCredential / jobTitle support) */
  credential: string;
  /** Topics this author is accountable for */
  expertise: string[];
}

export const authors: Author[] = [
  {
    slug: 'tommaso-salvetti',
    name: 'Ing. Tommaso Salvetti',
    role: 'Redattore tecnico impianti',
    bio: 'Ingegnere meccanico, si occupa di pompe di calore, caldaie e impianti HVAC dal 2012. Per Edilizia 24 Ore confronta le schede tecniche degli impianti termici e i rendimenti stagionali dichiarati dai costruttori.',
    credential: 'Ingegnere meccanico',
    expertise: ['Impianti termici', 'Pompe di calore', 'Fotovoltaico', 'Efficienza energetica'],
  },
  {
    slug: 'federica-anselmi',
    name: 'Dott.ssa Federica Anselmi',
    role: 'Esperta fiscalità immobiliare',
    bio: 'Dottore commercialista, segue bonus edilizi e agevolazioni fiscali dalla prima edizione del Superbonus. Cura gli approfondimenti su aliquote, massimali e adempimenti verso Agenzia delle Entrate ed ENEA.',
    credential: 'Dottore commercialista',
    expertise: ['Bonus edilizi', 'Detrazioni fiscali', 'Superbonus', 'Conto Termico'],
  },
  {
    slug: 'beatrice-ongaro',
    name: 'Arch. Beatrice Ongaro',
    role: 'Redattrice architettura e design',
    bio: 'Architetto, cura le sezioni dedicate a materiali, finiture e tendenze del progetto. Si occupa di involucro, serramenti e scelte di capitolato per la ristrutturazione residenziale.',
    credential: 'Architetto',
    expertise: ['Architettura', 'Materiali e finiture', 'Serramenti', 'Design d’interni'],
  },
  {
    slug: 'nicola-trevisan',
    name: 'Geom. Nicola Trevisan',
    role: 'Corrispondente cantieri',
    bio: 'Geometra con vent’anni di direzione lavori, racconta il cantiere dal punto di vista operativo. Segue normative tecniche, sicurezza sul lavoro e andamento del mercato delle costruzioni.',
    credential: 'Geometra',
    expertise: ['Normative tecniche', 'Sicurezza cantieri', 'Mercato costruzioni', 'Direzione lavori'],
  },
];

const bySlug = new Map(authors.map((a) => [a.slug, a]));
const byName = new Map(authors.map((a) => [a.name, a]));

export function getAuthorBySlug(slug: string): Author | undefined {
  return bySlug.get(slug);
}

/** Resolve an article byline to the editorial roster. */
export function getAuthorByName(name: string): Author | undefined {
  return byName.get(name);
}

export function authorUrl(author: Pick<Author, 'slug'>): string {
  return `/autore/${author.slug}`;
}
