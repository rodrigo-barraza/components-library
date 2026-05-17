"use client";
import { useEffect, useRef } from "react";
export default function useKeyboard(keyMap, options = {}) {
    const { enabled = true, ignoreInputs = true } = options;
    const keyMapRef = useRef(keyMap);
    keyMapRef.current = keyMap;
    useEffect(() => {
        if (!enabled)
            return;
        const handler = (event) => {
            // Skip when focused on form elements
            if (ignoreInputs) {
                const target = event.target;
                const tag = target?.tagName;
                if (tag === "INPUT" ||
                    tag === "TEXTAREA" ||
                    tag === "SELECT" ||
                    target?.isContentEditable) {
                    // Still allow Escape from inputs
                    if (event.key !== "Escape")
                        return;
                }
            }
            const parts = [];
            if (event.ctrlKey || event.metaKey)
                parts.push("ctrl");
            if (event.shiftKey)
                parts.push("shift");
            if (event.altKey)
                parts.push("alt");
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
//# sourceMappingURL=useKeyboard.js.map