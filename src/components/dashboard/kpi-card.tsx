import { linePath, project } from "@/lib/chart";
import { formatChange, formatKpi } from "@/lib/format";
import type { Kpi } from "@/lib/types";
import { Skeleton } from "@/components/dashboard/states";

const W = 120;
const H = 36;

export function KpiCard({ kpi, rangeLabel }: { kpi: Kpi; rangeLabel: string }) {
  const up = kpi.change >= 0;
  const min = Math.min(...kpi.spark);
  // Sparkline shows shape, not magnitude: normalise to the visible band.
  const points = project(
    kpi.spark.map((v) => v - min * 0.92),
    W,
    H,
  );

  return (
    <article className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm text-muted">{kpi.label}</h3>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-8 w-20 shrink-0 overflow-visible"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={linePath(points)}
            fill="none"
            stroke={up ? "var(--positive)" : "var(--negative)"}
            strokeWidth="1.75"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <p className="tabular mt-1 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
        {formatKpi(kpi.value, kpi.format)}
      </p>
      <p className="mt-2 text-xs text-muted">
        <span
          className={`tabular mr-1.5 inline-flex rounded-full px-1.5 py-0.5 font-medium ${
            up ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
          }`}
        >
          <span aria-hidden="true">{up ? "↑" : "↓"}</span>
          <span className="sr-only">{up ? "Up" : "Down"}</span> {formatChange(Math.abs(kpi.change)).replace("+", "")}
        </span>
        vs previous {rangeLabel}
      </p>
    </article>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-3 h-8 w-32" />
      <Skeleton className="mt-4 h-5 w-full" />
    </div>
  );
}
