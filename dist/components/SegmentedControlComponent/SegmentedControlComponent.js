"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState, useLayoutEffect, useEffect, } from "react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./SegmentedControlComponent.module.css";
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export default function SegmentedControlComponent({ value, onChange, segments, fullWidth = false, compact = false, showCheck = false, className = "", id, }) {
    const { sound } = useComponents();
    const containerReference = useRef(null);
    const segmentReferences = useRef(new Map());
    const [indicatorGeometry, setIndicatorGeometry] = useState(null);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const measureIndicator = useCallback(() => {
        const container = containerReference.current;
        if (!container)
            return;
        const activeButton = segmentReferences.current.get(value);
        if (!activeButton)
            return;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        setIndicatorGeometry({
            offsetLeft: buttonRect.left - containerRect.left,
            width: buttonRect.width,
        });
    }, [value]);
    useIsomorphicLayoutEffect(() => {
        measureIndicator();
        const frameIdentifier = requestAnimationFrame(() => {
            setIsInitialRender(false);
        });
        return () => cancelAnimationFrame(frameIdentifier);
    }, [measureIndicator]);
    useIsomorphicLayoutEffect(() => {
        const container = containerReference.current;
        if (!container)
            return;
        const resizeObserver = new ResizeObserver(() => {
            measureIndicator();
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [measureIndicator]);
    const handleSegmentClick = useCallback((segmentValue, event) => {
        if (segmentValue === value)
            return;
        if (sound)
            SoundService.playClickButton({ event });
        onChange(segmentValue);
    }, [value, onChange, sound]);
    const setSegmentReference = useCallback((segmentValue, node) => {
        if (node) {
            segmentReferences.current.set(segmentValue, node);
        }
        else {
            segmentReferences.current.delete(segmentValue);
        }
    }, []);
    const rootClasses = [
        "segmented-control-component",
        styles["segmented-control-container"],
        fullWidth && styles["is-full-width-layout"],
        compact && styles["is-compact-size"],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: rootClasses, role: "radiogroup", id: id, ref: containerReference, children: [indicatorGeometry && (_jsx("span", { className: styles["sliding-indicator"], style: {
                    translate: `${indicatorGeometry.offsetLeft}px 0`,
                    width: `${indicatorGeometry.width}px`,
                    transitionDuration: isInitialRender ? "0ms" : undefined,
                }, "aria-hidden": "true" })), segments.map((segment) => {
                const isSelected = segment.value === value;
                return (_jsxs("button", { ref: (node) => setSegmentReference(segment.value, node), type: "button", role: "radio", "aria-checked": isSelected, disabled: segment.disabled, className: `${styles["segment-button"]}${isSelected ? ` ${styles["is-selected-state"]}` : ""}`, onClick: (event) => handleSegmentClick(segment.value, event), onMouseEnter: (event) => {
                        if (sound)
                            SoundService.playHoverButton({ event });
                    }, children: [showCheck && (_jsx("span", { className: styles["segment-check-icon"], "aria-hidden": "true", children: _jsx("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }) })), segment.icon && (_jsx("span", { className: styles["segment-icon"], "aria-hidden": "true", children: segment.icon })), segment.label && _jsx("span", { children: segment.label })] }, segment.value));
            })] }));
}
//# sourceMappingURL=SegmentedControlComponent.js.map