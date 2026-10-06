"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Query-string state that updates via the native History API: shareable URLs and
 * back/forward support without triggering a server round-trip for the page.
 */
export function useUrlState() {
  const params = useSearchParams();

  const update = useCallback(
    (patch: Record<string, string | number | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const query = next.toString();
      window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    },
    [params],
  );

  return [params, update] as const;
}
