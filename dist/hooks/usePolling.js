"use client";
import { useState, useCallback, useEffect, useRef } from "react";
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
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (!enabled)
            return;
        // Immediate fetch
        const timeout = setTimeout(() => refresh(), 0);
        // Recurring poll
        let interval;
        if (intervalMs > 0) {
            interval = setInterval(refresh, intervalMs);
        }
        return () => {
            clearTimeout(timeout);
            if (interval)
                clearInterval(interval);
        };
    }, [enabled, intervalMs, refresh]);
    return { data, loading, error, refresh };
}
//# sourceMappingURL=usePolling.js.map