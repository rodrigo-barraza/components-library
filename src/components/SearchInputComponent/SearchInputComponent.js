"use client";

import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import styles from "./SearchInputComponent.module.css";

/* ══════════════════════════════════════════════════════════════════════
   SearchInputComponent — M3 Search (Search Bar + Search View)

   Material Design 3 defines two anatomies:
     • Search Bar  — collapsed pill-shaped bar (56px) with leading icon,
                     supporting text, and optional trailing elements
     • Search View — expanded overlay with text field + suggestions list

   Compound sub-components:
     SearchInputComponent.Suggestion      — a single suggestion row
     SearchInputComponent.SuggestionGroup — a labeled group of suggestions

   ──────────────────────────────────────────────────────────────────────
   @param {string}   value             — controlled query value
   @param {Function} onChange          — (value: string) => void
   @param {string}   [placeholder]     — placeholder / supporting text
   @param {boolean}  [autoFocus=false] — focus on mount
   @param {boolean}  [compact=false]   — 48px compact variant
   @param {boolean}  [useScrim=false]  — show scrim overlay when expanded
   @param {string}   [className]       — extra class on root
   @param {React.ReactNode} [leadingIcon]   — slot: leading icon element
   @param {React.ReactNode} [trailingIcon]  — slot: trailing icon/avatar
   @param {Function} [onTrailingClick]      — handler for trailing icon
   @param {Function} [onSubmit]             — called on Enter
   @param {Function} [onExpand]             — called when view expands
   @param {Function} [onCollapse]           — called when view collapses
   @param {React.ReactNode} children        — Suggestion/SuggestionGroup
   ══════════════════════════════════════════════════════════════════════ */
