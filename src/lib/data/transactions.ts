import { createRandom, DAY, todayUtc } from "@/lib/random";
import type { Customer, PlanName, SortField, Transaction, TransactionsQuery, TransactionsResponse } from "@/lib/types";

const FIRST = [
  "Ava",
  "Noah",
  "Maya",
  "Leo",
  "Zara",
  "Ethan",
  "Ines",
  "Kenji",
  "Priya",
  "Omar",
  "Lena",
  "Theo",
  "Aisha",
  "Mateo",
  "Freya",
  "Ravi",
  "Chloe",
  "Diego",
  "Hana",
  "Felix",
  "Nora",
  "Arjun",
  "Sofia",
  "Elias",
];
const LAST = [
  "Okafor",
  "Lindqvist",
  "Tanaka",
  "Moreau",
  "Haddad",
  "Novak",
  "Reyes",
  "Iyer",
  "Brennan",
  "Kowalski",
  "Mensah",
  "Castillo",
  "Sato",
  "Fischer",
  "Rahman",
  "Duarte",
  "Kim",
  "Albers",
  "Nakamura",
  "Osei",
];
const COMPANIES = [
  "Northwind",
  "Lumen Labs",
  "Brightfold",
  "Copperline",
  "Fieldnote",
  "Halcyon",
  "Kitebird",
  "Meridian Co",
  "Oakhaven",
  "Parcelpoint",
  "Quillstack",
  "Riverstone",
  "Saltwater",
  "Tidewell",
  "Upland",
  "Verdant",
  "Wavelength",
  "Yellowtail",
];
const COUNTRIES = ["US", "GB", "DE", "IN", "JP", "BR", "FR", "CA", "AU", "NL", "SG", "ES"];

const PLAN_PRICE: Record<PlanName, [number, number]> = { Starter: [19, 49], Growth: [79, 249], Scale: [399, 1490] };

let cache: { anchor: number; rows: Transaction[] } | null = null;

function allTransactions(): Transaction[] {
  const anchor = todayUtc();
  if (cache?.anchor === anchor) return cache.rows;

  const rand = createRandom(424242);
  const generatedAt = Date.now();
  const customers: Customer[] = Array.from({ length: 140 }, (_, i) => {
    const first = rand.pick(FIRST);
    const last = rand.pick(LAST);
    const company = rand.pick(COMPANIES);
    return {
      id: `CUS-${(1000 + i).toString(36).toUpperCase()}`,
      name: `${first} ${last}`,
      email: `${first}.${last}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`.toLowerCase(),
      company,
      country: rand.pick(COUNTRIES),
    };
  });

  const rows: Transaction[] = Array.from({ length: 612 }, (_, i) => {
    const plan = rand.weighted([
      ["Starter", 5],
      ["Growth", 3.5],
      ["Scale", 1.2],
    ] as const);
    const [min, max] = PLAN_PRICE[plan];
    // Skew towards recent days so the table feels alive.
    const daysAgo = Math.floor(Math.pow(rand.next(), 1.6) * 120);
    const t = generatedAt - daysAgo * DAY - rand.int(60_000, DAY - 1);
    return {
      id: `TX-${(48210 + i * 7).toString()}`,
      customer: rand.pick(customers),
      plan,
      amount: Math.round(rand.between(min, max) * 100) / 100,
      status: rand.weighted([
        ["paid", 82],
        ["pending", 9],
        ["refunded", 5],
        ["failed", 4],
      ] as const),
      method: rand.weighted([
        ["Card", 7],
        ["ACH", 2],
        ["PayPal", 1.5],
      ] as const),
      date: new Date(t).toISOString(),
    };
  });

  cache = { anchor, rows };
  return rows;
}

const compare: Record<SortField, (a: Transaction, b: Transaction) => number> = {
  date: (a, b) => a.date.localeCompare(b.date),
  amount: (a, b) => a.amount - b.amount,
  customer: (a, b) => a.customer.name.localeCompare(b.customer.name),
};

export function queryTransactions(query: TransactionsQuery): TransactionsResponse {
  const needle = query.q.toLowerCase();
  const matchesSearch = (t: Transaction) =>
    !needle ||
    t.id.toLowerCase().includes(needle) ||
    t.customer.name.toLowerCase().includes(needle) ||
    t.customer.email.includes(needle) ||
    t.customer.company.toLowerCase().includes(needle);

  // Status counts ignore the status filter so the tabs can show what each would return.
  const searched = allTransactions().filter((t) => matchesSearch(t) && (query.plan === "all" || t.plan === query.plan));
  const statusCounts = { all: searched.length, paid: 0, pending: 0, refunded: 0, failed: 0 };
  for (const t of searched) statusCounts[t.status]++;

  const filtered = query.status === "all" ? searched : searched.filter((t) => t.status === query.status);
  const sign = query.dir === "asc" ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => sign * compare[query.sort](a, b) || b.date.localeCompare(a.date));

  const totalPages = Math.max(1, Math.ceil(sorted.length / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * query.pageSize;

  return {
    data: sorted.slice(start, start + query.pageSize),
    page,
    pageSize: query.pageSize,
    total: sorted.length,
    totalPages,
    statusCounts,
  };
}
