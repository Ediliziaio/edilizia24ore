import { Link } from 'react-router';
import type { Crumb } from '@/lib/seo';

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav aria-label="Percorso di navigazione (breadcrumb)" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-neutral-500 sm:text-sm">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden="true" className="text-neutral-300">
                  /
                </span>
              )}
              {last ? (
                <span aria-current="page" className="font-medium text-ink">
                  {c.name}
                </span>
              ) : (
                <Link to={c.path} className="hover:text-brand hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