const SearchInputComponent = forwardRef(function SearchInputComponent(
  {
    value = "",
    onChange,
    placeholder = "Search…",
    autoFocus = false,
    compact = false,
    useScrim = false,
    className,
    leadingIcon,
    trailingIcon,
    onTrailingClick,
    onSubmit,
    onExpand,
    onCollapse,
    children,
    ...rest
  },
  ref,
) {
  const [expanded, setExpanded] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const panelRef = useRef(null);

  // Merge forwarded ref with internal
  const setInputRef = useCallback(
    (node) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const hasSuggestions = !!children;

  /* ── Expand / collapse logic ──────────────────────────────────── */

  const expand = useCallback(() => {
    if (!hasSuggestions) return;
    setExpanded(true);
    setHighlightIndex(-1);
    onExpand?.();
  }, [hasSuggestions, onExpand]);

  const collapse = useCallback(() => {
    setExpanded(false);
    setHighlightIndex(-1);
    onCollapse?.();
  }, [onCollapse]);

  /* ── Click outside ────────────────────────────────────────────── */

  useEffect(() => {
    if (!expanded) return;

    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        collapse();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [expanded, collapse]);

  /* ── Escape key ───────────────────────────────────────────────── */

  useEffect(() => {
    if (!expanded) return;

    function handleEscape(e) {
      if (e.key === "Escape") {
        collapse();
        inputRef.current?.blur();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [expanded, collapse]);

  /* ── Keyboard navigation in suggestions ───────────────────────── */

  const handleKeyDown = useCallback(
    (e) => {
      if (!expanded || !panelRef.current) return;

      const items = panelRef.current.querySelectorAll(
        "[data-suggestion-item]",
      );
      const count = items.length;
      if (!count) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % count);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev <= 0 ? count - 1 : prev - 1));
      } else if (e.key === "Enter" && highlightIndex >= 0) {
        e.preventDefault();
        items[highlightIndex]?.click();
      }
    },
    [expanded, highlightIndex],
  );

  /* ── Scroll highlighted item into view ────────────────────────── */

  useEffect(() => {
    if (highlightIndex < 0 || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll("[data-suggestion-item]");
    items[highlightIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex]);

  /* ── Handle input change ──────────────────────────────────────── */

  const handleChange = useCallback(
    (e) => {
      onChange?.(e.target.value);
      if (!expanded && hasSuggestions) expand();
      setHighlightIndex(-1);
    },
    [onChange, expanded, hasSuggestions, expand],
  );

  /* ── Handle form submit ───────────────────────────────────────── */

  const handleSubmit = useCallback(
    (e) => {
      if (e.key === "Enter" && highlightIndex < 0) {
        e.preventDefault();
        onSubmit?.(value);
        collapse();
      }
    },
    [onSubmit, value, highlightIndex, collapse],
  );

  /* ── Clear button ─────────────────────────────────────────────── */

  const handleClear = useCallback(() => {
    onChange?.("");
    inputRef.current?.focus();
  }, [onChange]);

  /* ── Build class ──────────────────────────────────────────────── */

  const barClasses = [
    styles.searchBar,
    compact && styles.compact,
    expanded && styles.expanded,
  ]
    .filter(Boolean)
    .join(" ");

  const rootClasses = [styles.searchRoot, className].filter(Boolean).join(" ");

  /* ── Default leading icon (search magnifier) ──────────────────── */

  const defaultLeadingIcon = (
    <svg
      width={compact ? 20 : 24}
      height={compact ? 20 : 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  /* ── Close icon (×) for clear ─────────────────────────────────── */

  const clearIcon = (
    <svg
      width={compact ? 16 : 18}
      height={compact ? 16 : 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  /* ── Render ───────────────────────────────────────────────────── */

  return (
    <div className={rootClasses} ref={rootRef} {...rest}>
      {/* Search bar */}
      <div
        className={barClasses}
        onClick={() => {
          inputRef.current?.focus();
          if (hasSuggestions && !expanded) expand();
        }}
        role="search"
      >
        {/* Leading icon */}
        <span className={styles.leadingIcon}>
          {leadingIcon || defaultLeadingIcon}
        </span>

        {/* Input */}
        <input
          ref={setInputRef}
          type="search"
          className={styles.searchField}
          value={value}
          onChange={handleChange}
          onFocus={() => {
            if (hasSuggestions && !expanded) expand();
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
            handleSubmit(e);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          role="combobox"
          aria-expanded={expanded}
          aria-haspopup="listbox"
          aria-controls={expanded ? "search-suggestions" : undefined}
          aria-activedescendant={
            highlightIndex >= 0
              ? `search-suggestion-${highlightIndex}`
              : undefined
          }
          aria-label={placeholder}
        />

        {/* Clear button — shown when there's text */}
        {value && (
          <button
            className={styles.trailingAction}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            type="button"
            aria-label="Clear search"
          >
            {clearIcon}
          </button>
        )}

        {/* Trailing icon slot — avatar, mic, etc. */}
        {trailingIcon && (
          <button
            className={styles.trailingAction}
            onClick={(e) => {
              e.stopPropagation();
              onTrailingClick?.();
            }}
            type="button"
            aria-label="Search options"
          >
            {typeof trailingIcon === "function" || trailingIcon.$$typeof
              ? trailingIcon
              : trailingIcon}
          </button>
        )}
      </div>

      {/* Suggestions panel (search view body) */}
      {hasSuggestions && (
        <div
          ref={panelRef}
          id="search-suggestions"
          className={`${styles.suggestionsPanel}${expanded ? ` ${styles.open}` : ""}`}
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className={styles.suggestionsDivider} />
          <SearchSuggestionsContext.Provider
            value={{ highlightIndex, collapse, onChange }}
          >
            {children}
          </SearchSuggestionsContext.Provider>
        </div>
      )}

      {/* Scrim overlay */}
      {useScrim && (
        <div
          className={`${styles.scrim}${expanded ? ` ${styles.visible}` : ""}`}
          onClick={collapse}
          aria-hidden="true"
        />
      )}
    </div>
  );
});

/* ══════════════════════════════════════════════════════════════════════
   Context for passing state to suggestion items
   ══════════════════════════════════════════════════════════════════════ */

import { createContext, useContext } from "react";

const SearchSuggestionsContext = createContext({
  highlightIndex: -1,
  collapse: () => {},
  onChange: () => {},
});

/* ══════════════════════════════════════════════════════════════════════
   Suggestion — individual suggestion row

   @param {React.ReactNode} [icon]     — leading icon (e.g. History, Search)
   @param {string}          text       — suggestion text (supports <mark>)
   @param {React.ReactNode} [trailing] — trailing meta (time, arrow, etc.)
   @param {Function}        [onClick]  — override click handler
   @param {string}          [value]    — value to set on click (default: text)
   @param {number}          [index]    — auto-injected for highlighting
   ══════════════════════════════════════════════════════════════════════ */

function Suggestion({ icon, text, trailing, onClick, value, index = -1 }) {
  const { highlightIndex, collapse, onChange } = useContext(
    SearchSuggestionsContext,
  );
  const isHighlighted = index >= 0 && highlightIndex === index;

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(value ?? text);
    } else {
      onChange?.(value ?? text);
    }
    collapse();
  }, [onClick, value, text, onChange, collapse]);

  /* Default leading icon: clock for history-style suggestions */
  const defaultIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  return (
    <button
      className={`${styles.suggestionItem}${isHighlighted ? ` ${styles.highlighted}` : ""}`}
      onClick={handleClick}
      type="button"
      role="option"
      aria-selected={isHighlighted}
      id={index >= 0 ? `search-suggestion-${index}` : undefined}
      data-suggestion-item
    >
      <span className={styles.suggestionIcon}>{icon || defaultIcon}</span>
      <span className={styles.suggestionText}>
        {typeof text === "string" ? text : text}
      </span>
      {trailing && (
        <span className={styles.suggestionTrailing}>{trailing}</span>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SuggestionGroup — labeled group of suggestions

   @param {string} label     — group header text
   @param {React.ReactNode} children — Suggestion items
   ══════════════════════════════════════════════════════════════════════ */

function SuggestionGroup({ label, children }) {
  return (
    <div role="group" aria-label={label}>
      {label && (
        <div className={styles.suggestionGroupHeader}>{label}</div>
      )}
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SuggestionsEmpty — empty state placeholder

   @param {string|React.ReactNode} [message] — empty message
   ══════════════════════════════════════════════════════════════════════ */

function SuggestionsEmpty({ message = "No results found" }) {
  return <div className={styles.suggestionsEmpty}>{message}</div>;
}

/* ── Attach sub-components ──────────────────────────────────────── */

SearchInputComponent.Suggestion = Suggestion;
SearchInputComponent.SuggestionGroup = SuggestionGroup;
SearchInputComponent.Empty = SuggestionsEmpty;

export default SearchInputComponent;
