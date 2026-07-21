import type { Article, ArticleCategory } from '../types';
import articleImages from '../articleImages';

// TOP 10
import top10PompeDiCalore2026 from './top-10-pompe-di-calore-2026';
import top10ImpreseRistrutturazioneMilano2026 from './top-10-imprese-ristrutturazione-milano-2026';
import top10MiglioriInfissiPvc2026 from './top-10-migliori-infissi-pvc-2026';
import top10MaterialiIsolantiCappottoTermico from './top-10-materiali-isolanti-cappotto-termico';
import top10SoftwareProgettazioneEdileBim from './top-10-software-progettazione-edile-bim';
import top10PavimentiInterni2026 from './top-10-pavimenti-interni-2026';
import top10CaldaieACondensazione2026 from './top-10-caldaie-a-condensazione-2026';
import top10ImpiantiFotovoltaiciDomestici2026 from './top-10-impianti-fotovoltaici-domestici-2026';
import top10FacciateVentilateRivestimenti from './top-10-facciate-ventilate-rivestimenti';
import top10ScaleInterneModerne from './top-10-scale-interne-moderne';

// TOP 5
import top5ErroriRistrutturazioneBagno from './top-5-errori-ristrutturazione-bagno';
import top5BonusEdilizi2026 from './top-5-bonus-edilizi-2026';
import top5TendenzeDesignCucine2026 from './top-5-tendenze-design-cucine-2026';
import top5StrumentiLaserCantiere from './top-5-strumenti-laser-cantiere';
import top5VerniciEcologicheInterni from './top-5-vernici-ecologiche-interni';
import top5DomoticaCasaSmartCantiere from './top-5-domotica-casa-smart-cantiere';

// NEWS
import newsBonusRistrutturazioni502026 from './news-bonus-ristrutturazioni-50-2026';
import newsSuperbonusEreditaCosaCambia2026 from './news-superbonus-eredita-cosa-cambia-2026';
import newsContoTermico30Incentivi2026 from './news-conto-termico-3-0-incentivi-2026';
import newsCamEdiliziaNormativa2026 from './news-cam-edilizia-normativa-2026';
import newsDirettivaCaseGreenRecepimentoItalia from './news-direttiva-case-green-recepimento-italia';
import newsSicurezzaCantieriDecreto2026 from './news-sicurezza-cantieri-decreto-2026';
import newsMercatoImmobiliarePrezzi2026 from './news-mercato-immobiliare-prezzi-2026';
import newsSettoreCostruzioni2026RapportoAnce from './news-settore-costruzioni-2026-rapporto-ance';
import newsPrezziMaterialiCostruzione2026 from './news-prezzi-materiali-costruzione-2026';
import newsStampa3dEdiliziaItalia from './news-stampa-3d-edilizia-italia';
import newsCalcestruzzoSostenibileInnovazioni from './news-calcestruzzo-sostenibile-innovazioni';
import newsFotovoltaicoPlugPlayBalcone from './news-fotovoltaico-plug-play-balcone';
import newsEdiliziaLegnoCltSostenibilita from './news-edilizia-legno-clt-sostenibilita';
import newsRigenerazioneUrbanaProgetti2026 from './news-rigenerazione-urbana-progetti-2026';

const all: Article[] = [
  top10PompeDiCalore2026,
  top10ImpreseRistrutturazioneMilano2026,
  top10MiglioriInfissiPvc2026,
  top10MaterialiIsolantiCappottoTermico,
  top10SoftwareProgettazioneEdileBim,
  top10PavimentiInterni2026,
  top10CaldaieACondensazione2026,
  top10ImpiantiFotovoltaiciDomestici2026,
  top10FacciateVentilateRivestimenti,
  top10ScaleInterneModerne,
  top5ErroriRistrutturazioneBagno,
  top5BonusEdilizi2026,
  top5TendenzeDesignCucine2026,
  top5StrumentiLaserCantiere,
  top5VerniciEcologicheInterni,
  top5DomoticaCasaSmartCantiere,
  newsBonusRistrutturazioni502026,
  newsSuperbonusEreditaCosaCambia2026,
  newsContoTermico30Incentivi2026,
  newsCamEdiliziaNormativa2026,
  newsDirettivaCaseGreenRecepimentoItalia,
  newsSicurezzaCantieriDecreto2026,
  newsMercatoImmobiliarePrezzi2026,
  newsSettoreCostruzioni2026RapportoAnce,
  newsPrezziMaterialiCostruzione2026,
  newsStampa3dEdiliziaItalia,
  newsCalcestruzzoSostenibileInnovazioni,
  newsFotovoltaicoPlugPlayBalcone,
  newsEdiliziaLegnoCltSostenibilita,
  newsRigenerazioneUrbanaProgetti2026,
];

/** All 30 articles, sorted by publication date (most recent first). */
export const articles: Article[] = [...all]
  // Attach the editorial hero image (when one exists) from the merged manifest.
  .map((a) => (articleImages[a.slug] ? { ...a, image: articleImages[a.slug] } : a))
  .sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getByCategory(category: ArticleCategory): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getRelated(article: Article, limit = 4): Article[] {
  const sameCategory = articles.filter(
    (a) => a.slug !== article.slug && a.category === article.category,
  );
  // News articles: prefer same subcategory first
  if (article.category === 'news' && article.subcategory) {
    sameCategory.sort((a, b) => {
      const aScore = a.subcategory === article.subcategory ? 1 : 0;
      const bScore = b.subcategory === article.subcategory ? 1 : 0;
      return bScore - aScore;
    });
  }
  return sameCategory.slice(0, limit);
}
