"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ─────────────────────────────────────────────────────────────
// AgentChatInputComponent — Message input for the agent chat
// window: auto-expanding textarea, Enter to send / Shift+Enter
// for a newline, and a send button that becomes a stop button
// while a response is streaming.
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState, } from "react";
import { SendHorizontal, Square } from "lucide-react";
import { AGENT_CHAT_DEFAULTS } from "../../constants/agentChat.js";
import styles from "./AgentChatInputComponent.module.css";
export default function AgentChatInputComponent({ onSend, onStop, isStreaming = false, disabled = false, placeholder = "Type a message…", maxLength = AGENT_CHAT_DEFAULTS.MAX_MESSAGE_LENGTH, autoFocus = false, className, }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);
    const autoResize = useCallback(() => {
        const element = textareaRef.current;
        if (!element)
            return;
        element.style.height = "auto";
        element.style.height = `${Math.min(element.scrollHeight, 144)}px`;
    }, []);
    useEffect(() => {
        autoResize();
    }, [value, autoResize]);
    const handleChange = useCallback((event) => {
        const text = event.target.value;
        if (text.length <= maxLength) {
            setValue(text);
        }
    }, [maxLength]);
    const handleSubmit = useCallback(() => {
        const trimmed = value.trim();
        if (!trimmed || isStreaming || disabled)
            return;
        onSend(trimmed);
        setValue("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }, [value, isStreaming, disabled, onSend]);
    const handleKeyDown = useCallback((event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);
    const showStop = isStreaming && Boolean(onStop);
    const canSend = value.trim().length > 0 && !isStreaming && !disabled;
    const isNearLimit = value.length > maxLength * 0.9;
    return (_jsxs("div", { className: `agent-chat-input-component ${styles['input-bar']} ${className || ""}`, children: [_jsxs("div", { className: styles['input-container'], children: [_jsx("textarea", { ref: textareaRef, className: styles['textarea'], value: value, onChange: handleChange, onKeyDown: handleKeyDown, placeholder: placeholder, rows: 1, disabled: disabled, maxLength: maxLength, autoFocus: autoFocus, "aria-label": "Message input" }), showStop ? (_jsx("button", { type: "button", className: `${styles['action-button']} ${styles['stop-button']}`, onClick: onStop, "aria-label": "Stop generating", children: _jsx(Square, { size: 14, fill: "currentColor" }) })) : (_jsx("button", { type: "button", className: `${styles['action-button']} ${canSend ? styles['send-active'] : ""}`, onClick: handleSubmit, disabled: !canSend, "aria-label": "Send message", children: _jsx(SendHorizontal, { size: 16 }) }))] }), isNearLimit && (_jsxs("span", { className: `${styles['char-count']} ${value.length >= maxLength ? styles['char-count-over'] : ""}`, children: [value.length, "/", maxLength] }))] }));
}
//# sourceMappingURL=AgentChatInputComponent.js.map