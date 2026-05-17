"use client";
import { useState, useCallback, useEffect, useRef } from "react";
/**
 * useLocalStorage — SSR-safe state synchronization with localStorage.
 *
 * Persists a JSON-serializable value under the given key. Hydrates from
 * localStorage on mount (post-SSR) and writes back on every state change.
 */
export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(initialValue);
    const initializedRef = useRef(false);
    // Hydrate from localStorage on mount (SSR-safe: runs only on client)
    useEffect(() => {
        if (initializedRef.current)
            return;
        initializedRef.current = true;
        try {
            const item = localStorage.getItem(key);
            if (item !== null) {
                setStoredValue(JSON.parse(item));
            }
        }
        catch {
            /* localStorage unavailable or corrupt — keep initialValue */
        }
    }, [key]);
    // Persist to localStorage on change (skip the initial hydration write-back)
    const isFirstWrite = useRef(true);
    useEffect(() => {
        if (isFirstWrite.current) {
            isFirstWrite.current = false;
            return;
        }
        try {
            if (storedValue === undefined || storedValue === null) {
                localStorage.removeItem(key);
            }
            else {
                localStorage.setItem(key, JSON.stringify(storedValue));
            }
        }
        catch {
            /* localStorage unavailable */
        }
    }, [key, storedValue]);
    const setValue = useCallback((value) => {
        setStoredValue((prev) => typeof value === "function" ? value(prev) : value);
    }, []);
    const removeValue = useCallback(() => {
        setStoredValue(initialValue);
        try {
            localStorage.removeItem(key);
        }
        catch {
            /* localStorage unavailable */
        }
    }, [key, initialValue]);
    return [storedValue, setValue, removeValue];
}
//# sourceMappingURL=useLocalStorage.js.map