"use client";

import { useEffect, useState } from "react";
import { PAGE_SIZES, parseTransactionsQuery, PLANS, STATUSES } from "@/lib/query";
import { formatCents, formatDateTime, formatNumber, initials } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import { useUrlState } from "@/lib/use-url-state";
import type { SortDir, SortField, TransactionStatus, TransactionsResponse } from "@/lib/types";
import { ChevronLeft, ChevronRight, Close, Search, SortIcon } from "@/components/ui/icons";
import { EmptyState, ErrorState, Skeleton } from "@/components/dashboard/states";
import { Pagination } from "@/components/dashboard/pagination";

const STATUS_STYLE: Record<TransactionStatus, string> = {
  paid: "bg-positive/10 text-positive",
  pending: "bg-warning/10 text-warning",
  refunded: "bg-surface-2 text-muted",
  failed: "bg-negative/10 text-negative",
};

/** API param → URL param. Defaults are omitted from the URL to keep shared links short. */
const KEYS = {
  q: "q",
  status: "status",
  plan: "plan",
  sort: "sort",
  dir: "dir",
  page: "page",
  pageSize: "size",
} as const;

export function TransactionsTable({ simulate }: { simulate: string | null }) {
  const [params, update] = useUrlState();
  const query = parseTransactionsQuery(
    new URLSearchParams(
      Object.entries(KEYS).flatMap(([apiKey, urlKey]) => {
        const v = params.get(urlKey);
        return v === null ? [] : [[apiKey, v]];
      }),
    ),
  );

  const [search, setSearch] = useState(query.q);

  // Debounce typing into the URL (and therefore the request) by 300ms.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const id = setTimeout(() => update({ [KEYS.q]: search.trim(), [KEYS.page]: null }), 300);
    return () => clearTimeout(id);
  }, [search, query.q, update]);

  const apiParams = new URLSearchParams({
    q: query.q,
    status: query.status,
    plan: query.plan,
    sort: query.sort,
    dir: query.dir,
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (simulate) apiParams.set("simulate", simulate);
  const { data, previous, isLoading, error, retry } = useApi<TransactionsResponse>(`/api/transactions?${apiParams}`);
  const view = data ?? previous;

  const hasFilters = query.q !== "" || query.status !== "all" || query.plan !== "all";
  const clearFilters = () => {
    setSearch("");
    update({ [KEYS.q]: null, [KEYS.status]: null, [KEYS.plan]: null, [KEYS.page]: null });
  };

  function toggleSort(field: SortField) {
    const dir = query.sort === field && query.dir === "desc" ? "asc" : "desc";
    update({
      [KEYS.sort]: field === "date" && dir === "desc" ? null : field,
      [KEYS.dir]: dir === "desc" ? null : dir,
      [KEYS.page]: null,
    });
  }

  const ariaSort = (field: SortField) =>
    query.sort === field ? (query.dir === "asc" ? "ascending" : "descending") : "none";

  const sortProps = { sort: query.sort, dir: query.dir, onSort: toggleSort };

  return (
    <section aria-labelledby="tx-title" className="rounded-2xl border border-line bg-surface">
      <header className="flex flex-col gap-4 border-b border-line p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 id="tx-title" className="font-semibold">
              Transactions
            </h2>
            <p className="text-sm text-muted" aria-live="polite">
              {error
                ? "Unavailable"
                : view
                  ? `${formatNumber(view.total)} ${view.total === 1 ? "result" : "results"}`
                  : "Loading…"}
            </p>
          </div>
          <div className="flex gap-2">
            <label className="relative flex-1 sm:w-72 sm:flex-none">
              <span className="sr-only">Search transactions</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                width={16}
                height={16}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers or IDs"
                className="h-10 w-full rounded-full border border-line bg-bg pr-9 pl-9 text-sm outline-none placeholder:text-muted focus:border-ink [&::-webkit-search-cancel-button]:hidden"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink"
                >
                  <Close width={14} height={14} />
                </button>
              )}
            </label>
            <label className="sr-only" htmlFor="plan-filter">
              Plan
            </label>
            <select
              id="plan-filter"
              value={query.plan}
              onChange={(e) =>
                update({ [KEYS.plan]: e.target.value === "all" ? null : e.target.value, [KEYS.page]: null })
              }
              className="h-10 rounded-full border border-line bg-bg px-3 text-sm outline-none focus:border-ink"
            >
              <option value="all">All plans</option>
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div role="tablist" aria-label="Filter by status" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5">
          {(["all", ...STATUSES] as const).map((status) => {
            const selected = query.status === status;
            return (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => update({ [KEYS.status]: status === "all" ? null : status, [KEYS.page]: null })}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm capitalize transition-colors ${
                  selected ? "bg-ink text-bg" : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {status}
                <span className={`tabular text-xs ${selected ? "text-bg/60" : "text-muted"}`}>
                  {view ? formatNumber(view.statusCounts[status]) : "–"}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="relative">
        {isLoading && view && (
          <div role="progressbar" aria-label="Loading" className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
            <div className="shimmer h-full w-full !bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />
          </div>
        )}

        {error ? (
          <ErrorState message={error.message} onRetry={retry} />
        ) : !view ? (
          <TableSkeleton rows={query.pageSize > 10 ? 10 : query.pageSize} />
        ) : view.data.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No transactions match" : "No transactions yet"}
            body={
              hasFilters
                ? "Try a different search term or clear the filters to see everything."
                : "Once customers start paying, every charge, refund and failure shows up here."
            }
            action={
              hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg"
                >
                  Clear filters
                </button>
              )
            }
          />
        ) : (
          <div className={`transition-opacity duration-200 ${isLoading ? "opacity-60" : ""}`} aria-busy={isLoading}>
            {/* Desktop / tablet table */}
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th scope="col" className="py-3 pr-4 pl-5 font-medium">
                    Transaction
                  </th>
                  <th scope="col" aria-sort={ariaSort("customer")} className="px-4 py-3">
                    <SortButton field="customer" {...sortProps}>
                      Customer
                    </SortButton>
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" aria-sort={ariaSort("date")} className="px-4 py-3">
                    <SortButton field="date" {...sortProps}>
                      Date
                    </SortButton>
                  </th>
                  <th scope="col" aria-sort={ariaSort("amount")} className="py-3 pr-5 pl-4 text-right">
                    <SortButton field="amount" align="right" {...sortProps}>
                      Amount
                    </SortButton>
                  </th>
                </tr>
              </thead>
              <tbody>
                {view.data.map((tx) => (
                  <tr key={tx.id} className="border-b border-line last:border-0 hover:bg-surface-2/50">
                    <td className="py-3 pr-4 pl-5">
                      <span className="font-mono text-xs text-ink">{tx.id}</span>
                      <span className="block text-xs text-muted">{tx.method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold">
                          {initials(tx.customer.name)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{tx.customer.name}</span>
                          <span className="block truncate text-xs text-muted">{tx.customer.email}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{tx.plan}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[tx.status]}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="tabular px-4 py-3 whitespace-nowrap text-muted">{formatDateTime(tx.date)}</td>
                    <td
                      className={`tabular py-3 pr-5 pl-4 text-right font-medium ${
                        tx.status === "refunded" || tx.status === "failed" ? "text-muted line-through decoration-1" : ""
                      }`}
                    >
                      {formatCents(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden">
              <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-muted">
                <span>Sort</span>
                <span className="flex gap-3">
                  <SortButton field="date" {...sortProps}>
                    Date
                  </SortButton>
                  <SortButton field="amount" {...sortProps}>
                    Amount
                  </SortButton>
                  <SortButton field="customer" {...sortProps}>
                    Name
                  </SortButton>
                </span>
              </div>
              <ul>
                {view.data.map((tx) => (
                  <li key={tx.id} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold">
                      {initials(tx.customer.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tx.customer.name}</p>
                      <p className="truncate text-xs text-muted">
                        {tx.plan} · {formatDateTime(tx.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="tabular text-sm font-medium">{formatCents(tx.amount)}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[tx.status]}`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {view && view.total > 0 && !error && (
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm sm:flex-row sm:px-5">
          <div className="flex items-center gap-2 text-muted">
            <label htmlFor="page-size">Rows</label>
            <select
              id="page-size"
              value={query.pageSize}
              onChange={(e) =>
                update({ [KEYS.pageSize]: e.target.value === "10" ? null : e.target.value, [KEYS.page]: null })
              }
              className="h-8 rounded-lg border border-line bg-bg px-2 outline-none focus:border-ink"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
            <span className="tabular">
              {formatNumber((view.page - 1) * view.pageSize + 1)}–
              {formatNumber(Math.min(view.page * view.pageSize, view.total))} of {formatNumber(view.total)}
            </span>
          </div>
          <Pagination
            page={view.page}
            totalPages={view.totalPages}
            onChange={(page) => update({ [KEYS.page]: page === 1 ? null : page })}
            prevIcon={<ChevronLeft width={16} height={16} />}
            nextIcon={<ChevronRight width={16} height={16} />}
          />
        </footer>
      )}
    </section>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-busy="true" aria-label="Loading transactions">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-line px-5 py-3.5 last:border-0">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="hidden h-5 w-16 rounded-full md:block" />
          <Skeleton className="hidden h-3.5 w-24 md:block" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function SortButton({
  field,
  sort,
  dir,
  onSort,
  align = "left",
  children,
}: {
  field: SortField;
  sort: SortField;
  dir: SortDir;
  onSort: (field: SortField) => void;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  const active = sort === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`inline-flex items-center gap-1 font-medium hover:text-ink ${align === "right" ? "flex-row-reverse" : ""} ${
        active ? "text-ink" : ""
      }`}
    >
      {children}
      <SortIcon dir={active ? dir : undefined} className={active ? "text-accent" : "opacity-50"} />
    </button>
  );
}
