"use client";
import { useState, useCallback, useEffect, useRef } from "react";
export default function useClipboard(resetMs = 2000) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current)
                clearTimeout(timerRef.current);
        };
    }, []);
    const copy = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            if (timerRef.current)
                clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), resetMs);
            return true;
        }
        catch {
            setCopied(false);
            return false;
        }
    }, [resetMs]);
    return { copy, copied };
}
//# sourceMappingURL=useClipboard.js.map