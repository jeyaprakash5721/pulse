import type { Kpi } from "@/lib/types";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const currencyCents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const number = new Intl.NumberFormat("en-US");
const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const signedPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

export const formatCurrency = (v: number) => currency.format(v);
export const formatCents = (v: number) => currencyCents.format(v);
export const formatCompactCurrency = (v: number) => compactCurrency.format(v);
export const formatNumber = (v: number) => number.format(v);
export const formatCompactNumber = (v: number) => compactNumber.format(v);
export const formatChange = (v: number) => signedPercent.format(v);

export function formatKpi(value: number, format: Kpi["format"]) {
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") return percent.format(value);
  return formatNumber(value);
}

const dateShort = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const monthShort = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatBucket(iso: string, granularity: "day" | "week" | "month") {
  const d = new Date(iso);
  if (granularity === "month") return monthShort.format(d);
  return granularity === "week" ? `Wk of ${dateShort.format(d)}` : dateShort.format(d);
}

export const formatAxisDate = (iso: string, granularity: "day" | "week" | "month") =>
  granularity === "month" ? monthShort.format(new Date(iso)) : dateShort.format(new Date(iso));

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
