"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * useSetToggle — manages a Set<string> with toggle/toggleAll semantics and
 * optional localStorage persistence.
 *
 * The pattern of toggling items in/out of a set and persisting to storage
 * is reusable across any multi-select toggle interface (tool toggles,
 * feature flags, column visibility, etc.).
 */

export interface UseSetToggleOptions {
  /** persist to localStorage under this key */
  storageKey?: string;
  /** nested field name within the stored object */
  storageField?: string;
}

export interface UseSetToggleResult {
  selected: Set<string>;
  toggle: (item: string) => void;
  toggleAll: (items: string[], enable: boolean) => void;
  has: (item: string) => boolean;
  clear: () => void;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function useSetToggle(options: UseSetToggleOptions = {}): UseSetToggleResult {
  const { storageKey, storageField = "items" } = options;

  const [selected, setSelected] = useState<Set<string>>(() => {
    if (storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          const arr = storageField ? parsed[storageField] : parsed;
          if (Array.isArray(arr)) return new Set(arr as string[]);
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

  const toggle = useCallback((item: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }, []);

  const toggleAll = useCallback((items: string[], enable: boolean) => {
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
    (item: string) => selected.has(item),
    [selected],
  );

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  return { selected, toggle, toggleAll, has, clear, setSelected };
}
