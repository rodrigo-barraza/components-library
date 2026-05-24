export interface SwitchComponentProps {
    checked?: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    showIcons?: boolean;
    className?: string;
    id?: string;
    name?: string;
    labelPlacement?: "start" | "end";
    ariaLabel?: string;
}
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
 *   • role="switch" explicit on the input for screen readers
 *   • aria-checked reflects current state
 *   • aria-label or aria-labelledby supported via label text or props
 *   • Focus-visible outline on the track
 *   • Keyboard: Space/Enter toggles (native behaviour)
 *   • prefers-reduced-motion respected
 */
export default function SwitchComponent({ checked, onChange, label, disabled, showIcons, className, id, name, labelPlacement, ariaLabel, }: SwitchComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SwitchComponent.d.ts.map