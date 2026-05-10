"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * useSetToggle — manages a Set<string> with toggle/toggleAll semantics and
 * optional localStorage persistence.
 *
 * The pattern of toggling items in/out of a set and persisting to storage
 * is reusable across any multi-select toggle interface (tool toggles,
 * feature flags, column visibility, etc.).
 *
 * @param {object} [options]
 * @param {string} [options.storageKey] — persist to localStorage under this key
 * @param {string} [options.storageField] — nested field name within the stored object
 * @returns {{
 *   selected: Set<string>,
 *   toggle: (item: string) => void,
 *   toggleAll: (items: string[], enable: boolean) => void,
 *   has: (item: string) => boolean,
 *   clear: () => void,
 *   setSelected: Function,
 * }}
 */
export default function useSetToggle(options = {}) {
  const { storageKey, storageField = "items" } = options;

  const [selected, setSelected] = useState(() => {
    if (storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          const arr = storageField ? parsed[storageField] : parsed;
          if (Array.isArray(arr)) return new Set(arr);
        }
      } catch {
        /* localStorage unavailable */
      }
    }
    return new Set();
  });

  // Persist to localStorage on change
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!storageKey) return;
    try {
      const existing = localStorage.getItem(storageKey);
      const current = existing ? JSON.parse(existing) : {};
      const payload = storageField
        ? { ...current, [storageField]: [...selected] }
        : [...selected];
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      /* localStorage unavailable */
    }
  }, [selected, storageKey, storageField]);

  const toggle = useCallback((item) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }, []);

  const toggleAll = useCallback((items, enable) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const item of items) {
        if (enable) next.delete(item);
        else next.add(item);
      }
      return next;
    });
  }, []);

  const has = useCallback(
    (item) => selected.has(item),
    [selected],
  );

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  return { selected, toggle, toggleAll, has, clear, setSelected };
}
