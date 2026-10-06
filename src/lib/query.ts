import type { PlanName, SortDir, SortField, TransactionStatus, TransactionsQuery } from "@/lib/types";

/** Shared by the API route (validation) and the dashboard (reading URL state) — no data, safe for the client bundle. */
export const STATUSES: TransactionStatus[] = ["paid", "pending", "refunded", "failed"];
export const PLANS: PlanName[] = ["Starter", "Growth", "Scale"];
export const PAGE_SIZES = [10, 20, 50];
const SORT_FIELDS: SortField[] = ["date", "amount", "customer"];

/** Parse and clamp untrusted query params into a valid query. */
export function parseTransactionsQuery(params: URLSearchParams): TransactionsQuery {
  const status = params.get("status");
  const plan = params.get("plan");
  const sort = params.get("sort");
  const dir = params.get("dir");
  const pageSize = Number(params.get("pageSize"));
  const page = Number(params.get("page"));
  return {
    q: (params.get("q") ?? "").trim().slice(0, 80),
    status: STATUSES.includes(status as TransactionStatus) ? (status as TransactionStatus) : "all",
    plan: PLANS.includes(plan as PlanName) ? (plan as PlanName) : "all",
    sort: SORT_FIELDS.includes(sort as SortField) ? (sort as SortField) : "date",
    dir: dir === "asc" ? "asc" : ("desc" satisfies SortDir),
    pageSize: PAGE_SIZES.includes(pageSize) ? pageSize : 10,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}
