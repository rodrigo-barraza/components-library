/**
 * RadioComponent — M3-inspired radio button with circular state layer,
 * animated inner dot, and support for selected / unselected / error / disabled states.
 *
 * M3 Spec Reference:
 *   • Outer ring:  20×20px, 2px border, fully circular
 *   • Inner dot:   10×10px filled circle, scale-in animation
 *   • State layer: 40×40px circular touch target
 *   • Unselected:  2px outline in on-surface-variant
 *   • Selected:    primary-color ring + primary-filled dot
 *   • Error:       error-color ring + error-filled dot
 *
 * Keyboard navigation:
 *   Native <input type="radio"> within a shared `name` group enables
 *   arrow-key navigation per WAI-ARIA Radio Group pattern.
 *   Tab moves focus into/out of the group; arrows cycle within.
 *
 * @param {string}            value             — This radio's value
 * @param {string}            selectedValue     — Currently selected value in group
 * @param {Function}          onChange           — (value: string) => void
 * @param {string}            [label]           — Optional label text
 * @param {boolean}           [disabled]        — Disabled state
 * @param {boolean}           [error]           — Error-state styling
 * @param {string}            [className]       — Additional wrapper class
 * @param {string}            [id]              — Element ID for accessibility
 * @param {string}            [name]            — Form radio group name
 * @param {"start"|"end"}     [labelPlacement]  — Label position relative to radio
 */
declare function RadioComponent({ value, selectedValue, onChange, label, disabled, error, className, id, name, labelPlacement, }: {
    value: any;
    selectedValue: any;
    onChange: any;
    label?: string | undefined;
    disabled?: boolean | undefined;
    error?: boolean | undefined;
    className?: string | undefined;
    id: any;
    name: any;
    labelPlacement?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
declare namespace RadioComponent {
    var Group: ({ legend, orientation, className, children, }: {
        legend: any;
        orientation?: string | undefined;
        className?: string | undefined;
        children: any;
    }) => import("react/jsx-runtime").JSX.Element;
}
export default RadioComponent;
//# sourceMappingURL=RadioComponent.d.ts.map