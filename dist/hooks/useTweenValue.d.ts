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
export default function useTweenValue(target: number, options?: UseTweenValueOptions): [number, boolean];
export {};
//# sourceMappingURL=useTweenValue.d.ts.map