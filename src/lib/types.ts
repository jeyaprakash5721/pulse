export type Range = "7d" | "30d" | "90d" | "12m";

export type KpiKey = "revenue" | "users" | "conversion" | "orders";

export interface Kpi {
  key: KpiKey;
  label: string;
  value: number;
  previous: number;
  /** Fractional change vs. previous period, e.g. 0.124 = +12.4% */
  change: number;
  format: "currency" | "number" | "percent";
  spark: number[];
}

export interface SeriesPoint {
  /** ISO date marking the start of the bucket */
  date: string;
  revenue: number;
  previousRevenue: number;
  orders: number;
}

export interface ChannelShare {
  channel: string;
  revenue: number;
}

export interface MetricsResponse {
  range: Range;
  granularity: "day" | "week" | "month";
  kpis: Kpi[];
  series: SeriesPoint[];
  channels: ChannelShare[];
  generatedAt: string;
}

export type TransactionStatus = "paid" | "pending" | "refunded" | "failed";
export type PlanName = "Starter" | "Growth" | "Scale";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
}

export interface Transaction {
  id: string;
  customer: Customer;
  plan: PlanName;
  amount: number;
  status: TransactionStatus;
  method: "Card" | "ACH" | "PayPal";
  date: string;
}

export type SortField = "date" | "amount" | "customer";
export type SortDir = "asc" | "desc";

export interface TransactionsQuery {
  q: string;
  status: TransactionStatus | "all";
  plan: PlanName | "all";
  sort: SortField;
  dir: SortDir;
  page: number;
  pageSize: number;
}

export interface TransactionsResponse {
  data: Transaction[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  statusCounts: Record<TransactionStatus | "all", number>;
}
