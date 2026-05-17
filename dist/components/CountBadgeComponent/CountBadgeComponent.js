"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./CountBadgeComponent.module.css";
export default function CountBadgeComponent({ count, state = "default", disabled = false, rainbow = false, tooltip, className, }) {
    if (count == null)
        return null;
    const isDisabled = disabled || count === 0;
    const stateClass = rainbow
        ? styles.rainbow
        : isDisabled
            ? styles.stateDisabled
            : state === "new"
                ? styles.stateNew
                : styles.stateDefault;
    const badge = (_jsx("span", { className: `${styles.badge} ${stateClass}${className ? ` ${className}` : ""}`, children: count }));
    if (tooltip) {
        return (_jsx(TooltipComponent, { label: tooltip, position: "top", children: badge }));
    }
    return badge;
}
//# sourceMappingURL=CountBadgeComponent.js.map