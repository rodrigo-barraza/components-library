"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./SelectComponent.module.css";

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
  tooltip?: string;
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
}

export default function SelectComponent<T extends string | string[] = string | string[]>({
  value,
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
  multiple = false,
  allLabel = "All",
  compact = false,
}: SelectComponentProps<T>) {
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

  // ── Multi-select support values ─────────────────────────────────────────
  const selectedValues = useMemo<string[]>(() => {
    if (!multiple) return [];
    if (Array.isArray(value)) return value as string[];
    if (typeof value === "string" && value) return [value];
    return [];
  }, [value, multiple]);

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const allSelected = multiple && (selectedValues.length === 0 || selectedValues.length === options.length);

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedSet.has(option.value)),
    [options, selectedSet],
  );

  const selected = useMemo(() => {
    if (multiple) return null;
    return options.find((option) => option.value === (value as string));
  }, [options, value, multiple]);

  const handleToggleOption = useCallback(
    (optionValue: string) => {
      if (selectedSet.has(optionValue)) {
        const nextValues = selectedValues.filter((item) => item !== optionValue);
        onChange?.(nextValues as T);
      } else {
        onChange?.([...selectedValues, optionValue] as T);
      }
    },
    [selectedValues, selectedSet, onChange],
  );

  const handleSelectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      onChange?.(option.value as T);
      setInternalOpen(false);
    },
    [onChange],
  );

  const handleOptionClick = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      if (multiple) {
        handleToggleOption(option.value);
      } else {
        handleSelectOption(option);
      }
    },
    [multiple, handleToggleOption, handleSelectOption],
  );

  const handleRemoveChip = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, optionValue: string) => {
      event.stopPropagation();
      const nextValues = selectedValues.filter((item) => item !== optionValue);
      onChange?.(nextValues as T);
    },
    [selectedValues, onChange],
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

  const renderOption = (option: SelectOption) => {
    const checked = multiple ? selectedSet.has(option.value) : option.value === (value as string);

    const button = (
      <button
        key={option.value}
        type="button"
        className={`${styles.option} ${checked ? styles.optionSelected : ""} ${option.disabled ? styles.optionDisabled : ""}`}
        onClick={() => handleOptionClick(option)}
        disabled={option.disabled}
      >
        {multiple && (
          <span
            className={`${styles["option-checkbox-container"]} ${checked ? styles["option-checkbox-container-selected"] : ""}`}
          >
            {checked && (
              <svg
                className={styles["option-checkbox-icon"]}
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className={styles["option-checkbox-path"]}
                  d="M4 9.5L7.5 13L14 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        )}

        {option.icon && (
          <span className={styles.optionIcon}>{option.icon}</span>
        )}
        <span className={styles.optionLabel}>{option.label}</span>
      </button>
    );

    if (option.tooltip) {
      return (
        <TooltipComponent
          key={option.value}
          label={option.tooltip}
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
    multiple ? styles.triggerMultiple : "",
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
        {!isLoading && !icon && !multiple && selected?.icon && <span className={styles.optionIcon}>{selected.icon}</span>}
        {multiple && !isLoading ? (
          allSelected ? (
            <span className={styles.triggerLabel}>{allLabel}</span>
          ) : compact ? (
            <span className={styles.triggerLabel}>
              {selectedOptions.length} selected
            </span>
          ) : selectedOptions.length === 0 ? (
            <span className={styles.triggerLabel}>{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span key={option.value} className={styles["chip-element"]}>
                {option.label}
                <button
                  type="button"
                  className={styles["chip-remove-button"]}
                  onClick={(event) => handleRemoveChip(event, option.value)}
                  tabIndex={-1}
                  disabled={disabled}
                >
                  <X size={10} />
                </button>
              </span>
            ))
          )
        ) : (
          <span className={styles.triggerLabel}>
            {isLoading
              ? `Loading… ${Math.round((loadingProgress ?? 0) * 100)}%`
              : selected
                ? selected.label
                : placeholder}
          </span>
        )}
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
          {options.map((option) => (
            <span key={option.value} className={styles.sizerItem}>
              {icon && <span className={styles.triggerIcon}>{icon}</span>}
              {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
              <span>{option.label}</span>
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
