"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * usePolling — periodic data fetching with automatic cleanup.
 *
 * Fetches on mount, polls at interval, and cleans up on unmount.
 */

export interface UsePollingOptions<T, R = T> {
  /** set false to pause polling */
  enabled?: boolean;
  /** optional transform before storing */
  transform?: (data: T) => R;
}

export interface UsePollingResult<R> {
  data: R | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export default function usePolling<T, R = T>(
  fetcher: () => Promise<T>,
  intervalMs: number,
  options: UsePollingOptions<T, R> = {},
): UsePollingResult<R> {
  const { enabled = true, transform } = options;
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        : (result as unknown as R);
      setData(value);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Immediate fetch
    const timeout = setTimeout(() => refresh(), 0);

    // Recurring poll
    let interval: ReturnType<typeof setInterval> | undefined;
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
