# Edilizia 24 Ore

Portale news italiano dedicato all'edilizia — news, bonus, normative, mercato, innovazione, sostenibilità e guide (Top 10 / Top 5).

## Stack

- **React 19 + TypeScript + Vite** + Tailwind CSS
- **React Router v7**
- **Prerendering statico custom** (react-dom/server + Vite SSR build): ogni rotta è un file HTML completo con contenuti, meta tag e JSON-LD già nel sorgente — massima indicizzabilità
- Nessuna dipendenza UI esterna a runtime

## Contenuti e SEO

- 30 articoli editoriali (6.000–10.000 caratteri) ottimizzati SEO/GEO/AEO: risposte answer-first, H2 a domanda, 6 FAQ per articolo, tabelle di confronto, 130 link interni contestuali
- 30 immagini editoriali AI ottimizzate (1200×675, < 210 KB) con alt text e `og:image`
- Dati strutturati JSON-LD: NewsArticle, FAQPage, BreadcrumbList, CollectionPage, Organization, WebSite + SearchAction
- `sitemap.xml` (55+ URL), `news-sitemap.xml` (Google News) e `feed.xml` RSS generati automaticamente ad ogni build
- Ricerca interna (`/cerca`), pagine tag indicizzabili, newsletter, cookie banner GDPR (consenso analytics/marketing)

## Comandi

```bash
npm install        # dipendenze
npm run dev        # dev server con HMR
npm run build      # build produzione: client + SSR + prerender + feed → dist/
npm run preview    # serve la build
```

La build produce in `dist/` un sito statico puro: ~55 pagine HTML prerenderizzate, pronto per Netlify / Vercel / nginx (`try_files $uri $uri/ =404`).

## Struttura

```
src/
  data/articles/     # 30 articoli (dati tipizzati)
  data/types.ts      # schema Article, FAQ, tabelle
  pages/             # Home, Category, Article, Guide, Search, Tag, legali…
  components/        # Header, Footer, SeoHead, AdSlot, CookieBanner…
  lib/seo.ts         # builder JSON-LD
scripts/
  prerender.mjs      # genera l'HTML statico per rotta
  generate-feeds.mjs # news sitemap + RSS
public/images/articoli/  # 30 immagini editoriali
```

## Prima del go-live

- [ ] Compilare i placeholder legali (ragione sociale, P.IVA, email) in Privacy/Cookie Policy e Termini
- [ ] Collegare endpoint newsletter (Brevo/Mailchimp) in `NewsletterBox.tsx`
- [ ] Collegare Analytics/AdSense nel punto di aggancio consenso (`src/lib/consent.ts`)
- [ ] Registrare il dominio su Google Search Console e inviare `sitemap.xml`
