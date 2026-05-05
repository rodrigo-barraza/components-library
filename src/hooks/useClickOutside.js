"use client";

import { useEffect, useRef } from "react";

/**
 * useClickOutside — triggers a callback when a click occurs outside the
 * referenced element(s). Essential for dropdown menus, popovers, modals,
 * and any dismissible overlay.
 *
 * @param {React.RefObject|React.RefObject[]} refs — ref(s) to the container element(s)
 * @param {Function} handler — callback invoked on outside click
 * @param {object} [options]
 * @param {boolean} [options.enabled=true] — set false to pause detection
 */
export default function useClickOutside(refs, handler, options = {}) {
  const { enabled = true } = options;
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      const refArray = Array.isArray(refs) ? refs : [refs];
      const isInside = refArray.some(
        (ref) => ref.current?.contains(event.target),
      );
      if (!isInside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, enabled]);
}
