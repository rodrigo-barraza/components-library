"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import styles from "./MultiSelectComponent.module.css";

/**
 * MultiSelectComponent — custom dropdown supporting multiple selected values,
 * rendered as removable chips. Visually mirrors SelectComponent.
 *
 *  value:       string[]  — currently selected option values
 *  options:     [{ value, label, icon?, disabled? }]
 *  onChange:    (values: string[]) => void
 *  placeholder: label shown when nothing is selected
 *  allLabel:    label shown when every option is selected (default: "All")
 *  icon:        optional leading icon for the trigger
 *  disabled:    disables the entire select
 *  compact:     if true, shows count badge instead of chips (e.g. "3 selected")
 */
export default function MultiSelectComponent({
  value = [],
  options = [],
  onChange,
  placeholder = "Select…",
  allLabel = "All",
  icon = null,
  disabled = false,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedSet = useMemo(() => new Set(value), [value]);
  const allSelected = value.length === 0 || value.length === options.length;

  // ── Toggle a single option ──────────────────────────────
  const handleToggle = useCallback(
    (optValue) => {
      if (selectedSet.has(optValue)) {
        const next = value.filter((v) => v !== optValue);
        onChange(next);
      } else {
        onChange([...value, optValue]);
      }
    },
    [value, selectedSet, onChange],
  );

  // ── Remove a chip (stops propagation so trigger doesn't toggle)
  const handleRemove = useCallback(
    (e, optValue) => {
      e.stopPropagation();
      onChange(value.filter((v) => v !== optValue));
    },
    [value, onChange],
  );

  // ── Click-outside close ─────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // ── Escape close ────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // ── Resolve selected option objects for display ─────────
  const selectedOptions = useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet],
  );

  return (
    <div className={styles.dropdown} ref={containerRef}>
      {/* ── Trigger ── */}
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""} ${disabled ? styles.triggerDisabled : ""}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className={styles.triggerContent}>
          {icon && <span className={styles.triggerIcon}>{icon}</span>}

          {allSelected ? (
            <span className={styles.triggerLabel}>{allLabel}</span>
          ) : compact ? (
            <span className={styles.triggerLabel}>
              {selectedOptions.length} selected
            </span>
          ) : selectedOptions.length === 0 ? (
            <span className={styles.triggerLabel}>{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span key={opt.value} className={styles.chip}>
                {opt.label}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={(e) => handleRemove(e, opt.value)}
                  tabIndex={-1}
                >
                  <X size={10} />
                </button>
              </span>
            ))
          )}
        </span>

        <ChevronDown
          size={14}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {/* ── Menu ── */}
      {open && (
        <div className={styles.menu}>
          {options.map((opt) => {
            const checked = selectedSet.has(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`${styles.option} ${checked ? styles.optionSelected : ""} ${opt.disabled ? styles.optionDisabled : ""}`}
                onClick={() => !opt.disabled && handleToggle(opt.value)}
                disabled={opt.disabled}
              >
                {/* Inline checkbox indicator */}
                <span
                  className={`${styles.optionCheck} ${checked ? styles.optionCheckSelected : ""}`}
                >
                  {checked && (
                    <svg
                      className={styles.optionCheckIcon}
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className={styles.optionCheckPath}
                        d="M4 9.5L7.5 13L14 5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                {opt.icon && (
                  <span className={styles.optionIcon}>{opt.icon}</span>
                )}
                <span className={styles.optionLabel}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
