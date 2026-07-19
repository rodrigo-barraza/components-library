"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import styles from "./StreamingCursorComponent.module.css";
/**
 * StreamingCursorComponent — Renders an inline rainbow caret cursor
 * with a rapidly-cycling random "scramble" character to its left.
 *
 * When `token` is provided (the trailing word split off the streaming
 * text via splitStreamingTail), it renders rainbow-tinted immediately
 * before the cursor so the newest word looks like it is being emitted
 * by the cursor itself.
 *
 * The scramble character rotates through letters, digits, and symbols
 * at ~30 fps, giving a glitchy/matrix-style feel while text streams in.
 */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×÷ΔΩπΣφψλαβγ∞∑∏√∂∫≈≠≤≥∈∉∩∪⊂⊃∀∃∇☰☷☶☵☴☳";
const SCRAMBLE_INTERVAL_MS = 35;
export default function StreamingCursorComponent({ active, standalone, token, }) {
    const [char, setChar] = useState("_");
    const intervalRef = useRef(null);
    useEffect(() => {
        if (!active) {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setChar(SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]);
        }, SCRAMBLE_INTERVAL_MS);
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [active]);
    if (!active)
        return null;
    const cursor = (_jsxs("span", { className: `streaming-cursor-component ${styles['streaming-cursor-wrapper']}`, "aria-hidden": "true", children: [token ? (_jsxs(_Fragment, { children: [" ", _jsx("span", { className: styles['streaming-token-text-display'], children: token })] })) : null, _jsx("span", { className: styles['scramble-char'], children: char }), _jsx("span", { className: styles['caret'], children: "\u258E" })] }));
    if (standalone) {
        return _jsx("div", { className: styles['standalone-cursor'], children: cursor });
    }
    return cursor;
}
//# sourceMappingURL=StreamingCursorComponent.js.map