/**
 * Editorial hero images for articles, merged from the image pipeline
 * manifests (images-batch1/2.json, now removed). Files live at
 * public/images/articoli/<slug>.jpg (1200x675 JPEG).
 */
import type { ArticleImage } from './types';

const articleImages: Record<string, ArticleImage> = {
  'top-10-pompe-di-calore-2026': {
    src: '/images/articoli/top-10-pompe-di-calore-2026.jpg',
    alt: 'Tecnico installa pompa di calore esterna nel giardino di una casa italiana',
  },
  'top-10-imprese-ristrutturazione-milano-2026': {
    src: '/images/articoli/top-10-imprese-ristrutturazione-milano-2026.jpg',
    alt: 'Operai al lavoro in cantiere di ristrutturazione con skyline di Milano dalla finestra',
  },
  'top-10-migliori-infissi-pvc-2026': {
    src: '/images/articoli/top-10-migliori-infissi-pvc-2026.jpg',
    alt: 'Operaio installa finestra in PVC bianca in appartamento luminoso con attrezzi',
  },
  'top-10-materiali-isolanti-cappotto-termico': {
    src: '/images/articoli/top-10-materiali-isolanti-cappotto-termico.jpg',
    alt: 'Operai su ponteggio applicano pannelli isolanti a cappotto su facciata condominiale',
  },
  'top-10-software-progettazione-edile-bim': {
    src: '/images/articoli/top-10-software-progettazione-edile-bim.jpg',
    alt: 'Architetto lavora su modello 3D BIM di edificio in uno studio di progettazione moderno',
  },
  'top-10-pavimenti-interni-2026': {
    src: '/images/articoli/top-10-pavimenti-interni-2026.jpg',
    alt: 'Posatore installa pavimento in gres effetto legno in un soggiorno moderno',
  },
  'top-10-caldaie-a-condensazione-2026': {
    src: '/images/articoli/top-10-caldaie-a-condensazione-2026.jpg',
    alt: 'Tecnico controlla caldaia a condensazione a parete con analizzatore di combustione',
  },
  'top-10-impianti-fotovoltaici-domestici-2026': {
    src: '/images/articoli/top-10-impianti-fotovoltaici-domestici-2026.jpg',
    alt: 'Pannelli fotovoltaici sul tetto con coppi di una villa italiana sotto cielo azzurro',
  },
  'top-10-facciate-ventilate-rivestimenti': {
    src: '/images/articoli/top-10-facciate-ventilate-rivestimenti.jpg',
    alt: 'Facciata ventilata in gres porcellanato su edificio moderno, dettaglio architettonico',
  },
  'top-10-scale-interne-moderne': {
    src: '/images/articoli/top-10-scale-interne-moderne.jpg',
    alt: 'Scala interna moderna autoportante in acciaio e legno dentro un loft luminoso',
  },
  'top-5-errori-ristrutturazione-bagno': {
    src: '/images/articoli/top-5-errori-ristrutturazione-bagno.jpg',
    alt: 'Bagno in ristrutturazione con piastrelle rimosse e tubature idrauliche a vista',
  },
  'top-5-bonus-edilizi-2026': {
    src: '/images/articoli/top-5-bonus-edilizi-2026.jpg',
    alt: 'Documenti, calcolatrice e casco davanti a cantiere edile italiano per bonus ristrutturazioni',
  },
  'top-5-tendenze-design-cucine-2026': {
    src: '/images/articoli/top-5-tendenze-design-cucine-2026.jpg',
    alt: 'Cucina moderna di design con isola centrale e materiali naturali in luce calda',
  },
  'top-5-strumenti-laser-cantiere': {
    src: '/images/articoli/top-5-strumenti-laser-cantiere.jpg',
    alt: 'Livella laser verde su treppiede proietta linea laser sul muro del cantiere',
  },
  'top-5-vernici-ecologiche-interni': {
    src: '/images/articoli/top-5-vernici-ecologiche-interni.jpg',
    alt: 'Persona imbianca parete interna con rullo e pittura ecologica in ambiente luminoso',
  },
  'top-5-domotica-casa-smart-cantiere': {
    src: '/images/articoli/top-5-domotica-casa-smart-cantiere.jpg',
    alt: 'Soggiorno italiano con pannello domotico a parete e termostato smart',
  },
  'news-bonus-ristrutturazioni-50-2026': {
    src: '/images/articoli/news-bonus-ristrutturazioni-50-2026.jpg',
    alt: 'Cantiere di ristrutturazione appartamento con operaio e documenti di lavoro',
  },
  'news-superbonus-eredita-cosa-cambia-2026': {
    src: '/images/articoli/news-superbonus-eredita-cosa-cambia-2026.jpg',
    alt: 'Condominio italiano con ponteggi in rimozione dopo lavori di efficientamento',
  },
  'news-conto-termico-3-0-incentivi-2026': {
    src: '/images/articoli/news-conto-termico-3-0-incentivi-2026.jpg',
    alt: 'Tecnico installa pompa di calore nella centrale termica condominiale',
  },
  'news-cam-edilizia-normativa-2026': {
    src: '/images/articoli/news-cam-edilizia-normativa-2026.jpg',
    alt: 'Cantiere edile con materiali da costruzione riciclati e certificati accatastati',
  },
  'news-direttiva-case-green-recepimento-italia': {
    src: '/images/articoli/news-direttiva-case-green-recepimento-italia.jpg',
    alt: 'Quartiere residenziale italiano con pannelli solari e cappotto termico',
  },
  'news-sicurezza-cantieri-decreto-2026': {
    src: '/images/articoli/news-sicurezza-cantieri-decreto-2026.jpg',
    alt: 'Operai con casco e imbracatura di sicurezza al lavoro in cantiere',
  },
  'news-mercato-immobiliare-prezzi-2026': {
    src: '/images/articoli/news-mercato-immobiliare-prezzi-2026.jpg',
    alt: 'Skyline residenziale di Milano al tramonto con gru edili',
  },
  'news-settore-costruzioni-2026-rapporto-ance': {
    src: '/images/articoli/news-settore-costruzioni-2026-rapporto-ance.jpg',
    alt: 'Grande cantiere italiano con gru a torre e operai al lavoro',
  },
  'news-prezzi-materiali-costruzione-2026': {
    src: '/images/articoli/news-prezzi-materiali-costruzione-2026.jpg',
    alt: 'Deposito materiali edili con cemento, acciaio e legname accatastati',
  },
  'news-stampa-3d-edilizia-italia': {
    src: '/images/articoli/news-stampa-3d-edilizia-italia.jpg',
    alt: 'Stampante 3D da costruzione stampa le pareti di una casa',
  },
  'news-calcestruzzo-sostenibile-innovazioni': {
    src: '/images/articoli/news-calcestruzzo-sostenibile-innovazioni.jpg',
    alt: 'Betoniera e getto di calcestruzzo in cantiere con verde sullo sfondo',
  },
  'news-fotovoltaico-plug-play-balcone': {
    src: '/images/articoli/news-fotovoltaico-plug-play-balcone.jpg',
    alt: 'Pannello fotovoltaico plug and play installato sulla ringhiera del balcone',
  },
  'news-edilizia-legno-clt-sostenibilita': {
    src: '/images/articoli/news-edilizia-legno-clt-sostenibilita.jpg',
    alt: 'Edificio in costruzione con struttura in pannelli di legno CLT',
  },
  'news-rigenerazione-urbana-progetti-2026': {
    src: '/images/articoli/news-rigenerazione-urbana-progetti-2026.jpg',
    alt: 'Ex area industriale italiana in riqualificazione con gru e nuovi edifici',
  },
};

export default articleImages;
