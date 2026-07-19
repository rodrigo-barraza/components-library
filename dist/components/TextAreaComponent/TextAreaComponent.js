"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useCallback } from "react";
import { cx } from "@rodrigo-barraza/utilities-library";
import styles from "./TextAreaComponent.module.css";
export default function TextAreaComponent({ value, onChange, placeholder, minRows = 3, maxRows = 12, autoResize = true, disabled = false, readOnly = false, className, id, ...rest }) {
    const textAreaRef = useRef(null);
    const resize = useCallback(() => {
        const element = textAreaRef.current;
        if (!element || !autoResize)
            return;
        element.style.height = "auto";
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
        const minHeight = lineHeight * minRows + 20;
        const maxHeight = lineHeight * maxRows + 20;
        const scrollH = element.scrollHeight;
        element.style.height = `${Math.min(Math.max(scrollH, minHeight), maxHeight)}px`;
    }, [autoResize, minRows, maxRows]);
    useEffect(() => {
        resize();
    }, [value, resize]);
    useEffect(() => {
        resize();
    }, [resize]);
    const handleChange = (event) => {
        onChange?.(event);
    };
    const classes = cx("text-area-component", styles['textarea'], className || "");
    return (_jsx("textarea", { ref: textAreaRef, id: id, className: classes, value: value, onChange: handleChange, placeholder: placeholder, disabled: disabled, readOnly: readOnly, rows: minRows, ...rest }));
}
//# sourceMappingURL=TextAreaComponent.js.map