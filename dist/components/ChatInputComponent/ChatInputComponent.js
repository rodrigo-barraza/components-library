// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import { CHAT_DEFAULTS } from "../../constants/chat.js";
import styles from "./ChatInputComponent.module.css";
/**
 * ChatInputComponent — Message input with auto-expanding textarea.
 *
 * - Send on Enter, newline on Shift+Enter
 * - Auto-expands up to 4 lines
 * - Disabled during AI generation
 * - Character limit indicator
 */
export default function ChatInputComponent({ onSend, isTyping = false }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);
    const maxLength = CHAT_DEFAULTS.MAX_MESSAGE_LENGTH;
    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el)
            return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
    }, []);
    useEffect(() => {
        autoResize();
    }, [value, autoResize]);
    const handleChange = useCallback((e) => {
        const text = e.target.value;
        if (text.length <= maxLength) {
            setValue(text);
        }
    }, [maxLength]);
    const handleSubmit = useCallback(() => {
        const trimmed = value.trim();
        if (!trimmed || isTyping)
            return;
        onSend(trimmed);
        setValue("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }, [value, isTyping, onSend]);
    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);
    const isOverLimit = value.length > maxLength * 0.9;
    const canSend = value.trim().length > 0 && !isTyping;
    return (_jsxs("div", { className: styles.inputBar, children: [_jsxs("div", { className: styles.inputContainer, children: [_jsx("textarea", { ref: textareaRef, className: styles.textarea, value: value, onChange: handleChange, onKeyDown: handleKeyDown, placeholder: "Type a message\u2026", rows: 1, disabled: isTyping, maxLength: maxLength, id: "chat-input", "aria-label": "Message input" }), _jsx("button", { className: `${styles.sendButton} ${canSend ? styles.sendActive : ""}`, onClick: handleSubmit, disabled: !canSend, "aria-label": "Send message", id: "chat-send-button", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "12", y1: "19", x2: "12", y2: "5" }), _jsx("polyline", { points: "5 12 12 5 19 12" })] }) })] }), isOverLimit && (_jsxs("span", { className: `${styles.charCount} ${value.length >= maxLength ? styles.charCountOver : ""}`, children: [value.length, "/", maxLength] }))] }));
}
//# sourceMappingURL=ChatInputComponent.js.map