import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
// Inlined from utilities-library/time — node_modules copy is stale until deploy-kit sync
const FEEDBACK_STANDARD_MILLISECONDS = 2_000;
import styles from "./CopyButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
/**
 * CopyButtonComponent — Copy-to-clipboard button with a "copied" confirmation state.
 */
export default function CopyButtonComponent({ text, size = 14, showLabel = false, className = "", tooltip = "Copy", }) {
    const { sound } = useComponents();
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(async (event) => {
        event.stopPropagation();
        try {
            await navigator.clipboard.writeText(text);
            if (sound)
                SoundService.playClickButton({ event });
            setCopied(true);
            setTimeout(() => setCopied(false), FEEDBACK_STANDARD_MILLISECONDS);
        }
        catch {
            /* clipboard not available — silent fail */
        }
    }, [text, sound]);
    return (_jsxs("button", { type: "button", className: `copy-button-component ${styles['copy-button']} ${copied ? styles['copied'] : ""} ${className}`, onClick: handleCopy, onMouseEnter: (event) => {
            if (sound)
                SoundService.playHoverButton({ event });
        }, title: copied ? "Copied!" : tooltip, children: [copied ? _jsx(Check, { size: size }) : _jsx(Copy, { size: size }), showLabel && (copied ? "Copied" : "Copy")] }));
}
//# sourceMappingURL=CopyButtonComponent.js.map