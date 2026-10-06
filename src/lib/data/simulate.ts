/**
 * Mock-API realism: a short network-like delay, plus opt-in failure/empty modes
 * (`?simulate=error` / `?simulate=empty`) so every UI state can be demoed.
 */
export async function simulateNetwork(params: URLSearchParams): Promise<Response | null> {
  await new Promise((resolve) => setTimeout(resolve, 280 + Math.random() * 320));
  if (params.get("simulate") === "error") {
    return Response.json({ error: "The analytics service is temporarily unavailable." }, { status: 503 });
  }
  return null;
}

export function isEmptySimulation(params: URLSearchParams) {
  return params.get("simulate") === "empty";
}

export const NO_STORE = { "Cache-Control": "no-store" };
