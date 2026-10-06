"use client";

import { useCallback, useEffect, useState } from "react";

/** Responses keyed by URL: revisiting a page/filter/range never refetches within a session. */
const cache = new Map<string, unknown>();
const MAX_ENTRIES = 60;

function remember(url: string, value: unknown) {
  cache.set(url, value);
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value!);
}

export class ApiError extends Error {}

interface Settled<T> {
  url: string;
  data?: T;
  error?: ApiError;
}

export interface ApiState<T> {
  /** Data for the current URL, if available. */
  data: T | undefined;
  /** Last successful data for any URL — lets tables keep their shape while the next page loads. */
  previous: T | undefined;
  isLoading: boolean;
  error: ApiError | undefined;
  retry: () => void;
}

export function useApi<T>(url: string): ApiState<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [lastGood, setLastGood] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (cache.has(url)) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new ApiError(body?.error ?? `Request failed (${res.status})`);
        remember(url, body);
        setSettled({ url, data: body as T });
        setLastGood(body as T);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof ApiError ? err.message : "Network error — check your connection.";
        setSettled({ url, error: new ApiError(message) });
      });
    return () => controller.abort();
  }, [url, attempt]);

  const fromCache = cache.get(url) as T | undefined;
  const current = settled?.url === url ? settled : null;
  const data = fromCache ?? current?.data;
  const error = data ? undefined : current?.error;

  const retry = useCallback(() => {
    setSettled(null);
    setAttempt((n) => n + 1);
  }, []);

  return {
    data,
    previous: data ?? lastGood,
    isLoading: !data && !error,
    error,
    retry,
  };
}
