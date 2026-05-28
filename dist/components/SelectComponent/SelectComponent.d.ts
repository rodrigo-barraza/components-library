/**
 * SelectComponent — custom dropdown that supports rendering arbitrary content
 * (icons, logos, etc.) in each option.
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
    tooltip?: string;
}
export interface SelectComponentProps {
    value?: string;
    options?: SelectOption[];
    onChange?: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    triggerTooltip?: string | null;
    triggerTooltipContent?: React.ReactNode;
    label?: string | null;
    isOpen?: boolean;
    onToggle?: () => void;
    triggerRef?: React.Ref<HTMLButtonElement>;
    triggerClassName?: string;
    loadingProgress?: number | null;
    onMouseEnter?: (event: React.MouseEvent) => void;
    children?: React.ReactNode;
}
export default function SelectComponent({ value, options, onChange, placeholder, icon, disabled, triggerTooltip, triggerTooltipContent, label, isOpen: controlledIsOpen, onToggle: controlledOnToggle, triggerRef: externalTriggerRef, triggerClassName, loadingProgress, onMouseEnter, children, }: SelectComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectComponent.d.ts.map