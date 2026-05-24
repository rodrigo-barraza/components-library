import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import styles from "./CollapsibleBlockComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
/**
 * CollapsibleBlockComponent — A disclosure widget with chevron toggle.
 *
 * Wraps any content behind a clickable header with an icon, label,
 * and optional badge. Supports both controlled and uncontrolled modes.
 */
export default function CollapsibleBlockComponent({ icon, label, badge, defaultCollapsed = false, open: controlledOpen, onToggle, headerActions, className = "", children, }) {
    const { sound } = useComponents();
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    /* Support both controlled and uncontrolled modes */
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : !internalCollapsed;
    const handleToggle = (e) => {
        if (sound)
            SoundService.playClick({ event: e });
        if (isControlled) {
            onToggle?.(!controlledOpen);
        }
        else {
            setInternalCollapsed((v) => !v);
        }
    };
    return (_jsxs("div", { className: `${styles.container} ${className}`, children: [_jsxs("button", { className: styles.header, onClick: handleToggle, children: [_jsx("span", { className: styles.chevron, children: isOpen ? _jsx(ChevronDown, { size: 14 }) : _jsx(ChevronRight, { size: 14 }) }), icon && _jsx("span", { className: styles.icon, children: icon }), _jsx("span", { className: styles.label, children: label }), badge && _jsx("span", { className: styles.badge, children: badge }), headerActions && (_jsx("div", { className: styles.actions, onClick: (e) => e.stopPropagation(), children: headerActions }))] }), isOpen && _jsx("div", { className: styles.body, children: children })] }));
}
//# sourceMappingURL=CollapsibleBlockComponent.js.map