"use client";

import { useState, useEffect } from "react";

/**
 * useMediaQuery — reactive CSS media query matcher.
 *
 * Returns a boolean that updates when the media query match state changes.
 * Useful for responsive layout logic, mobile detection, and dark mode
 * preference without relying on CSS alone.
 *
 * @example
 *   const isMobile = useMediaQuery("(max-width: 768px)");
 *   const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
