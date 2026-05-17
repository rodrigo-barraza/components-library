/**
 * CheckboxComponent — M3-inspired checkbox with state layer, animations,
 * and support for checked / unchecked / indeterminate / error / disabled states.
 *
 * M3 Spec Reference:
 *   • Container:   18×18px, 2px rounded corners
 *   • State layer:  40×40px circular touch target
 *   • Unchecked:    2px outline in on-surface-variant
 *   • Checked:      primary fill + white check icon
 *   • Indeterminate: primary fill + white dash icon
 *   • Error:        error color outline/fill variant
 *
 * @param {boolean}           checked           — Current checked state
 * @param {Function}          onChange           — (checked: boolean) => void
 * @param {string}            [label]           — Optional label text
 * @param {boolean}           [disabled]        — Disabled state
 * @param {boolean}           [indeterminate]   — Tri-state dash icon (overrides checked icon)
 * @param {boolean}           [error]           — Error-state styling
 * @param {string}            [className]       — Additional wrapper class
 * @param {string}            [id]              — Element ID for accessibility
 * @param {string}            [name]            — Form field name
 * @param {"start"|"end"}     [labelPlacement]  — Label position relative to checkbox
 */
export default function CheckboxComponent({ checked, onChange, label, disabled, indeterminate, error, className, id, name, labelPlacement, }: {
    checked?: boolean | undefined;
    onChange: any;
    label?: string | undefined;
    disabled?: boolean | undefined;
    indeterminate?: boolean | undefined;
    error?: boolean | undefined;
    className?: string | undefined;
    id: any;
    name: any;
    labelPlacement?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CheckboxComponent.d.ts.map