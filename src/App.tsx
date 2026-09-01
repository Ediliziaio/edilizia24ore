import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { Route, Routes } from 'react-router';
import Layout from '@/components/Layout';
// Home stays eager: it is the landing page.
import Home from '@/pages/Home';

/* ------------------------------------------------------------------ */
/* Route-level code splitting                                          */
/* Client bundle: pages load on demand via React.lazy.                 */
/* SSR/prerender bundle: renderToString cannot resolve lazy components */
/* (React 19), so the prerender entry must use eager imports.          */
/* import.meta.env.SSR is statically replaced by Vite, which lets      */
/* Rollup tree-shake the eager branch (and its imports) out of the     */
/* client bundle and the lazy branch out of the SSR bundle.            */
/* ------------------------------------------------------------------ */
import EagerCategory from '@/pages/Category';
import EagerGuide from '@/pages/Guide';
import EagerArticle from '@/pages/Article';
import EagerSearch from '@/pages/Search';
import EagerTag from '@/pages/Tag';
import EagerMetodologia from '@/pages/Metodologia';
import EagerChiSiamo from '@/pages/ChiSiamo';
import EagerContatti from '@/pages/Contatti';
import EagerPrivacyPolicy from '@/pages/PrivacyPolicy';
import EagerCookiePolicy from '@/pages/CookiePolicy';
import EagerTerminiCondizioni from '@/pages/TerminiCondizioni';
import EagerNotFound from '@/pages/NotFound';

type PageComponent = ComponentType | LazyExoticComponent<ComponentType>;

const Category: PageComponent = import.meta.env.SSR ? EagerCategory : lazy(() => import('@/pages/Category'));
const Guide: PageComponent = import.meta.env.SSR ? EagerGuide : lazy(() => import('@/pages/Guide'));
const Article: PageComponent = import.meta.env.SSR ? EagerArticle : lazy(() => import('@/pages/Article'));
const Search: PageComponent = import.meta.env.SSR ? EagerSearch : lazy(() => import('@/pages/Search'));
const Tag: PageComponent = import.meta.env.SSR ? EagerTag : lazy(() => import('@/pages/Tag'));
const Metodologia: PageComponent = import.meta.env.SSR ? EagerMetodologia : lazy(() => import('@/pages/Metodologia'));
const ChiSiamo: PageComponent = import.meta.env.SSR ? EagerChiSiamo : lazy(() => import('@/pages/ChiSiamo'));
const Contatti: PageComponent = import.meta.env.SSR ? EagerContatti : lazy(() => import('@/pages/Contatti'));
const PrivacyPolicy: PageComponent = import.meta.env.SSR ? EagerPrivacyPolicy : lazy(() => import('@/pages/PrivacyPolicy'));
const CookiePolicy: PageComponent = import.meta.env.SSR ? EagerCookiePolicy : lazy(() => import('@/pages/CookiePolicy'));
const TerminiCondizioni: PageComponent = import.meta.env.SSR ? EagerTerminiCondizioni : lazy(() => import('@/pages/TerminiCondizioni'));
const NotFound: PageComponent = import.meta.env.SSR ? EagerNotFound : lazy(() => import('@/pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:category" element={<Category />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/articolo/:slug" element={<Article />} />
        <Route path="/cerca" element={<Search />} />
        <Route path="/tag/:tag" element={<Tag />} />
        <Route path="/metodologia" element={<Metodologia />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/termini-e-condizioni" element={<TerminiCondizioni />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
