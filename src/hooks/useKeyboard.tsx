"use client";

import { useEffect, useRef } from "react";

/**
 * useKeyboard — global keyboard shortcut listener with modifier support.
 *
 * Registers document-level keydown handlers for keyboard shortcuts.
 * Automatically ignores events when the user is typing in inputs/textareas.
 *
 * Key format: "ctrl+k", "shift+enter", "escape", "ctrl+shift+p"
 */

interface UseKeyboardOptions {
  /** set false to pause listening */
  enabled?: boolean;
  /** ignore when focused on form elements */
  ignoreInputs?: boolean;
}

export default function useKeyboard(
  keyMap: Record<string, (event: KeyboardEvent) => void>,
  options: UseKeyboardOptions = {},
): void {
  const { enabled = true, ignoreInputs = true } = options;
  const keyMapRef = useRef(keyMap);
  keyMapRef.current = keyMap;

  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      // Skip when focused on form elements
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        const tag = target?.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target?.isContentEditable
        ) {
          // Still allow Escape from inputs
          if (event.key !== "Escape") return;
        }
      }

      const parts: string[] = [];
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
