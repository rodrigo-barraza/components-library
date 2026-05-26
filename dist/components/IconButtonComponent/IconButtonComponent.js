import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./IconButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
/**
 * IconButtonComponent — A small icon-only action button.
 */
export default function IconButtonComponent({ icon, onClick, tooltip, variant = "default", active = false, hoverReveal = false, disabled = false, className, ...rest }) {
    const { sound } = useComponents();
    const classes = [
        styles.iconButton,
        variant === "destructive" ? styles.destructive : "",
        active ? styles.isActiveState : "",
        hoverReveal ? styles.hoverReveal : "",
        className || "",
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("button", { className: classes, onClick: (event) => {
            if (sound)
                SoundService.playClickButton({ event });
            onClick?.(event);
        }, onMouseEnter: (event) => {
            if (sound)
                SoundService.playHoverButton({ event });
        }, title: tooltip, disabled: disabled, ...rest, children: icon }));
}
//# sourceMappingURL=IconButtonComponent.js.map