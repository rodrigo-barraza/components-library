import { useRef, useEffect, useState } from "react";

/** Ease-out cubic — fast start, gentle landing. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * useTweenValue — Animates a numeric value from its previous state to the
 * current target using requestAnimationFrame with easeOutCubic easing.
 *
 * Returns `[displayValue, isTweening]`.
 */

interface UseTweenValueOptions {
  /** Animation duration in ms */
  duration?: number;
  /** Whether to round intermediate values */
  round?: boolean;
  /** Set false to disable tween (snap immediately) */
  enabled?: boolean;
}

export default function useTweenValue(
  target: number,
  options: UseTweenValueOptions = {},
): [number, boolean] {
  const { duration = 600, round = false, enabled = true } = options;

  const prevRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [displayValue, setDisplayValue] = useState(target);
  const [tweening, setTweening] = useState(false);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;

    // First mount, same value, or tweening disabled — snap immediately
    if (!enabled || from === null || from === target) {
      setDisplayValue(target);
      setTweening(false);
      return;
    }

    const delta = target - from;
    const start = performance.now();
    setTweening(true);

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const value = from! + delta * eased;
      setDisplayValue(round ? Math.round(value) : value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTweening(false);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setTweening(false);
    };
  }, [target, duration, round, enabled]);

  return [displayValue, tweening];
}
