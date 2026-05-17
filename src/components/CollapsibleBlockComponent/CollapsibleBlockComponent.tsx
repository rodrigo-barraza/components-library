// @ts-nocheck
"use client";

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
 *
 * @param {React.ReactNode} [icon] — Icon element for the header
 * @param {string} label — Header text
 * @param {string} [badge] — Optional badge text (e.g. count)
 * @param {boolean} [defaultCollapsed=false] — Initial collapsed state (uncontrolled)
 * @param {boolean} [open] — Controlled open state (overrides internal)
 * @param {Function} [onToggle] — Callback when toggled (for controlled mode)
 * @param {React.ReactNode} [headerActions] — Extra elements in the header (right side)
 * @param {string} [className] — Additional container class
 * @param {React.ReactNode} children — Collapsible body content
 */
export default function CollapsibleBlockComponent({
  icon,
  label,
  badge,
  defaultCollapsed = false,
  open: controlledOpen,
  onToggle,
  headerActions,
  className = "",
  children,
}) {
  const { sound } = useComponents();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  /* Support both controlled and uncontrolled modes */
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : !internalCollapsed;

  const handleToggle = (e) => {
    if (sound) SoundService.playClick({ event: e });
    if (isControlled) {
      onToggle?.(!controlledOpen);
    } else {
      setInternalCollapsed((v) => !v);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <button className={styles.header} onClick={handleToggle}>
        <span className={styles.chevron}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
        {badge && <span className={styles.badge}>{badge}</span>}
        {headerActions && (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            {headerActions}
          </div>
        )}
      </button>
      {isOpen && <div className={styles.body}>{children}</div>}
    </div>
  );
}
