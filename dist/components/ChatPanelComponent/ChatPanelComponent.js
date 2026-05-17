// @ts-nocheck
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
        const el = scrollRef.current;
        if (!el)
            return;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: instant ? "instant" : "smooth",
        });
    }, []);
    // Snap to bottom after DOM updates
    useLayoutEffect(() => {
        if (shouldSnap.current && messages.length > 0 && isOpen) {
            scrollToBottom(messages.length <= 1);
            // Catch late layout shifts from async content
            const t = setTimeout(() => scrollToBottom(true), 150);
            return () => clearTimeout(t);
        }
    }, [messages, isOpen, scrollToBottom]);
    // Track scroll position — only auto-scroll if user is near bottom
    useEffect(() => {
        const el = scrollRef.current;
        if (!el)
            return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            shouldSnap.current = scrollHeight - scrollTop - clientHeight < 80;
        };
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);
    // Snap when panel opens
    useEffect(() => {
        if (isOpen) {
            shouldSnap.current = true;
            // Delay to let animation settle
            const t = setTimeout(() => scrollToBottom(true), 350);
            return () => clearTimeout(t);
        }
    }, [isOpen, scrollToBottom]);
    return (_jsxs("div", { className: `${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`, id: "chat-panel", children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.headerInfo, children: [operatorAvatar ? (_jsx("img", { src: operatorAvatar, alt: operatorName, className: styles.headerAvatar, loading: "lazy" })) : (_jsx("div", { className: styles.headerAvatarFallback, children: (operatorName || "S")[0].toUpperCase() })), _jsxs("div", { className: styles.headerText, children: [_jsx("span", { className: styles.headerName, children: operatorName }), _jsxs("span", { className: styles.headerStatus, children: [_jsx("span", { className: styles.statusDot }), "Online"] })] })] }), _jsx("button", { className: styles.closeButton, onClick: onClose, "aria-label": "Close chat", id: "chat-close-button", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) })] }), _jsxs("div", { className: styles.messagesArea, ref: scrollRef, children: [messages.map((msg, i) => (_jsx(ChatMessageComponent, { message: msg, isFirst: i === 0, previousRole: i > 0 ? messages[i - 1].role : null }, msg.id))), isTyping && (_jsx("div", { className: styles.typingIndicator, children: _jsxs("div", { className: styles.typingDots, children: [_jsx("span", { className: styles.typingDot }), _jsx("span", { className: styles.typingDot }), _jsx("span", { className: styles.typingDot })] }) }))] }), _jsx(ChatInputComponent, { onSend: onSend, isTyping: isTyping }), _jsx("div", { className: styles.footer, children: _jsxs("span", { className: styles.footerText, children: ["Powered by ", _jsx("span", { className: styles.footerBrand, children: "Chat" })] }) })] }));
}
//# sourceMappingURL=ChatPanelComponent.js.map