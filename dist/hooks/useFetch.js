"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
        }
        catch (error) {
            setError(error.message);
        }
        finally {
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
//# sourceMappingURL=useFetch.js.map