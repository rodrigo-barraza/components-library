/**
 * SelectComponent — custom dropdown that supports rendering arbitrary content
 * (icons, logos, etc.) in each option, with optional multi-select support.
 *
 * Operates in two modes:
 *
 * **Uncontrolled** (default) — manages its own open/close state and renders
 * the built-in options menu. Use `value`, `options`, and `onChange`.
 *
 * **Controlled** — provide `isOpen` + `onToggle` to manage open state
 * externally. The built-in menu is suppressed; the consumer renders its own
 * popover alongside the trigger. Use `icon`, `placeholder`, and optionally
 * `renderPopover` for the popover body.
 */
export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    tooltip?: React.ReactNode;
    tooltipRich?: boolean;
}
export interface SelectComponentProps<T extends string | string[] = string | string[]> {
    value?: T;
    options?: SelectOption[];
    onChange?: (value: T) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    triggerTooltip?: string | null;
    triggerTooltipContent?: React.ReactNode;
    triggerTooltipRich?: boolean;
    label?: string | null;
    isOpen?: boolean;
    onToggle?: () => void;
    triggerRef?: React.Ref<HTMLButtonElement>;
    triggerClassName?: string;
    loadingProgress?: number | null;
    onMouseEnter?: (event: React.MouseEvent) => void;
    children?: React.ReactNode;
    multiple?: boolean;
    allLabel?: string;
    compact?: boolean;
    searchable?: boolean;
}
export default function SelectComponent<T extends string | string[] = string | string[]>({ value, options, onChange, placeholder, icon, disabled, triggerTooltip, triggerTooltipContent, triggerTooltipRich, label, isOpen: controlledIsOpen, onToggle: controlledOnToggle, triggerRef: externalTriggerRef, triggerClassName, loadingProgress, onMouseEnter, children, multiple, allLabel, compact, searchable, }: SelectComponentProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectComponent.d.ts.map