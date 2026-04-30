"use client";

import styles from "./SearchInputComponent.module.css";

/**
 * SearchInputComponent — A search input with magnifying glass icon
 * and optional clear (×) button.
 *
 * Uses inline SVGs to avoid requiring lucide-react as a peer dependency.
 *
 * @param {string} value — Current search value
 * @param {Function} onChange — (value: string) => void
 * @param {string} [placeholder="Search…"] — Placeholder text
 * @param {boolean} [autoFocus=false] — Auto-focus on mount
 * @param {string} [className] — Additional class on the wrapper
 */
export default function SearchInputComponent({
  value,
  onChange,
  placeholder = "Search…",
  autoFocus = false,
  className,
}) {
  return (
    <div
      className={`${styles.searchWrapper}${className ? ` ${className}` : ""}`}
    >
      {/* Search icon */}
      <svg
        className={styles.searchIcon}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
      />

      {value && (
        <button
          className={styles.searchClear}
          onClick={() => onChange("")}
          type="button"
        >
          {/* X icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
