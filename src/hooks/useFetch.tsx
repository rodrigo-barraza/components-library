"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useFetch — one-shot async data fetching with loading/error state.
 *
 * Extracts the repeated pattern across ledger hooks (useContracts,
 * useExpenses, useInvoices, useDashboard, useExport, useAccount):
 * fetch on mount → manage loading/error → expose refresh().
 *
 * For polling, compose with usePolling instead.
 */

export interface UseFetchOptions<T, R = T> {
  /** set false to skip fetch */
  enabled?: boolean;
  /** additional deps that trigger re-fetch */
  deps?: unknown[];
  /** optional transform before storing */
  transform?: (data: T) => R;
}

export interface UseFetchResult<R> {
  data: R | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export default function useFetch<T, R = T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions<T, R> = {},
): UseFetchResult<R> {
  const { enabled = true, deps = [], transform } = options;
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  const transformRef = useRef(transform);

  // Keep refs in sync without causing re-fetch
  fetcherRef.current = fetcher;
  transformRef.current = transform;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      const value = transformRef.current
        ? transformRef.current(result)
        : (result as unknown as R);
      setData(value);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    refresh();
  }, [enabled, refresh, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refresh };
}
