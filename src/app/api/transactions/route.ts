import type { NextRequest } from "next/server";
import { queryTransactions } from "@/lib/data/transactions";
import { parseTransactionsQuery } from "@/lib/query";
import { isEmptySimulation, NO_STORE, simulateNetwork } from "@/lib/data/simulate";
import type { TransactionsResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const failure = await simulateNetwork(params);
  if (failure) return failure;

  const query = parseTransactionsQuery(params);
  if (isEmptySimulation(params)) {
    const empty: TransactionsResponse = {
      data: [],
      page: 1,
      pageSize: query.pageSize,
      total: 0,
      totalPages: 1,
      statusCounts: { all: 0, paid: 0, pending: 0, refunded: 0, failed: 0 },
    };
    return Response.json(empty, { headers: NO_STORE });
  }
  return Response.json(queryTransactions(query), { headers: NO_STORE });
}
