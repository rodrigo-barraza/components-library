"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * useClickOutside — triggers a callback when a click occurs outside the
 * referenced element(s). Essential for dropdown menus, popovers, modals,
 * and any dismissible overlay.
 *
 * @param refs — ref(s) to the container element(s)
 * @param handler — callback invoked on outside click
 * @param options
 */

interface UseClickOutsideOptions {
  /** set false to pause detection */
  enabled?: boolean;
}

export default function useClickOutside(
  refs: RefObject<Element | null> | RefObject<Element | null>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  options: UseClickOutsideOptions = {},
): void {
  const { enabled = true } = options;
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const refArray = Array.isArray(refs) ? refs : [refs];
      const isInside = refArray.some(
        (ref) => ref.current?.contains(event.target as Node),
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
