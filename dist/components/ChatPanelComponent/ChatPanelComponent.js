"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import ChatMessageComponent from "../ChatMessageComponent/ChatMessageComponent.js";
import ChatInputComponent from "../ChatInputComponent/ChatInputComponent.js";
import styles from "./ChatPanelComponent.module.css";
/**
 * ChatPanelComponent — The chat panel UI.
 *
 * Contains a header (operator info + close), scrollable message list
 * with auto-scroll, typing indicator, and the message input bar.
 */
export default function ChatPanelComponent({ isOpen, messages, isTyping, operatorName, operatorAvatar, onClose, onSend, }) {
    const scrollRef = useRef(null);
    const shouldSnap = useRef(true);
    // ── Auto-scroll to bottom on new messages ──────────────────
    const scrollToBottom = useCallback((instant = false) => {
        const element = scrollRef.current;
        if (!element)
            return;
        element.scrollTo({
            top: element.scrollHeight,
            behavior: instant ? "instant" : "smooth",
        });
    }, []);
    // Snap to bottom after DOM updates
    useLayoutEffect(() => {
        if (shouldSnap.current && messages.length > 0 && isOpen) {
            scrollToBottom(messages.length <= 1);
            // Catch late layout shifts from async content
            const scrollTimer = setTimeout(() => scrollToBottom(true), 150);
            return () => clearTimeout(scrollTimer);
        }
    }, [messages, isOpen, scrollToBottom]);
    // Track scroll position — only auto-scroll if user is near bottom
    useEffect(() => {
        const element = scrollRef.current;
        if (!element)
            return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            shouldSnap.current = scrollHeight - scrollTop - clientHeight < 80;
        };
        element.addEventListener("scroll", handleScroll, { passive: true });
        return () => element.removeEventListener("scroll", handleScroll);
    }, []);
    // Snap when panel opens
    useEffect(() => {
        if (isOpen) {
            shouldSnap.current = true;
            // Delay to let animation settle
            const scrollTimer = setTimeout(() => scrollToBottom(true), 350);
            return () => clearTimeout(scrollTimer);
        }
    }, [isOpen, scrollToBottom]);
    return (_jsxs("div", { className: `${styles.panel} ${isOpen ? styles['panel-open'] : styles['panel-closed']}`, id: "chat-panel", children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles['header-info'], children: [operatorAvatar ? (_jsx("img", { src: operatorAvatar, alt: operatorName, className: styles['header-avatar'], loading: "lazy" })) : (_jsx("div", { className: styles['header-avatar-fallback'], children: (operatorName || "S")[0].toUpperCase() })), _jsxs("div", { className: styles['header-text'], children: [_jsx("span", { className: styles['header-name'], children: operatorName }), _jsxs("span", { className: styles['header-status'], children: [_jsx("span", { className: styles['status-dot'] }), "Online"] })] })] }), _jsx("button", { className: styles['close-button'], onClick: onClose, "aria-label": "Close chat", id: "chat-close-button", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) })] }), _jsxs("div", { className: styles['messages-area'], ref: scrollRef, children: [messages.map((message, i) => (_jsx(ChatMessageComponent, { message: message, isFirst: i === 0, previousRole: i > 0 ? messages[i - 1].role : null }, message.id))), isTyping && (_jsx("div", { className: styles['typing-indicator'], children: _jsxs("div", { className: styles['typing-dots'], children: [_jsx("span", { className: styles['typing-dot'] }), _jsx("span", { className: styles['typing-dot'] }), _jsx("span", { className: styles['typing-dot'] })] }) }))] }), _jsx(ChatInputComponent, { onSend: onSend, isTyping: isTyping }), _jsx("div", { className: styles.footer, children: _jsxs("span", { className: styles['footer-text'], children: ["Powered by ", _jsx("span", { className: styles['footer-brand'], children: "Chat" })] }) })] }));
}
//# sourceMappingURL=ChatPanelComponent.js.map