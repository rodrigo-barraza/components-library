"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./SegmentedControlComponent.module.css";
export default function SegmentedControlComponent({ value, onChange, segments, fullWidth = false, compact = false, showCheck = false, className = "", id, }) {
    const { sound } = useComponents();
    const handleSegmentClick = useCallback((segmentValue, event) => {
        if (segmentValue === value)
            return;
        if (sound)
            SoundService.playClickButton({ event });
        onChange(segmentValue);
    }, [value, onChange, sound]);
    const rootClasses = [
        styles["segmented-control"],
        fullWidth && styles["is-full-width-layout"],
        compact && styles["is-compact-size"],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { className: rootClasses, role: "radiogroup", id: id, children: segments.map((segment) => {
            const isSelected = segment.value === value;
            return (_jsxs("button", { type: "button", role: "radio", "aria-checked": isSelected, disabled: segment.disabled, className: `${styles["segment-button"]}${isSelected ? ` ${styles["is-selected-state"]}` : ""}`, onClick: (event) => handleSegmentClick(segment.value, event), onMouseEnter: (event) => {
                    if (sound)
                        SoundService.playHoverButton({ event });
                }, children: [showCheck && (_jsx("span", { className: styles["segment-check-icon"], "aria-hidden": "true", children: _jsx("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }) })), segment.icon && (_jsx("span", { className: styles["segment-icon"], "aria-hidden": "true", children: segment.icon })), segment.label && _jsx("span", { children: segment.label })] }, segment.value));
        }) }));
}
//# sourceMappingURL=SegmentedControlComponent.js.map