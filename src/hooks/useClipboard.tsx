"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * useClipboard — copy-to-clipboard with success feedback timeout.
 *
 * Used across CopyButtonComponent and any "copy to clipboard" interaction.
 * Returns a stable copy function and a `copied` boolean that auto-resets.
 */

export interface UseClipboardResult {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
}

export default function useClipboard(resetMs = 2000): UseClipboardResult {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetMs],
  );

  return { copy, copied };
}
