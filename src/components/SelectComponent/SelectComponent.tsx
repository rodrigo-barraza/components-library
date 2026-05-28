"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./SelectComponent.module.css";

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

export default function SelectComponent({
  value = "",
  options = [],
  onChange,
  placeholder = "Select...",
  icon = null,
  disabled = false,
  triggerTooltip = null,
  triggerTooltipContent = null,
  label = null,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  triggerRef: externalTriggerRef,
  triggerClassName,
  loadingProgress,
  onMouseEnter,
  children,
}: SelectComponentProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const internalTriggerRef = useRef<HTMLButtonElement | null>(null);

  const isControlled = controlledIsOpen !== undefined && controlledOnToggle !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalOpen;
  const isLoading = loadingProgress != null;

  const setTriggerRef = useCallback(
    (element: HTMLButtonElement | null) => {
      internalTriggerRef.current = element;
      if (typeof externalTriggerRef === "function") {
        externalTriggerRef(element);
      } else if (externalTriggerRef && "current" in externalTriggerRef) {
        (externalTriggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = element;
      }
    },
    [externalTriggerRef],
  );

  const selected = options.find((option) => option.value === value);

  const handleSelect = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled) return;
      onChange?.(opt.value);
      setInternalOpen(false);
    },
    [onChange],
  );

  const handleToggle = useCallback(() => {
    if (disabled || isLoading) return;
    if (isControlled) {
      controlledOnToggle!();
    } else {
      setInternalOpen((previous) => !previous);
    }
  }, [disabled, isLoading, isControlled, controlledOnToggle]);

  useEffect(() => {
    if (isControlled || !internalOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setInternalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isControlled, internalOpen]);

  useEffect(() => {
    if (isControlled || !internalOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInternalOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isControlled, internalOpen]);

  const renderOption = (opt: SelectOption) => {
    const button = (
      <button
        key={opt.value}
        type="button"
        className={`${styles.option} ${opt.value === value ? styles.optionSelected : ""} ${opt.disabled ? styles.optionDisabled : ""}`}
        onClick={() => handleSelect(opt)}
        disabled={opt.disabled}
      >
        {opt.icon && (
          <span className={styles.optionIcon}>{opt.icon}</span>
        )}
        <span className={styles.optionLabel}>{opt.label}</span>
      </button>
    );

    if (opt.tooltip) {
      return (
        <TooltipComponent
          key={opt.value}
          label={opt.tooltip}
          position="right"
          delay={200}
        >
          {button}
        </TooltipComponent>
      );
    }

    return button;
  };

  const triggerClassNames = [
    styles.trigger,
    isOpen ? styles.triggerOpen : "",
    disabled ? styles.triggerDisabled : "",
    isLoading ? styles.triggerLoading : "",
    triggerClassName || "",
  ]
    .filter(Boolean)
    .join(" ");

  const triggerButton = (
    <button
      ref={setTriggerRef}
      type="button"
      className={triggerClassNames}
      onClick={handleToggle}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      style={disabled ? { cursor: "default" } : undefined}
    >
      <span className={styles.triggerContent}>
        {isLoading && (
          <Loader2 size={14} className={styles.triggerSpinner} />
        )}
        {!isLoading && icon && <span className={styles.triggerIcon}>{icon}</span>}
        {!isLoading && !icon && selected?.icon && <span className={styles.optionIcon}>{selected.icon}</span>}
        <span className={styles.triggerLabel}>
          {isLoading
            ? `Loading… ${Math.round((loadingProgress ?? 0) * 100)}%`
            : selected
              ? selected.label
              : placeholder}
        </span>
      </span>
      {!disabled && !isLoading && (
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      )}
      {isLoading && (
        <span
          className={styles.triggerProgressBar}
          style={{ transform: `scaleX(${loadingProgress ?? 0})` }}
        />
      )}
    </button>
  );

  const tooltipContent = triggerTooltipContent || triggerTooltip;
  const shouldShowTooltip = !!tooltipContent && !isOpen && !isLoading;

  const wrappedTrigger = shouldShowTooltip ? (
    <TooltipComponent label={tooltipContent} position="bottom" enterDelay={150}>
      {triggerButton}
    </TooltipComponent>
  ) : (
    triggerButton
  );

  return (
    <div className={`${styles.dropdown} ${label ? styles.hasLabel : ""}`} ref={containerRef}>
      {label && <span className={styles.label}>{label}</span>}

      {!isControlled && (
        <div className={styles.sizer} aria-hidden="true">
          {options.map((opt) => (
            <span key={opt.value} className={styles.sizerItem}>
              {icon && <span className={styles.triggerIcon}>{icon}</span>}
              {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
              <span>{opt.label}</span>
            </span>
          ))}
        </div>
      )}

      {wrappedTrigger}

      {!isControlled && isOpen && (
        <div className={styles.menu}>
          {options.map(renderOption)}
        </div>
      )}

      {children}
    </div>
  );
}
