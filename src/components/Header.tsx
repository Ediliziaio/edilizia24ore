import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import SearchBox from './SearchBox';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/categoria/news', label: 'News' },
  { to: '/categoria/bonus-fisco', label: 'Bonus & Fisco' },
  { to: '/categoria/normative', label: 'Normative' },
  { to: '/categoria/mercato', label: 'Mercato' },
  { to: '/categoria/innovazione', label: 'Innovazione' },
  { to: '/categoria/sostenibilita', label: 'Sostenibilità' },
  { to: '/guide', label: 'Guide' },
];

const SECONDARY_ITEMS = [
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/contatti', label: 'Contatti' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brand bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between gap-4 transition-all ${
            scrolled ? 'py-2' : 'py-3 sm:py-4'
          }`}
        >
          <Link to="/" aria-label="Edilizia 24 Ore — home page" className="shrink-0">
            <img
              src="/logo.png"
              alt="Edilizia 24 Ore — il portale dell'edilizia italiana"
              className={`w-auto transition-all ${scrolled ? 'h-10 sm:h-11' : 'h-14 sm:h-16'}`}
              width={219}
              height={64}
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Navigazione principale" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `whitespace-nowrap px-2.5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                        isActive
                          ? 'border-b-2 border-brand text-brand'
                          : 'text-ink hover:text-brand'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/chi-siamo"
                  className={({ isActive }) =>
                    `whitespace-nowrap px-2.5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                      isActive ? 'border-b-2 border-brand text-brand' : 'text-neutral-500 hover:text-brand'
                    }`
                  }
                >
                  Chi siamo
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Actions: search toggle + mobile hamburger */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 text-ink transition-colors hover:border-brand hover:text-brand"
              aria-label={searchOpen ? 'Chiudi la ricerca' : 'Apri la ricerca nel sito'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 lg:hidden"
              aria-label={menuOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable search bar (all breakpoints; keeps the nav row stable) */}
      {searchOpen && (
        <div className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <SearchBox
              id="header-search"
              autoFocus
              onSubmitted={() => {
                setSearchOpen(false);
                setMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <nav aria-label="Navigazione mobile" className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="border-b border-neutral-100 px-4 py-3">
            <SearchBox
              id="mobile-menu-search"
              onSubmitted={() => {
                setMenuOpen(false);
                setSearchOpen(false);
              }}
            />
          </div>
          <ul className="divide-y divide-neutral-100">
            {[...NAV_ITEMS, ...SECONDARY_ITEMS].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm font-semibold uppercase tracking-wider ${
                      isActive ? 'bg-brand-light text-brand' : 'text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
