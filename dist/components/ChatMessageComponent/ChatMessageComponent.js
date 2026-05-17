// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MESSAGE_ROLES } from "../../constants/chat.js";
import styles from "./ChatMessageComponent.module.css";
// ── URL detection ────────────────────────────────────────────
const URL_RE = /(https?:\/\/[^\s<>]+)/g;
function renderContent(content, role) {
    if (!content)
        return null;
    if (role === MESSAGE_ROLES.AGENT || role === MESSAGE_ROLES.OPERATOR) {
        return renderMarkdownLite(content);
    }
    return renderWithLinks(content);
}
function renderMarkdownLite(text) {
    const urlParts = text.split(URL_RE);
    return (_jsx("span", { children: urlParts.map((part, i) => {
            if (URL_RE.test(part)) {
                URL_RE.lastIndex = 0;
                const display = part.length > 45 ? part.substring(0, 42) + "..." : part;
                return (_jsx("a", { href: part, target: "_blank", rel: "noopener noreferrer", className: styles.link, children: display }, i));
            }
            return _jsx("span", { children: applyInlineMarkdown(part) }, i);
        }) }));
}
function applyInlineMarkdown(text) {
    const codeRe = /`([^`]+)`/g;
    const parts = text.split(codeRe);
    return parts.map((seg, i) => {
        if (i % 2 === 1) {
            return (_jsx("code", { className: styles.inlineCode, children: seg }, i));
        }
        return applyBoldItalic(seg, i);
    });
}
function applyBoldItalic(text, parentKey) {
    const boldRe = /\*\*(.+?)\*\*/g;
    const boldParts = text.split(boldRe);
    return boldParts.map((seg, i) => {
        if (i % 2 === 1) {
            return (_jsx("strong", { className: styles.bold, children: seg }, `${parentKey}-b-${i}`));
        }
        const italicRe = /\*(.+?)\*/g;
        const italicParts = seg.split(italicRe);
        return italicParts.map((s, j) => {
            if (j % 2 === 1) {
                return (_jsx("em", { className: styles.italic, children: s }, `${parentKey}-i-${i}-${j}`));
            }
            return s;
        });
    });
}
function renderWithLinks(text) {
    const parts = text.split(URL_RE);
    return (_jsx("span", { children: parts.map((part, i) => {
            if (URL_RE.test(part)) {
                URL_RE.lastIndex = 0;
                const display = part.length > 45 ? part.substring(0, 42) + "..." : part;
                return (_jsx("a", { href: part, target: "_blank", rel: "noopener noreferrer", className: styles.link, children: display }, i));
            }
            return _jsx("span", { children: part }, i);
        }) }));
}
function formatTime(isoString) {
    if (!isoString)
        return "";
    return new Date(isoString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
/**
 * ChatMessageComponent — Individual message bubble.
 */
export default function ChatMessageComponent({ message, isFirst = false, previousRole = null, }) {
    const [showTimestamp, setShowTimestamp] = useState(false);
    const { role, content, createdAt, streaming, error } = message;
    const isGrouped = !isFirst && previousRole === role;
    if (role === MESSAGE_ROLES.SYSTEM) {
        return (_jsx("div", { className: `${styles.messageRow} ${styles.system} ${error ? styles.errorMessage : ""}`, children: _jsx("div", { className: styles.systemBubble, children: _jsx("p", { className: styles.messageText, children: content }) }) }));
    }
    if (role === MESSAGE_ROLES.VISITOR) {
        return (_jsxs("div", { className: `${styles.messageRow} ${styles.visitor} ${isGrouped ? styles.grouped : ""}`, onMouseEnter: () => setShowTimestamp(true), onMouseLeave: () => setShowTimestamp(false), children: [_jsx("div", { className: styles.visitorBubble, children: _jsx("p", { className: styles.messageText, children: renderContent(content, role) }) }), _jsx("span", { className: `${styles.timestamp} ${showTimestamp ? styles.timestampVisible : ""}`, children: formatTime(createdAt) })] }));
    }
    return (_jsxs("div", { className: `${styles.messageRow} ${styles.agent} ${isGrouped ? styles.grouped : ""} ${error ? styles.errorMessage : ""}`, onMouseEnter: () => setShowTimestamp(true), onMouseLeave: () => setShowTimestamp(false), children: [_jsx("div", { className: styles.agentBubble, children: _jsxs("p", { className: styles.messageText, children: [renderContent(content, role), streaming && _jsx("span", { className: styles.cursor })] }) }), _jsx("span", { className: `${styles.timestamp} ${showTimestamp ? styles.timestampVisible : ""}`, children: formatTime(createdAt) })] }));
}
//# sourceMappingURL=ChatMessageComponent.js.map