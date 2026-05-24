"use client";

import React, { useState, useRef, useCallback, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Columns3, Check } from "lucide-react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import tooltipStyles from "../TooltipComponent/TooltipComponent.module.css";
import styles from "./TableComponent.module.css";

/**
 * TableComponent — a reusable, sortable data table with expandable rows,
 * column visibility controls, drag-to-scroll, and per-column tooltips.
 */

export interface TableColumn<T, TSub = unknown> {
  key: string;
  label: string;
  description?: string;
  align?: "left" | "right" | "center";
  width?: string | number;
  defaultHidden?: boolean;
  hideable?: boolean;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render?: (row: T, index: number) => React.ReactNode;
  renderSub?: (sub: TSub, index: number) => React.ReactNode;
  className?: string;
}

interface HeaderCellProps<T, TSub = unknown> {
  col: TableColumn<T, TSub>;
  thClasses: string;
  isSortable: boolean;
  handleSort: (key: string) => void;
  sort: { key: string | null; dir: "asc" | "desc" };
}

function HeaderCell<T, TSub>({ col, thClasses, isSortable, handleSort, sort }: HeaderCellProps<T, TSub>) {
  const thRef = useRef<HTMLTableHeaderCellElement | null>(null);
  const [tipMounted, setTipMounted] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [tipCoords, setTipCoords] = useState({ top: 0, left: 0 });
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTip = useCallback(() => {
    if (!thRef.current || !col.description) return;
    if (unmountTimer.current) clearTimeout(unmountTimer.current);
    const rect = thRef.current.getBoundingClientRect();
    setTipCoords({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    setTipMounted(true);
    showTimer.current = setTimeout(() => setTipVisible(true), 10);
  }, [col.description]);

  const hideTip = useCallback(() => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    if (showTimer.current) clearTimeout(showTimer.current);
    setTipVisible(false);
    unmountTimer.current = setTimeout(() => setTipMounted(false), 200);
  }, []);

  const onEnter = useCallback(() => {
    if (!col.description) return;
    if (enterTimer.current) clearTimeout(enterTimer.current);
    enterTimer.current = setTimeout(showTip, 400);
  }, [col.description, showTip]);

  const onLeave = useCallback(() => {
    hideTip();
  }, [hideTip]);

  const isActive = sort.key === col.key;
  const sortIcon = isActive
    ? sort.dir === "desc"
      ? <ChevronDown size={12} className={styles.sortIcon} />
      : <ChevronUp size={12} className={styles.sortIcon} />
    : null;

  return (
    <th
      ref={thRef}
      className={thClasses}
      style={{ textAlign: col.align || "left", width: col.width, maxWidth: col.width }}
      onClick={isSortable ? () => handleSort(col.key) : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {col.label}
      {isSortable && sortIcon}
      {tipMounted &&
        createPortal(
          <span
            className={`${tooltipStyles.bubble} ${tooltipStyles.plain} ${tooltipStyles.bottom} ${tipVisible ? tooltipStyles.visible : ""}`}
            style={{ top: tipCoords.top, left: tipCoords.left }}
          >
            <span className={tooltipStyles.plainLabel}>{col.description}</span>
          </span>,
          document.body,
        )}
    </th>
  );
}

function loadHiddenColumns<T, TSub>(storageKey: string | undefined, columns: TableColumn<T, TSub>[]): Set<string> {
  if (!storageKey) return new Set<string>();
  try {
    const raw = localStorage.getItem(`table-hidden-cols:${storageKey}`);
    if (raw) return new Set<string>(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  if (columns) {
    const defaults = columns.filter((c) => c.defaultHidden).map((c) => c.key);
    if (defaults.length > 0) return new Set<string>(defaults);
  }
  return new Set<string>();
}

function saveHiddenColumns(storageKey: string | undefined, hiddenSet: Set<string>): void {
  if (!storageKey) return;
  try {
    localStorage.setItem(
      `table-hidden-cols:${storageKey}`,
      JSON.stringify([...hiddenSet]),
    );
  } catch { /* ignore */ }
}

interface ColumnFilterProps<T, TSub = unknown> {
  columns: TableColumn<T, TSub>[];
  hiddenColumns: Set<string>;
  onToggle: (key: string) => void;
  storageKey: string;
}

function ColumnFilter<T, TSub>({ columns, hiddenColumns, onToggle, storageKey }: ColumnFilterProps<T, TSub>) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const toggle = useCallback(() => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.right });
    }
    setOpen((v) => !v);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      const dropdown = document.querySelector(`[data-column-filter="${storageKey}"]`);
      if (dropdown?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, storageKey]);

  const hiddenCount = hiddenColumns.size;

  return (
    <>
      <button
        ref={btnRef}
        className={`${styles.columnFilterBtn} ${hiddenCount > 0 ? styles.columnFilterBtnActive : ""}`}
        onClick={toggle}
        title="Show/hide columns"
      >
        <Columns3 size={12} />
        <span>Columns</span>
        {hiddenCount > 0 && (
          <span className={styles.columnFilterCount}>{columns.length - hiddenCount}/{columns.length}</span>
        )}
      </button>
      {open &&
        createPortal(
          <div
            className={styles.columnFilterDropdown}
            data-column-filter={storageKey}
            style={{ top: coords.top, left: coords.left }}
          >
            <div className={styles.columnFilterHeader}>Toggle Columns</div>
            <div className={styles.columnFilterList}>
              {columns.filter((col) => col.hideable !== false).map((col) => {
                const visible = !hiddenColumns.has(col.key);
                return (
                  <button
                    key={col.key}
                    className={`${styles.columnFilterItem} ${visible ? styles.columnFilterItemVisible : ""}`}
                    onClick={() => onToggle(col.key)}
                  >
                    <span className={styles.columnFilterCheck}>
                      {visible && <Check size={10} />}
                    </span>
                    <span className={styles.columnFilterLabel}>{col.label}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export interface TableComponentProps<T, TSub = unknown> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  columns: TableColumn<T, TSub>[];
  data?: T[];
  getRowKey?: (row: T, index: number) => string | number;
  getSubRows?: (row: T) => TSub[];
  renderExpandedContent?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  emptyText?: string;
  sortKey?: string | null;
  sortDir?: "asc" | "desc" | string;
  onSort?: (key: string, dir: "asc" | "desc") => void;
  maxHeight?: string | number;
  activeRowKey?: string | number | null;
  highlightedRowKey?: string | number | null;
  highlightedRowRef?: React.RefObject<HTMLTableRowElement | null>;
  onRowMouseEnter?: (row: T, index: number) => void;
  onRowMouseLeave?: (row: T, index: number) => void;
  getRowClassName?: (row: T, index: number) => string;
  getRowStyle?: (row: T, index: number) => React.CSSProperties;
  mini?: boolean;
  storageKey?: string;
}

export default function TableComponent<T, TSub = unknown>({
  title,
  subtitle,
  columns,
  data = [],
  getRowKey,
  getSubRows,
  renderExpandedContent,
  onRowClick,
  emptyText = "No data",
  sortKey: externalSortKey,
  sortDir: externalSortDir,
  onSort,
  maxHeight,
  activeRowKey,
  highlightedRowKey,
  highlightedRowRef,
  onRowMouseEnter,
  onRowMouseLeave,
  getRowClassName,
  getRowStyle,
  mini = false,
  storageKey,
}: TableComponentProps<T, TSub>) {
  const { sound } = useComponents();
  const [internalSort, setInternalSort] = useState<{ key: string | null; dir: "asc" | "desc" }>({ key: null, dir: "desc" });
  const sort = onSort
    ? { key: externalSortKey || null, dir: (externalSortDir || "desc") as "asc" | "desc" }
    : internalSort;
  const [expanded, setExpanded] = useState<Set<string | number>>(new Set());

  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(() => loadHiddenColumns(storageKey, columns));

  const toggleColumn = useCallback((key: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      saveHiddenColumns(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const visibleColumns = storageKey
    ? columns.filter((c) => !hiddenColumns.has(c.key))
    : columns;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; scrollLeft: number; scrollTop: number; moved: boolean; pointerId?: number }>({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    moved: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, select, textarea, th")) return;
    const element = scrollRef.current;
    if (!element) return;
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
      moved: false,
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const deltaX = e.clientX - d.startX;
    const deltaY = e.clientY - d.startY;
    if (!d.moved && Math.abs(deltaX) + Math.abs(deltaY) > 5) {
      d.moved = true;
      const element = scrollRef.current;
      if (element && d.pointerId !== undefined) {
        try { element.setPointerCapture(d.pointerId); } catch { /* ignore */ }
      }
      scrollRef.current?.classList.add(styles.grabbing);
    }
    if (d.moved) {
      const element = scrollRef.current;
      if (element) {
        element.scrollLeft = d.scrollLeft - deltaX;
        element.scrollTop = d.scrollTop - deltaY;
      }
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const wasDrag = d.moved;
    d.active = false;
    d.moved = false;
    const element = scrollRef.current;
    if (element) {
      try { element.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      element.classList.remove(styles.grabbing);
    }
    if (wasDrag && element) {
      const handler = (ev: MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      element.addEventListener("click", handler, { capture: true, once: true });
    }
  }, []);

  function handleSort(key: string) {
    let newDir: "asc" | "desc";
    if (sort.key === key) {
      newDir = sort.dir === "desc" ? "asc" : "desc";
    } else {
      newDir = "desc";
    }
    if (onSort) {
      onSort(key, newDir);
    } else {
      setInternalSort({ key, dir: newDir });
    }
  }

  function toggleExpand(rowKey: string | number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  }

  const sortCol = sort.key ? columns.find((c) => c.key === sort.key) : null;
  const sorted =
    sort.key && !onSort
      ? [...data].sort((a, b) => {
          const va = sortCol?.sortValue ? sortCol.sortValue(a) : ((a as Record<string, unknown>)[sort.key!] ?? 0);
          const vb = sortCol?.sortValue ? sortCol.sortValue(b) : ((b as Record<string, unknown>)[sort.key!] ?? 0);
          if (typeof va === "string" && typeof vb === "string") {
            return sort.dir === "asc"
              ? va.localeCompare(vb)
              : vb.localeCompare(va);
          }
          return sort.dir === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
        })
      : data;

  const hasSubRows = !!getSubRows;
  const hasExpandedContent = !!renderExpandedContent;

  /** Build interactive row props with optional sound */
  const interactiveProps = (
    clickHandler: (e: React.MouseEvent) => void,
    enterHandler?: (e: React.MouseEvent) => void
  ) => {
    if (!sound) {
      return {
        onClick: clickHandler,
        ...(enterHandler ? { onMouseEnter: enterHandler } : {}),
      };
    }
    return SoundService.interactive(clickHandler, enterHandler);
  };

  const showHeader = !!(title || subtitle || storageKey);

  return (
    <div className={`${styles.container} ${mini ? styles.mini : ""} ${showHeader ? styles.hasHeader : ""}`}>
      {showHeader && (
        <div className={styles.tableHeader}>
          {(title || subtitle) && (
            <div className={styles.tableHeaderContent}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          )}
          {storageKey && (
            <ColumnFilter
              columns={columns}
              hiddenColumns={hiddenColumns}
              onToggle={toggleColumn}
              storageKey={storageKey}
            />
          )}
        </div>
      )}

      <div
        ref={scrollRef}
        className={styles.tableScroll}
        style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
        data-table-scroll
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.map((col) => {
                const isSortable = col.sortable !== false;
                const isActive = sort.key === col.key;
                const thClasses = [
                  styles.th,
                  isSortable ? styles.thSortable : "",
                  isActive ? styles.thActive : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <HeaderCell
                    key={col.key}
                    col={col}
                    thClasses={thClasses}
                    isSortable={isSortable}
                    handleSort={handleSort}
                    sort={sort}
                  />
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className={styles.emptyRow}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              sorted.map((row, ri) => {
                const key = getRowKey ? getRowKey(row, ri) : ri;
                const subRows = hasSubRows ? getSubRows(row) : [];
                const isExpanded = expanded.has(key);
                const colsToRender = visibleColumns;
                const isExpandable = (subRows && subRows.length > 0) || hasExpandedContent;
                const clickable = !!onRowClick || isExpandable;
                const isActive = activeRowKey != null && key === activeRowKey;
                const isHighlighted =
                  highlightedRowKey != null && key === highlightedRowKey;
                const customClass = getRowClassName ? getRowClassName(row, ri) : "";
                const customStyle = getRowStyle ? getRowStyle(row, ri) : undefined;

                return (
                  <Fragment key={key}>
                    <tr
                      ref={
                        isHighlighted && highlightedRowRef
                          ? (highlightedRowRef as React.Ref<HTMLTableRowElement>)
                          : undefined
                      }
                      className={`${styles.tr} ${clickable ? styles.clickable : ""} ${isExpandable ? styles.expandableRow : ""} ${isActive ? styles.activeRow : ""} ${isHighlighted ? styles.highlightedRow : ""} ${customClass}`}
                      style={customStyle}
                      {...(clickable
                        ? interactiveProps(
                            isExpandable ? () => toggleExpand(key) : () => onRowClick?.(row),
                            onRowMouseEnter ? () => onRowMouseEnter(row, ri) : undefined
                          )
                        : {}
                      )}
                      {...(!clickable && onRowMouseEnter ? { onMouseEnter: () => onRowMouseEnter(row, ri) } : {})}
                      onMouseLeave={
                        onRowMouseLeave ? () => onRowMouseLeave(row, ri) : undefined
                      }
                    >
                      {colsToRender.map((col, ci) => {
                        const isFirst = ci === 0;
                        const isSorted = sort.key === col.key;
                        const tdClass = isFirst ? styles.tdName : styles.td;
                        const extraClass = col.className || "";
                        const sortedClass =
                          !isFirst && isSorted ? styles.tdSorted : "";
                        const cellStyle = {
                          ...(col.align ? { textAlign: col.align } : {}),
                          ...(col.width ? { width: col.width, maxWidth: col.width } : {}),
                        };

                        let content;
                        if (col.render) {
                          content = col.render(row, ri);
                        } else {
                          content = ((row as Record<string, unknown>)[col.key] ?? "—") as React.ReactNode;
                        }

                        return (
                          <td
                            key={col.key}
                            className={`${tdClass} ${extraClass} ${sortedClass}`}
                            style={cellStyle}
                          >
                            {isFirst && isExpandable && (
                              <span
                                className={`${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ""}`}
                              >
                                <ChevronDown size={12} />
                              </span>
                            )}
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                    {isExpanded && hasExpandedContent && (
                      <tr className={styles.expandedContentRow}>
                        <td colSpan={colsToRender.length} className={styles.expandedContentCell}>
                          {renderExpandedContent(row)}
                        </td>
                      </tr>
                    )}
                    {isExpanded &&
                      !hasExpandedContent &&
                      subRows.map((sub, si) => (
                        <tr key={`${key}-sub-${si}`} className={styles.subRow}>
                          {colsToRender.map((col) => {
                            const cellStyle = col.align
                              ? { textAlign: col.align }
                              : {};
                            let content;
                            if (col.renderSub) {
                              content = col.renderSub(sub, si);
                            } else if (col.render) {
                              content = col.render(sub as unknown as T, si);
                            } else {
                              content = ((sub as Record<string, unknown>)[col.key] ?? "—") as React.ReactNode;
                            }
                            return (
                              <td key={col.key} style={cellStyle}>
                                {content}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
