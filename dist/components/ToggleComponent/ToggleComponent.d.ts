/**
 * ToggleComponent — iOS-style toggle switch with optional spatial audio.
 *
 * @deprecated Use `SwitchComponent` instead — it is a strict superset of this
 * component's API with M3-compliant styling, ARIA attributes, optional icons,
 * label placement, and state layer animations.
 *
 *  checked   : boolean
 *  onChange  : (checked: boolean) => void
 *  label?    : string  — optional label text rendered beside the track
 *  disabled? : boolean
 *  size?     : "default" | "mini"
 */
export default function ToggleComponent({ checked, onChange, label, disabled, size, }: {
    checked?: boolean | undefined;
    onChange: any;
    label?: string | undefined;
    disabled?: boolean | undefined;
    size?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ToggleComponent.d.ts.map