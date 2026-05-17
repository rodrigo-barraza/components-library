/**
 * ChipComponent — M3 Chip (Assist / Filter / Input / Suggestion).
 *
 * Chips help people enter information, make selections, filter content,
 * or trigger actions. They can show a leading icon, trailing close,
 * and support selected/disabled states.
 *
 * @see https://m3.material.io/components/chips
 *
 * @param {"assist"|"filter"|"input"|"suggestion"} [variant="assist"] — M3 chip type
 * @param {boolean}  [selected=false]   — Selected / active state (filter chips)
 * @param {boolean}  [disabled=false]   — Disabled state
 * @param {boolean}  [elevated=false]   — Elevated style with shadow
 * @param {React.ComponentType} [icon]  — Leading icon component
 * @param {boolean}  [removable=false]  — Show trailing X button
 * @param {Function} [onRemove]         — Called when X is clicked
 * @param {Function} [onClick]          — Click handler
 * @param {string}   [className]
 * @param {React.ReactNode} children    — Chip label
 */
declare const ChipComponent: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
export default ChipComponent;
//# sourceMappingURL=ChipComponent.d.ts.map