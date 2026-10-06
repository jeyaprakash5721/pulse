import { createRandom, DAY, todayUtc } from "@/lib/random";
import type { Kpi, MetricsResponse, Range, SeriesPoint } from "@/lib/types";

interface Day {
  t: number;
  visitors: number;
  activeUsers: number;
  orders: number;
  revenue: number;
}

const HISTORY_DAYS = 800;

let cache: { anchor: number; days: Day[] } | null = null;

/** ~two years of daily history: upward trend + weekly seasonality + noise. */
function history(): Day[] {
  const anchor = todayUtc();
  if (cache?.anchor === anchor) return cache.days;

  const rand = createRandom(20260101);
  const days: Day[] = [];
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const t = anchor - i * DAY;
    const progress = 1 - i / HISTORY_DAYS;
    const weekday = new Date(t).getUTCDay();
    const weekly = weekday === 0 || weekday === 6 ? 0.72 : 1 + (weekday === 2 ? 0.08 : 0);
    const growth = 1 + progress * 1.6;
    const noise = rand.between(0.86, 1.14);

    const visitors = Math.round(5200 * growth * weekly * noise);
    const conversion = 0.026 + progress * 0.011 + rand.between(-0.003, 0.003);
    const orders = Math.max(1, Math.round(visitors * conversion));
    const aov = 84 + progress * 22 + rand.between(-9, 9);
    days.push({
      t,
      visitors,
      activeUsers: Math.round(visitors * rand.between(0.34, 0.4)),
      orders,
      revenue: Math.round(orders * aov),
    });
  }
  cache = { anchor, days };
  return days;
}

const RANGE_DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 91, "12m": 364 };
const GRANULARITY: Record<Range, MetricsResponse["granularity"]> = {
  "7d": "day",
  "30d": "day",
  "90d": "week",
  "12m": "month",
};

export const RANGES = Object.keys(RANGE_DAYS) as Range[];

export function isRange(value: string | null): value is Range {
  return value !== null && value in RANGE_DAYS;
}

function sum(days: Day[], key: keyof Omit<Day, "t">) {
  return days.reduce((total, d) => total + d[key], 0);
}

function bucket(days: Day[], granularity: MetricsResponse["granularity"]): Day[][] {
  if (granularity === "day") return days.map((d) => [d]);
  const groups = new Map<string, Day[]>();
  for (const d of days) {
    const date = new Date(d.t);
    const key =
      granularity === "week"
        ? String(Math.floor((d.t - days[0].t) / (7 * DAY)))
        : `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const group = groups.get(key);
    if (group) group.push(d);
    else groups.set(key, [d]);
  }
  return [...groups.values()];
}

function kpi(
  key: Kpi["key"],
  label: string,
  format: Kpi["format"],
  value: number,
  previous: number,
  spark: number[],
): Kpi {
  return { key, label, format, value, previous, change: previous ? (value - previous) / previous : 0, spark };
}

export function getMetrics(range: Range): MetricsResponse {
  const days = history();
  const span = RANGE_DAYS[range];
  const current = days.slice(-span);
  const previous = days.slice(-span * 2, -span);
  const granularity = GRANULARITY[range];

  const currentBuckets = bucket(current, granularity);
  const previousBuckets = bucket(previous, granularity);

  const series: SeriesPoint[] = currentBuckets.map((group, i) => ({
    date: new Date(group[0].t).toISOString(),
    revenue: sum(group, "revenue"),
    previousRevenue: previousBuckets[i] ? sum(previousBuckets[i], "revenue") : 0,
    orders: sum(group, "orders"),
  }));

  const avgActive = (ds: Day[]) => Math.round(sum(ds, "activeUsers") / ds.length);
  const conversion = (ds: Day[]) => sum(ds, "orders") / sum(ds, "visitors");
  const spark = (fn: (ds: Day[]) => number) => currentBuckets.map(fn);

  const revenue = sum(current, "revenue");
  const rand = createRandom(span);
  const channelWeights = [
    ["Organic search", 0.38],
    ["Paid social", 0.24],
    ["Referrals", 0.21],
    ["Partners", 0.17],
  ] as const;
  const channels = channelWeights.map(([channel, weight]) => ({
    channel,
    revenue: Math.round(revenue * weight * rand.between(0.9, 1.1)),
  }));

  return {
    range,
    granularity,
    kpis: [
      kpi(
        "revenue",
        "Revenue",
        "currency",
        revenue,
        sum(previous, "revenue"),
        spark((g) => sum(g, "revenue")),
      ),
      kpi("users", "Active users", "number", avgActive(current), avgActive(previous), spark(avgActive)),
      kpi("conversion", "Conversion", "percent", conversion(current), conversion(previous), spark(conversion)),
      kpi(
        "orders",
        "Orders",
        "number",
        sum(current, "orders"),
        sum(previous, "orders"),
        spark((g) => sum(g, "orders")),
      ),
    ],
    series,
    channels,
    generatedAt: new Date().toISOString(),
  };
}
