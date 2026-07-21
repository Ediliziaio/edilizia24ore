import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import AdSlot from './AdSlot';
import CookieBanner from './CookieBanner';

/** Minimal skeleton shown while a lazily-loaded page chunk downloads. */
function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8" aria-hidden="true">
      <div className="h-4 w-40 rounded bg-neutral-200" />
      <div className="mt-4 h-9 w-3/4 rounded bg-neutral-200" />
      <div className="mt-2 h-9 w-1/2 rounded bg-neutral-200" />
      <div className="mt-6 aspect-[16/9] w-full rounded-md bg-neutral-200" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-neutral-200" />
        <div className="h-4 w-full rounded bg-neutral-200" />
        <div className="h-4 w-2/3 rounded bg-neutral-200" />
      </div>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change (SPA behaviour expected of a news site)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar />
      <Header />
      <main id="contenuto" className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <div className="mx-auto w-full max-w-7xl px-4">
        <AdSlot id="leaderboard-pre-footer" format="leaderboard" className="my-10" />
      </div>
      <Footer />
      {/* Client-only after hydration: no markup in prerendered HTML, no CLS. */}
      <CookieBanner />
    </div>
  );
}
