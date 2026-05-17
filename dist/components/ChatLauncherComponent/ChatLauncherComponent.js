// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./ChatLauncherComponent.module.css";
/**
 * ChatLauncherComponent — Floating Action Button (FAB).
 *
 * Renders as a circular button with a chat icon that morphs to a
 * close icon when the panel is open. Includes an unread badge with
 * pulse animation.
 */
export default function ChatLauncherComponent({ isOpen, unreadCount = 0, onClick, }) {
    return (_jsxs("button", { className: `${styles.launcher} ${isOpen ? styles.open : ""}`, onClick: onClick, "aria-label": isOpen ? "Close chat" : "Open chat", id: "chat-launcher", children: [_jsx("svg", { className: `${styles.icon} ${styles.chatIcon} ${isOpen ? styles.iconHidden : ""}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }), _jsxs("svg", { className: `${styles.icon} ${styles.closeIcon} ${isOpen ? "" : styles.iconHidden}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }), unreadCount > 0 && !isOpen && (_jsx("span", { className: styles.badge, id: "chat-unread-badge", children: unreadCount > 9 ? "9+" : unreadCount }))] }));
}
//# sourceMappingURL=ChatLauncherComponent.js.map