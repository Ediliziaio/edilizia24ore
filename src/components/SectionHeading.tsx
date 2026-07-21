import { Link } from 'react-router';

interface Props {
  title: string;
  /** link "Vedi tutti" */
  moreLink?: string;
  moreLabel?: string;
  as?: 'h2' | 'h3';
}

export default function SectionHeading({ title, moreLink, moreLabel = 'Vedi tutti gli articoli', as: Tag = 'h2' }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
      <Tag className="font-serif text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
        <span className="mr-2 inline-block h-5 w-1.5 bg-brand align-middle" aria-hidden="true" />
        {title}
      </Tag>
      {moreLink && (
        <Link
          to={moreLink}
          className="shrink-0 text-sm font-semibold uppercase tracking-wider text-brand hover:underline"
        >
          {moreLabel} →
        </Link>
      )}
    </div>
  );
}
