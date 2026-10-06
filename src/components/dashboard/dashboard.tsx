"use client";

import { useApi } from "@/lib/use-api";
import { useUrlState } from "@/lib/use-url-state";
import type { MetricsResponse, Range } from "@/lib/types";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { OrdersChart } from "@/components/dashboard/orders-chart";
import { ChannelDonut } from "@/components/dashboard/channel-donut";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { EmptyState, ErrorState, Skeleton } from "@/components/dashboard/states";
import { formatCurrency } from "@/lib/format";

const RANGES: { value: Range; label: string; long: string }[] = [
  { value: "7d", label: "7D", long: "7 days" },
  { value: "30d", label: "30D", long: "30 days" },
  { value: "90d", label: "90D", long: "90 days" },
  { value: "12m", label: "12M", long: "12 months" },
];

const SIMULATIONS = [
  { value: "", label: "Live data" },
  { value: "empty", label: "Empty response" },
  { value: "error", label: "API error" },
];

export function Dashboard() {
  const [params, update] = useUrlState();
  const range = RANGES.find((r) => r.value === params.get("range")) ?? RANGES[1];
  const simulate = params.get("simulate");

  const metricsUrl = `/api/metrics?range=${range.value}${simulate ? `&simulate=${simulate}` : ""}`;
  const { data, previous, isLoading, error, retry } = useApi<MetricsResponse>(metricsUrl);
  // Keep the last range on screen (dimmed) while the next one loads — no layout jump.
  const metrics = data ?? previous;
  const stale = isLoading && !!metrics;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Overview</h1>
          <p className="mt-1 text-sm text-muted">How Pulse Labs is performing over the last {range.long}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="simulate">
            Simulate API state
          </label>
          <select
            id="simulate"
            value={simulate ?? ""}
            onChange={(e) => update({ simulate: e.target.value || null })}
            className="h-9 rounded-full border border-dashed border-line bg-transparent px-3 text-xs text-muted outline-none focus:border-ink"
            title="Demo helper: simulate API responses"
          >
            {SIMULATIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value ? `Simulate: ${s.label}` : s.label}
              </option>
            ))}
          </select>
          <div
            role="radiogroup"
            aria-label="Date range"
            className="flex rounded-full border border-line bg-surface p-1"
          >
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={r.value === range.value}
                aria-label={`Last ${r.long}`}
                onClick={() => update({ range: r.value === "30d" ? null : r.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  r.value === range.value ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-line bg-surface">
          <ErrorState message={error.message} onRetry={retry} />
        </div>
      ) : (
        <div className={`space-y-5 transition-opacity duration-200 ${stale ? "opacity-60" : ""}`} aria-busy={isLoading}>
          <section aria-label="Key metrics" className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
            {metrics
              ? metrics.kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} rangeLabel={range.long} />)
              : Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)}
          </section>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel
              id="revenue"
              title="Revenue"
              className="lg:col-span-2"
              aside={
                metrics && metrics.series.length > 0 ? (
                  <span className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-3 rounded bg-accent" /> Current
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-3 rounded border-t border-dashed border-muted" /> Previous
                    </span>
                  </span>
                ) : null
              }
            >
              {!metrics ? (
                <Skeleton className="h-[240px] w-full" />
              ) : metrics.series.length === 0 ? (
                <NoData />
              ) : (
                <RevenueChart series={metrics.series} granularity={metrics.granularity} />
              )}
            </Panel>

            <Panel id="channels" title="Revenue by channel">
              {!metrics ? (
                <div className="flex items-center gap-6">
                  <Skeleton className="size-36 rounded-full" />
                  <div className="flex-1 space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ) : metrics.channels.length === 0 ? (
                <NoData />
              ) : (
                <ChannelDonut channels={metrics.channels} />
              )}
            </Panel>
          </div>

          <Panel
            id="orders"
            title="Orders"
            aside={
              metrics && metrics.series.length > 0 ? (
                <span className="text-xs text-muted">
                  Avg. order{" "}
                  <span className="tabular font-medium text-ink">
                    {formatCurrency(
                      metrics.kpis.find((k) => k.key === "revenue")!.value /
                        metrics.kpis.find((k) => k.key === "orders")!.value,
                    )}
                  </span>
                </span>
              ) : null
            }
          >
            {!metrics ? (
              <Skeleton className="h-[230px] w-full" />
            ) : metrics.series.length === 0 ? (
              <NoData />
            ) : (
              <OrdersChart series={metrics.series} granularity={metrics.granularity} />
            )}
          </Panel>
        </div>
      )}

      <div id="transactions" className="scroll-mt-20">
        <TransactionsTable simulate={simulate} />
      </div>
    </div>
  );
}

function Panel({
  id,
  title,
  aside,
  className = "",
  children,
}: {
  id: string;
  title: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-20 rounded-2xl border border-line bg-surface p-4 sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={`${id}-title`} className="font-semibold">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function NoData() {
  return (
    <EmptyState title="No data for this period" body="Nothing was recorded in this range. Try a wider date range." />
  );
}
