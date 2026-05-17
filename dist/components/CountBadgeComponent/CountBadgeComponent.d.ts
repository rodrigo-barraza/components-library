/**
 * CountBadgeComponent — Numeric pill badge with state-driven coloring.
 *
 * States:
 *  - "default"  → existing / already-read data (indigo)
 *  - "new"      → fresh unread data (cyan pulse animation)
 *
 * Modifiers:
 *  - disabled   → greyed out when count is 0
 *  - rainbow    → hue-rotate animation (active workers, etc.)
 *
 * Colors are overridable via CSS custom properties:
 *  - --count-badge-default  (fallback: #6366f1)
 *  - --count-badge-new      (fallback: #22d3ee)
 *
 * @param {number|string} count — The value to display
 * @param {"default"|"new"} [state="default"] — Visual state
 * @param {boolean} [disabled=false] — Force disabled look
 * @param {boolean} [rainbow=false] — Rainbow hue-rotate animation
 * @param {string} [tooltip] — Optional tooltip label on hover
 * @param {string} [className] — Additional class
 */
export default function CountBadgeComponent({ count, state, disabled, rainbow, tooltip, className, }: {
    count: any;
    state?: string | undefined;
    disabled?: boolean | undefined;
    rainbow?: boolean | undefined;
    tooltip: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=CountBadgeComponent.d.ts.map