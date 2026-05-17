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
export default function CollapsibleBlockComponent({ icon, label, badge, defaultCollapsed, open: controlledOpen, onToggle, headerActions, className, children, }: {
    icon: any;
    label: any;
    badge: any;
    defaultCollapsed?: boolean | undefined;
    open: any;
    onToggle: any;
    headerActions: any;
    className?: string | undefined;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CollapsibleBlockComponent.d.ts.map