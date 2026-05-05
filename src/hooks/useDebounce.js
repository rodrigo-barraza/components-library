"use client";

import { useEffect, useRef } from "react";

/**
 * useDebounce — debounces a callback by the given delay.
 *
 * Common in search inputs, filter bars, and any high-frequency user input
 * that triggers API calls. Returns a stable debounced function that cleans
 * up on unmount.
 *
 * @param {Function} callback — the function to debounce
 * @param {number} delay — debounce delay in milliseconds
 * @returns {Function} debounced version of callback
 */
export default function useDebounce(callback, delay) {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);

  // Keep callback ref in sync
  callbackRef.current = callback;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
}
