"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * usePolling — periodic data fetching with automatic cleanup.
 *
 * Fetches on mount, polls at interval, and cleans up on unmount.
 *
 * @param {() => Promise<T>} fetcher — async function that returns data
 * @param {number} intervalMs — polling interval in milliseconds (0 = no polling)
 * @param {object} [options]
 * @param {boolean} [options.enabled=true] — set false to pause polling
 * @param {(data: T) => any} [options.transform] — optional transform before storing
 * @returns {{ data: T|null, loading: boolean, error: string|null, refresh: () => Promise<void> }}
 */
export default function usePolling(fetcher, intervalMs, options = {}) {
  const { enabled = true, transform } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  const transformRef = useRef(transform);

  // Keep refs in sync without causing re-fetch on every render
  fetcherRef.current = fetcher;
  transformRef.current = transform;

  const refresh = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      const value = transformRef.current
        ? transformRef.current(result)
        : result;
      setData(value);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Immediate fetch
    const timeout = setTimeout(() => refresh(), 0);

    // Recurring poll
    let interval;
    if (intervalMs > 0) {
      interval = setInterval(refresh, intervalMs);
    }

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [enabled, intervalMs, refresh]);

  return { data, loading, error, refresh };
}
