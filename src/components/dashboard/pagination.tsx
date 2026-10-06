/** Page numbers with ellipses: 1 … 4 5 6 … 20 */
function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, Math.min(page - 1, total - 4));
  const end = Math.min(total - 1, Math.max(page + 1, 5));
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  prevIcon,
  nextIcon,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  prevIcon: React.ReactNode;
  nextIcon: React.ReactNode;
}) {
  const base = "grid h-8 min-w-8 place-items-center rounded-lg px-2 tabular transition-colors";
  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${base} text-muted hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-40`}
      >
        {prevIcon}
      </button>
      <span className="tabular px-2 text-muted sm:hidden">
        {page} / {totalPages}
      </span>
      <ul className="hidden items-center gap-1 sm:flex">
        {pageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={`${base} ${p === page ? "bg-ink text-bg" : "text-muted hover:bg-surface-2 hover:text-ink"}`}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${base} text-muted hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-40`}
      >
        {nextIcon}
      </button>
    </nav>
  );
}
