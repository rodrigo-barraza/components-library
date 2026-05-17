import { useRef, useEffect, useState } from "react";
/** Ease-out cubic — fast start, gentle landing. */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
export default function useTweenValue(target, options = {}) {
    const { duration = 600, round = false, enabled = true } = options;
    const prevRef = useRef(null);
    const rafRef = useRef(null);
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
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const value = from + delta * eased;
            setDisplayValue(round ? Math.round(value) : value);
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            }
            else {
                setTweening(false);
            }
        }
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current)
                cancelAnimationFrame(rafRef.current);
            setTweening(false);
        };
    }, [target, duration, round, enabled]);
    return [displayValue, tweening];
}
//# sourceMappingURL=useTweenValue.js.map