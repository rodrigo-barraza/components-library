import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./LoadingStateComponent.module.css";
/**
 * LoadingStateComponent — Centered loading indicator with a pulsing dot and message.
 */
export default function LoadingStateComponent({ message = "Loading…", className }) {
    return (_jsxs("div", { className: `loading-state-component ${styles['loading-state']}${className ? ` ${className}` : ""}`, children: [_jsx("div", { className: styles['loading-dot'] }), _jsx("span", { children: message })] }));
}
//# sourceMappingURL=LoadingStateComponent.js.map