import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

interface SearchBoxProps {
  /** input id (unique per instance on the page) */
  id?: string;
  size?: 'sm' | 'lg';
  autoFocus?: boolean;
  /** Controlled value (instant search on /cerca). Omit for internal state. */
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  /** Called after a submit (e.g. to close a dropdown / mobile menu). */
  onSubmitted?: (query: string) => void;
  placeholder?: string;
}

/**
 * Site search box. Renders a real GET form (action="/cerca", name="q") so it
 * works even without JS and matches the WebSite SearchAction JSON-LD; with JS
 * the submit is intercepted and routed client-side to /cerca?q=...
 */
export default function SearchBox({
  id = 'site-search',
  size = 'sm',
  autoFocus = false,
  value,
  onValueChange,
  defaultValue = '',
  onSubmitted,
  placeholder = 'Cerca articoli, bonus, guide…',
}: SearchBoxProps) {
  const navigate = useNavigate();
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const query = controlled ? value : internal;

  const handleChange = (next: string) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    onSubmitted?.(q);
    navigate(q ? `/cerca?q=${encodeURIComponent(q)}` : '/cerca');
  };

  const large = size === 'lg';

  return (
    <form
      action="/cerca"
      method="get"
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-stretch gap-2"
    >
      <label htmlFor={id} className="sr-only">
        Cerca nel sito
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`min-w-0 flex-1 rounded-md border border-neutral-300 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${
          large ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'
        }`}
      />
      <button
        type="submit"
        aria-label="Avvia la ricerca"
        className={`inline-flex shrink-0 items-center gap-2 rounded-md bg-brand font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-dark ${
          large ? 'px-5 py-3 text-sm' : 'px-3 py-2 text-xs'
        }`}
      >
        <svg
          width={large ? 18 : 15}
          height={large ? 18 : 15}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className={large ? 'inline' : 'hidden sm:inline'}>Cerca</span>
      </button>
    </form>
  );
}
