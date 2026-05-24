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
        active ? styles.active : "",
        hoverReveal ? styles.hoverReveal : "",
        className || "",
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("button", { className: classes, onClick: (e) => {
            if (sound)
                SoundService.playClickButton({ event: e });
            onClick?.(e);
        }, onMouseEnter: (e) => {
            if (sound)
                SoundService.playHoverButton({ event: e });
        }, title: tooltip, disabled: disabled, ...rest, children: icon }));
}
//# sourceMappingURL=IconButtonComponent.js.map