import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./EmptyStateComponent.module.css";
/**
 * EmptyStateComponent — A centered "no data" placeholder with icon, title, and subtitle.
 */
export default function EmptyStateComponent({ icon, title, subtitle, children, className, }) {
    return (_jsxs("div", { className: `${styles['empty-state']}${className ? ` ${className}` : ""}`, children: [icon && _jsx("div", { className: styles['icon'], children: icon }), title && _jsx("h2", { className: styles['title'], children: title }), subtitle && _jsx("p", { className: styles['subtitle'], children: subtitle }), children] }));
}
//# sourceMappingURL=EmptyStateComponent.js.map