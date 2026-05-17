/**
 * SplitButtonComponent — Material Design 3 Split Button
 *
 * A compound button that splits into two interactive zones:
 *   • Leading button – performs the primary/default action
 *   • Trailing button – triggers a secondary action (e.g. menu toggle)
 *
 * The two zones share a common container shape but maintain independent
 * state layers, ripple indicators, and focus rings per M3 spec.
 *
 * M3 Spec: https://m3.material.io/components/split-button/specs
 *
 * Anatomy:
 *   ┌─────────────────────────┬──────┐
 *   │  [Icon]  Label Text     │  ▼   │
 *   └─────────────────────────┴──────┘
 *   ← leading action button →  ← trailing toggle →
 *   └──── divider (1px) ─────┘
 *
 * @param {Object} props
 * @param {"filled"|"tonal"|"outlined"|"elevated"} [props.variant="filled"]
 * @param {"small"|"medium"|"large"} [props.size="medium"]
 * @param {React.ComponentType} [props.icon] — Leading icon (Lucide-compatible)
 * @param {number} [props.iconSize] — Override icon size
 * @param {React.ComponentType} [props.trailingIcon] — Trailing button icon (default: ChevronDown)
 * @param {boolean} [props.trailingToggled=false] — Controls trailing icon rotation/toggle state
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {Function} [props.onClick] — Leading button click
 * @param {Function} [props.onTrailingClick] — Trailing button click
 * @param {string} [props.aria-label] — Accessible label for the leading button
 * @param {string} [props.trailingAriaLabel="More options"] — Accessible label for trailing
 * @param {React.ReactNode} props.children — Label text for the leading button
 */
declare const SplitButtonComponent: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
export default SplitButtonComponent;
//# sourceMappingURL=SplitButtonComponent.d.ts.map