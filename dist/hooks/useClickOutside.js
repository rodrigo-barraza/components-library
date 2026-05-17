"use client";
import { useEffect, useRef } from "react";
export default function useClickOutside(refs, handler, options = {}) {
    const { enabled = true } = options;
    const handlerRef = useRef(handler);
    handlerRef.current = handler;
    useEffect(() => {
        if (!enabled)
            return;
        const listener = (event) => {
            const refArray = Array.isArray(refs) ? refs : [refs];
            const isInside = refArray.some((ref) => ref.current?.contains(event.target));
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
//# sourceMappingURL=useClickOutside.js.map