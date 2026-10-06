import { getMetrics } from "@/lib/data/metrics";
import { areaPath, linePath, project } from "@/lib/chart";
import { formatChange, formatCompactCurrency, formatKpi } from "@/lib/format";

const W = 640;
const H = 180;

/** Static, server-rendered peek at the product — built from the same data layer as the real dashboard. */
export function ProductPreview() {
  const metrics = getMetrics("30d");
  const values = metrics.series.map((p) => p.revenue);
  const previous = metrics.series.map((p) => p.previousRevenue);
  const max = Math.max(...values, ...previous) * 1.08;
  const points = project(values, W, H, max);
  const prevPoints = project(previous, W, H, max);
  const last = points[points.length - 1];

  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        aria-hidden="true"
        className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_30%,var(--accent-soft),transparent)] blur-2xl"
      />

      <figure className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_80px_-40px_rgba(22,20,15,0.35)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-chart-muted" />
          <span className="size-2.5 rounded-full bg-chart-muted" />
          <span className="size-2.5 rounded-full bg-chart-muted" />
          <span className="ml-3 truncate rounded-md bg-surface-2 px-3 py-1 font-mono text-[11px] text-muted">
            app.pulse.io/overview
          </span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {metrics.kpis.map((kpi) => (
            <div key={kpi.key} className="bg-surface p-4 sm:p-5">
              <p className="text-xs text-muted">{kpi.label}</p>
              <p className="tabular mt-1 text-lg font-semibold tracking-tight sm:text-2xl">
                {kpi.format === "currency" ? formatCompactCurrency(kpi.value) : formatKpi(kpi.value, kpi.format)}
              </p>
              <p className={`tabular mt-1 text-xs font-medium ${kpi.change >= 0 ? "text-positive" : "text-negative"}`}>
                {formatChange(kpi.change)} <span className="font-normal text-muted">vs last 30d</span>
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-line p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between text-xs text-muted">
            <span className="font-medium text-ink">Revenue · last 30 days</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 rounded bg-accent" /> This period
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <span className="h-0.5 w-3 rounded bg-chart-muted" /> Previous
              </span>
            </span>
          </div>
          <div className="relative h-36 sm:h-48">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="size-full overflow-visible"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={linePath(prevPoints)}
                fill="none"
                stroke="var(--chart-muted)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <path d={areaPath(points, H)} fill="url(#preview-fill)" />
              <path
                d={linePath(points)}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.25"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* HTML dot so it stays round while the SVG stretches. */}
            <span
              aria-hidden="true"
              className="absolute size-2.5 -translate-1/2"
              style={{ left: `${(last.x / W) * 100}%`, top: `${(last.y / H) * 100}%` }}
            >
              <span className="pulse-dot absolute inset-0 rounded-full bg-accent" />
              <span className="absolute inset-0 rounded-full bg-accent" />
            </span>
          </div>
        </div>
      </figure>

      {/* Floating alert — shows the product's "tell me before it hurts" promise. */}
      <div className="absolute -bottom-6 left-3 hidden w-72 rounded-xl border border-line bg-surface p-4 shadow-xl sm:block md:-left-8">
        <p className="flex items-center gap-2 text-xs font-medium text-warning">
          <span className="size-1.5 rounded-full bg-warning" /> Anomaly · 2m ago
        </p>
        <p className="mt-1.5 text-sm text-ink">Refunds on Starter are 3.1× above the Tuesday baseline.</p>
      </div>
      <div className="absolute -top-5 right-3 hidden rounded-xl border border-line bg-surface px-4 py-3 shadow-xl sm:block md:-right-8">
        <p className="text-xs text-muted">New order · Growth plan</p>
        <p className="tabular text-lg font-semibold text-positive">+$249.00</p>
      </div>
    </div>
  );
}
