// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./DeviceBadgeComponent.module.css";
/**
 * DeviceBadgeComponent — Semantic badge for the host device running a service.
 *
 * Displays the device name with an icon passed via the `icons` prop
 * to remain icon-library-agnostic.
 *
 * @param {string} device — Device name (e.g. "Synology NAS", "Raspberry Pi")
 * @param {{ Server: React.ComponentType }} [icons] — Icon components
 * @param {string} [className] — Additional CSS class
 */
export default function DeviceBadgeComponent({ device, icons, className, ...rest }) {
    if (!device)
        return null;
    const { Server } = icons || {};
    return (_jsxs(BadgeComponent, { variant: "info", className: `${styles.badge} ${className || ""}`, tooltip: `Host device: ${device}`, ...rest, children: [Server && _jsx(Server, { size: 9, strokeWidth: 2.2 }), device] }));
}
//# sourceMappingURL=DeviceBadgeComponent.js.map