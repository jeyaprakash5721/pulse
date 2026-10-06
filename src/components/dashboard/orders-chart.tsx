"use client";

import { useState } from "react";
import { niceTicks } from "@/lib/chart";
import { formatAxisDate, formatBucket, formatNumber } from "@/lib/format";
import { useElementWidth } from "@/lib/use-element-width";
import type { MetricsResponse } from "@/lib/types";

const H = 200;
const BOTTOM = 22;

export function OrdersChart({ series, granularity }: Pick<MetricsResponse, "series" | "granularity">) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const plotH = H - BOTTOM;
  const values = series.map((p) => p.orders);
  const ticks = niceTicks(Math.max(...values), 3);
  const max = ticks[ticks.length - 1];
  const slot = width / Math.max(1, series.length);
  const barW = Math.max(2, Math.min(28, slot * 0.62));
  const labelEvery = Math.ceil(series.length / Math.max(2, Math.floor(width / 64)));
  const peak = values.indexOf(Math.max(...values));
  const shown = active ?? peak;

  return (
    <div>
      <p className="mb-3 text-xs text-muted" aria-live="polite">
        <span className="font-medium text-ink">{formatBucket(series[shown].date, granularity)}</span> ·{" "}
        <span className="tabular">{formatNumber(values[shown])} orders</span>
        {active === null && " (peak)"}
      </p>
      <div
        ref={ref}
        className="relative h-[200px] touch-pan-y select-none"
        onPointerMove={(e) => {
          const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
          setActive(Math.min(series.length - 1, Math.max(0, Math.floor(x / slot))));
        }}
        onPointerLeave={() => setActive(null)}
      >
        {width > 0 && (
          <svg
            width={width}
            height={H}
            role="img"
            aria-label={`Orders per ${granularity}, peak ${formatNumber(values[peak])}`}
          >
            {ticks.slice(1).map((tick) => {
              const y = plotH - (tick / max) * plotH;
              return <line key={tick} x1={0} x2={width} y1={y} y2={y} stroke="var(--line)" strokeDasharray="3 4" />;
            })}
            {values.map((v, i) => {
              const h = Math.max(2, (v / max) * plotH);
              const x = i * slot + (slot - barW) / 2;
              return (
                <rect
                  key={series[i].date}
                  x={x}
                  y={plotH - h}
                  width={barW}
                  height={h}
                  rx={Math.min(4, barW / 2)}
                  fill={i === shown ? "var(--accent)" : "var(--ink)"}
                  fillOpacity={i === shown ? 1 : 0.14}
                  className="transition-[fill-opacity] duration-150"
                />
              );
            })}
            {series.map((p, i) =>
              i % labelEvery === 0 ? (
                <text
                  key={p.date}
                  x={i * slot + slot / 2}
                  y={H - 4}
                  textAnchor={i * slot + slot / 2 < 28 ? "start" : i * slot + slot / 2 > width - 28 ? "end" : "middle"}
                  className="fill-muted text-[11px]"
                >
                  {formatAxisDate(p.date, granularity)}
                </text>
              ) : null,
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
