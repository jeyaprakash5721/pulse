"use client";

import { useId, useState } from "react";
import { areaPath, linePath, niceTicks, project } from "@/lib/chart";
import { formatAxisDate, formatBucket, formatChange, formatCompactCurrency, formatCurrency } from "@/lib/format";
import { useElementWidth } from "@/lib/use-element-width";
import type { MetricsResponse } from "@/lib/types";

const H = 240;
const AXIS_W = 48;
const BOTTOM = 24;

export function RevenueChart({ series, granularity }: Pick<MetricsResponse, "series" | "granularity">) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();

  const plotW = Math.max(0, width - AXIS_W);
  const plotH = H - BOTTOM;
  const current = series.map((p) => p.revenue);
  const previous = series.map((p) => p.previousRevenue);
  const ticks = niceTicks(Math.max(...current, ...previous));
  const max = ticks[ticks.length - 1];
  const points = project(current, plotW, plotH, max, 0);
  const prevPoints = project(previous, plotW, plotH, max, 0);

  const labelEvery = Math.ceil(series.length / Math.max(2, Math.floor(plotW / 72)));
  const total = current.reduce((a, b) => a + b, 0);

  function indexFromPointer(clientX: number, rect: DOMRect) {
    const x = clientX - rect.left - AXIS_W;
    const step = plotW / Math.max(1, series.length - 1);
    return Math.min(series.length - 1, Math.max(0, Math.round(x / step)));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowRight" ? 1 : -1;
    setActive((i) => Math.min(series.length - 1, Math.max(0, (i ?? (delta > 0 ? -1 : series.length)) + delta)));
  }

  const point = active !== null ? series[active] : null;
  const change = point && point.previousRevenue ? (point.revenue - point.previousRevenue) / point.previousRevenue : 0;

  return (
    <div
      ref={ref}
      className="relative h-[240px] touch-pan-y outline-none select-none"
      role="img"
      tabIndex={0}
      aria-label={`Revenue chart, ${series.length} points totalling ${formatCurrency(total)}. Use arrow keys to inspect values.`}
      onPointerMove={(e) => setActive(indexFromPointer(e.clientX, e.currentTarget.getBoundingClientRect()))}
      onPointerLeave={() => setActive(null)}
      onKeyDown={onKeyDown}
      onBlur={() => setActive(null)}
    >
      {width > 0 && (
        <svg width={width} height={H} className="overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.24" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => {
            const y = plotH - (tick / max) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={AXIS_W}
                  x2={width}
                  y1={y}
                  y2={y}
                  stroke="var(--line)"
                  strokeDasharray={tick ? "3 4" : undefined}
                />
                <text x={AXIS_W - 10} y={y + 4} textAnchor="end" className="tabular fill-muted text-[11px]">
                  {formatCompactCurrency(tick)}
                </text>
              </g>
            );
          })}

          <g transform={`translate(${AXIS_W},0)`}>
            <path
              d={linePath(prevPoints)}
              fill="none"
              stroke="var(--chart-muted)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path d={areaPath(points, plotH)} fill={`url(#${gradientId})`} />
            <path d={linePath(points)} fill="none" stroke="var(--accent)" strokeWidth="2.25" strokeLinejoin="round" />

            {series.map((p, i) =>
              i % labelEvery === 0 ? (
                <text
                  key={p.date}
                  x={points[i].x}
                  y={H - 4}
                  textAnchor={i === 0 ? "start" : points[i].x > plotW - 28 ? "end" : "middle"}
                  className="fill-muted text-[11px]"
                >
                  {formatAxisDate(p.date, granularity)}
                </text>
              ) : null,
            )}

            {active !== null && (
              <g>
                <line
                  x1={points[active].x}
                  x2={points[active].x}
                  y1={0}
                  y2={plotH}
                  stroke="var(--ink)"
                  strokeOpacity="0.25"
                />
                <circle
                  cx={prevPoints[active].x}
                  cy={prevPoints[active].y}
                  r="3.5"
                  fill="var(--surface)"
                  stroke="var(--chart-muted)"
                  strokeWidth="2"
                />
                <circle
                  cx={points[active].x}
                  cy={points[active].y}
                  r="5"
                  fill="var(--accent)"
                  stroke="var(--surface)"
                  strokeWidth="2.5"
                />
              </g>
            )}
          </g>
        </svg>
      )}

      {point && active !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 w-44 rounded-xl border border-line bg-surface p-3 text-xs shadow-lg"
          style={{
            left: Math.min(Math.max(AXIS_W + points[active].x - 88, 0), width - 176),
          }}
        >
          <p className="font-medium text-muted">{formatBucket(point.date, granularity)}</p>
          <p className="tabular mt-1 text-base font-semibold text-ink">{formatCurrency(point.revenue)}</p>
          <p className="tabular mt-1 text-muted">
            Prev. {formatCurrency(point.previousRevenue)}{" "}
            <span className={change >= 0 ? "text-positive" : "text-negative"}>{formatChange(change)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
