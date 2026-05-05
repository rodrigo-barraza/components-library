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
 *
 * @param {() => Promise<T>} fetcher — async function that returns data
 * @param {object} [options]
 * @param {boolean} [options.enabled=true] — set false to skip fetch
 * @param {any[]} [options.deps=[]] — additional deps that trigger re-fetch
 * @param {(data: T) => any} [options.transform] — optional transform before storing
 * @returns {{ data: T|null, loading: boolean, error: string|null, refresh: () => Promise<void> }}
 */
export default function useFetch(fetcher, options = {}) {
  const { enabled = true, deps = [], transform } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        : result;
      setData(value);
    } catch (err) {
      setError(err.message);
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
