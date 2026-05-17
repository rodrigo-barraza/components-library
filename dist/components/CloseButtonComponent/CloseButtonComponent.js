"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { X } from "lucide-react";
import styles from "./CloseButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
export default function CloseButtonComponent({ onClick, size = 18, variant = "default", className, }) {
    const { sound } = useComponents();
    const classes = [styles.closeBtn, variant === "dark" ? styles.dark : "", className || ""]
        .filter(Boolean)
        .join(" ");
    return (_jsx("button", { className: classes, onClick: (e) => {
            if (sound)
                SoundService.playClickButton({ event: e });
            onClick?.(e);
        }, onMouseEnter: (e) => {
            if (sound)
                SoundService.playHoverButton({ event: e });
        }, title: "Close", children: _jsx(X, { size: size }) }));
}
//# sourceMappingURL=CloseButtonComponent.js.map