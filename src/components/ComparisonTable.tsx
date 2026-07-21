import type { ComparisonTable as ComparisonTableData } from '@/data/types';

/**
 * Editorial comparison table for Top-N articles.
 * Responsive: horizontal scroll on small screens with a sticky first column.
 * Semantic <table>/<caption>/<th scope> markup for table rich snippets and
 * AI Overview extraction (rendered in the prerendered HTML).
 */
export default function ComparisonTable({
  table,
  className = '',
}: {
  table: ComparisonTableData;
  className?: string;
}) {
  return (
    <div
      className={`overflow-x-auto rounded-md border border-neutral-200 bg-white shadow-sm ${className}`}
    >
      <table className="w-full min-w-[680px] border-collapse text-left text-[14px] leading-snug">
        <caption className="border-b-2 border-brand bg-neutral-50 px-4 py-3 text-left font-serif text-base font-bold text-ink">
          {table.caption}
        </caption>
        <thead>
          <tr className="border-b border-neutral-200 bg-white">
            {table.columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] ${
                  i === 0 ? 'sticky left-0 z-10 bg-inherit text-brand' : 'text-neutral-600'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-neutral-100 odd:bg-white even:bg-neutral-50 last:border-0"
            >
              {row.map((cell, ci) =>
                ci === 0 ? (
                  <th
                    key={ci}
                    scope="row"
                    className="sticky left-0 z-10 bg-inherit px-4 py-3 font-semibold text-ink"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={ci} className="px-4 py-3 text-neutral-700">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
