import type { NextRequest } from "next/server";
import { getMetrics, isRange } from "@/lib/data/metrics";
import { isEmptySimulation, NO_STORE, simulateNetwork } from "@/lib/data/simulate";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const failure = await simulateNetwork(params);
  if (failure) return failure;

  const range = params.get("range");
  if (!isRange(range)) {
    return Response.json({ error: "range must be one of 7d, 30d, 90d, 12m" }, { status: 400 });
  }

  const metrics = getMetrics(range);
  if (isEmptySimulation(params)) {
    return Response.json({ ...metrics, series: [], channels: [] }, { headers: NO_STORE });
  }
  return Response.json(metrics, { headers: NO_STORE });
}
