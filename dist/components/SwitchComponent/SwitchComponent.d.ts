/**
 * SwitchComponent — M3-inspired switch (toggle) with animated handle, state
 * layer, optional selected/unselected icons, and full ARIA support.
 *
 * M3 Spec Reference:
 *   • Track:        52×32px, fully rounded (16px radius)
 *   • Handle:       16px unselected → 24px selected (28px pressed)
 *   • State layer:  40×40px circular, centered on handle
 *   • Touch target: minimum 48×48px
 *   • Icons:        optional check (selected) and close (unselected)
 *
 * Accessibility (per M3 Switch/Accessibility):
 *   • Native <input type="checkbox"> provides role="switch" semantics
 *   • `role="switch"` explicit on the input for screen readers
 *   • `aria-checked` reflects current state
 *   • `aria-label` or `aria-labelledby` supported via label text or props
 *   • Focus-visible outline on the track
 *   • Keyboard: Space/Enter toggles (native behaviour)
 *   • prefers-reduced-motion respected
 *
 * @param {boolean}           checked           — Current switch state
 * @param {Function}          onChange           — (checked: boolean) => void
 * @param {string}            [label]           — Optional label text
 * @param {boolean}           [disabled]        — Disabled state
 * @param {boolean}           [showIcons]       — Show check/close icons inside handle
 * @param {string}            [className]       — Additional wrapper class
 * @param {string}            [id]              — Element ID for accessibility
 * @param {string}            [name]            — Form field name
 * @param {"start"|"end"}     [labelPlacement]  — Label position relative to switch
 * @param {string}            [ariaLabel]       — Explicit ARIA label when no visible label
 */
export default function SwitchComponent({ checked, onChange, label, disabled, showIcons, className, id, name, labelPlacement, ariaLabel, }: {
    checked?: boolean | undefined;
    onChange: any;
    label?: string | undefined;
    disabled?: boolean | undefined;
    showIcons?: boolean | undefined;
    className?: string | undefined;
    id: any;
    name: any;
    labelPlacement?: string | undefined;
    ariaLabel: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SwitchComponent.d.ts.map