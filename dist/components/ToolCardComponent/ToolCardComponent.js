"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./ToolCardComponent.module.css";
export default function ToolCardComponent({ name, description, emoji, domain, onClick, children, className, }) {
    const classes = [styles.toolCard, className].filter(Boolean).join(" ");
    return (_jsxs("div", { className: classes, onClick: onClick, children: [_jsxs("div", { className: styles.header, children: [emoji && (emoji.startsWith("http") ? (_jsx("img", { src: emoji, alt: name, className: styles.emojiImage })) : (_jsx("span", { className: styles.emoji, children: emoji }))), _jsxs("div", { className: styles.titleBlock, children: [_jsx("span", { className: styles.name, children: name }), domain && _jsx("span", { className: styles.domain, children: domain })] })] }), _jsx("div", { className: styles.description, children: description }), children && _jsx("div", { className: styles.footer, children: children })] }));
}
//# sourceMappingURL=ToolCardComponent.js.map