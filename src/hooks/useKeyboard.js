"use client";

import { useEffect, useRef } from "react";

/**
 * useKeyboard — global keyboard shortcut listener with modifier support.
 *
 * Registers document-level keydown handlers for keyboard shortcuts.
 * Automatically ignores events when the user is typing in inputs/textareas.
 *
 * @param {Object<string, Function>} keyMap — map of key combos to handlers
 *   Key format: "ctrl+k", "shift+enter", "escape", "ctrl+shift+p"
 * @param {object} [options]
 * @param {boolean} [options.enabled=true] — set false to pause listening
 * @param {boolean} [options.ignoreInputs=true] — ignore when focused on form elements
 */
export default function useKeyboard(keyMap, options = {}) {
  const { enabled = true, ignoreInputs = true } = options;
  const keyMapRef = useRef(keyMap);
  keyMapRef.current = keyMap;

  useEffect(() => {
    if (!enabled) return;

    const handler = (event) => {
      // Skip when focused on form elements
      if (ignoreInputs) {
        const tag = event.target?.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          event.target?.isContentEditable
        ) {
          // Still allow Escape from inputs
          if (event.key !== "Escape") return;
        }
      }

      const parts = [];
      if (event.ctrlKey || event.metaKey) parts.push("ctrl");
      if (event.shiftKey) parts.push("shift");
      if (event.altKey) parts.push("alt");
      parts.push(event.key.toLowerCase());

      const combo = parts.join("+");
      const fn = keyMapRef.current[combo];
      if (fn) {
        event.preventDefault();
        fn(event);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [enabled, ignoreInputs]);
}
