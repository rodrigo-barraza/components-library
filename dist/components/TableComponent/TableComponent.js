// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Columns3, Check } from "lucide-react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import tooltipStyles from "../TooltipComponent/TooltipComponent.module.css";
import styles from "./TableComponent.module.css";
/**
 * TableComponent — a reusable, sortable data table with expandable rows,
 * column visibility controls, drag-to-scroll, and per-column tooltips.
 *
 * @param {Object} props
 * @param {string} [props.title] — Section title above the table
 * @param {Array<{key, label, description?, sortable?, align?, render?, sortValue?, className?}>} props.columns
 * @param {Array} props.data — Array of row objects
 * @param {Function} [props.getRowKey] — (row, i) => unique key
 * @param {Function} [props.getSubRows] — (row) => array of sub-row objects
 * @param {Function} [props.renderExpandedContent] — (row) => ReactNode
 * @param {Function} [props.onRowClick] — (row) => void
 * @param {string} [props.emptyText] — Text to show when data is empty
 * @param {string} [props.sortKey] — External sort key
 * @param {string} [props.sortDir] — External sort direction ('asc' | 'desc')
 * @param {Function} [props.onSort] — (key, dir) => void
 */
function HeaderCell({ col, thClasses, isSortable, handleSort, sort }) {
    const thRef = useRef(null);
    const [tipMounted, setTipMounted] = useState(false);
    const [tipVisible, setTipVisible] = useState(false);
    const [tipCoords, setTipCoords] = useState({ top: 0, left: 0 });
    const enterTimer = useRef(null);
    const showTimer = useRef(null);
    const unmountTimer = useRef(null);
    const showTip = useCallback(() => {
        if (!thRef.current || !col.description)
            return;
        clearTimeout(unmountTimer.current);
        const rect = thRef.current.getBoundingClientRect();
        setTipCoords({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
        setTipMounted(true);
        showTimer.current = setTimeout(() => setTipVisible(true), 10);
    }, [col.description]);
    const hideTip = useCallback(() => {
        clearTimeout(enterTimer.current);
        clearTimeout(showTimer.current);
        setTipVisible(false);
        unmountTimer.current = setTimeout(() => setTipMounted(false), 200);
    }, []);
    const onEnter = useCallback(() => {
        if (!col.description)
            return;
        clearTimeout(enterTimer.current);
        enterTimer.current = setTimeout(showTip, 400);
    }, [col.description, showTip]);
    const onLeave = useCallback(() => {
        hideTip();
    }, [hideTip]);
    const isActive = sort.key === col.key;
    const sortIcon = isActive
        ? sort.dir === "desc"
            ? _jsx(ChevronDown, { size: 12, className: styles.sortIcon })
            : _jsx(ChevronUp, { size: 12, className: styles.sortIcon })
        : null;
    return (_jsxs("th", { ref: thRef, className: thClasses, style: { textAlign: col.align || "left", width: col.width, maxWidth: col.width }, onClick: isSortable ? () => handleSort(col.key) : undefined, onMouseEnter: onEnter, onMouseLeave: onLeave, children: [col.label, isSortable && sortIcon, tipMounted &&
                createPortal(_jsx("span", { className: `${tooltipStyles.bubble} ${tooltipStyles.plain} ${tooltipStyles.bottom} ${tipVisible ? tooltipStyles.visible : ""}`, style: { top: tipCoords.top, left: tipCoords.left }, children: _jsx("span", { className: tooltipStyles.plainLabel, children: col.description }) }), document.body)] }));
}
function loadHiddenColumns(storageKey, columns) {
    if (!storageKey)
        return new Set();
    try {
        const raw = localStorage.getItem(`table-hidden-cols:${storageKey}`);
        if (raw)
            return new Set(JSON.parse(raw));
    }
    catch { /* ignore */ }
    if (columns) {
        const defaults = columns.filter((c) => c.defaultHidden).map((c) => c.key);
        if (defaults.length > 0)
            return new Set(defaults);
    }
    return new Set();
}
function saveHiddenColumns(storageKey, hiddenSet) {
    if (!storageKey)
        return;
    try {
        localStorage.setItem(`table-hidden-cols:${storageKey}`, JSON.stringify([...hiddenSet]));
    }
    catch { /* ignore */ }
}
function ColumnFilter({ columns, hiddenColumns, onToggle, storageKey }) {
    const btnRef = useRef(null);
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
        if (!open)
            return;
        const handler = (e) => {
            if (btnRef.current?.contains(e.target))
                return;
            const dropdown = document.querySelector(`[data-column-filter="${storageKey}"]`);
            if (dropdown?.contains(e.target))
                return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, storageKey]);
    const hiddenCount = hiddenColumns.size;
    return (_jsxs(_Fragment, { children: [_jsxs("button", { ref: btnRef, className: `${styles.columnFilterBtn} ${hiddenCount > 0 ? styles.columnFilterBtnActive : ""}`, onClick: toggle, title: "Show/hide columns", children: [_jsx(Columns3, { size: 12 }), _jsx("span", { children: "Columns" }), hiddenCount > 0 && (_jsxs("span", { className: styles.columnFilterCount, children: [columns.length - hiddenCount, "/", columns.length] }))] }), open &&
                createPortal(_jsxs("div", { className: styles.columnFilterDropdown, "data-column-filter": storageKey, style: { top: coords.top, left: coords.left }, children: [_jsx("div", { className: styles.columnFilterHeader, children: "Toggle Columns" }), _jsx("div", { className: styles.columnFilterList, children: columns.filter((col) => col.hideable !== false).map((col) => {
                                const visible = !hiddenColumns.has(col.key);
                                return (_jsxs("button", { className: `${styles.columnFilterItem} ${visible ? styles.columnFilterItemVisible : ""}`, onClick: () => onToggle(col.key), children: [_jsx("span", { className: styles.columnFilterCheck, children: visible && _jsx(Check, { size: 10 }) }), _jsx("span", { className: styles.columnFilterLabel, children: col.label })] }, col.key));
                            }) })] }), document.body)] }));
}
export default function TableComponent({ title, columns, data = [], getRowKey, getSubRows, renderExpandedContent, onRowClick, emptyText = "No data", sortKey: externalSortKey, sortDir: externalSortDir, onSort, maxHeight, activeRowKey, highlightedRowKey, highlightedRowRef, onRowMouseEnter, onRowMouseLeave, getRowClassName, getRowStyle, mini = false, storageKey, }) {
    const { sound } = useComponents();
    const [internalSort, setInternalSort] = useState({ key: null, dir: "desc" });
    const sort = onSort
        ? { key: externalSortKey, dir: externalSortDir }
        : internalSort;
    const [expanded, setExpanded] = useState(new Set());
    const [hiddenColumns, setHiddenColumns] = useState(() => loadHiddenColumns(storageKey, columns));
    const toggleColumn = useCallback((key) => {
        setHiddenColumns((prev) => {
            const next = new Set(prev);
            if (next.has(key))
                next.delete(key);
            else
                next.add(key);
            saveHiddenColumns(storageKey, next);
            return next;
        });
    }, [storageKey]);
    const visibleColumns = storageKey
        ? columns.filter((c) => !hiddenColumns.has(c.key))
        : columns;
    const scrollRef = useRef(null);
    const dragRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0,
        moved: false,
    });
    const onPointerDown = useCallback((e) => {
        if (e.target.closest("a, button, input, select, textarea, th"))
            return;
        const el = scrollRef.current;
        if (!el)
            return;
        dragRef.current = {
            active: true,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            scrollLeft: el.scrollLeft,
            scrollTop: el.scrollTop,
            moved: false,
        };
    }, []);
    const onPointerMove = useCallback((e) => {
        const d = dragRef.current;
        if (!d.active)
            return;
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;
        if (!d.moved && Math.abs(dx) + Math.abs(dy) > 5) {
            d.moved = true;
            const el = scrollRef.current;
            if (el) {
                try {
                    el.setPointerCapture(d.pointerId);
                }
                catch { /* ignore */ }
            }
            scrollRef.current?.classList.add(styles.grabbing);
        }
        if (d.moved) {
            const el = scrollRef.current;
            el.scrollLeft = d.scrollLeft - dx;
            el.scrollTop = d.scrollTop - dy;
        }
    }, []);
    const onPointerUp = useCallback((e) => {
        const d = dragRef.current;
        const wasDrag = d.moved;
        d.active = false;
        d.moved = false;
        const el = scrollRef.current;
        if (el) {
            try {
                el.releasePointerCapture(e.pointerId);
            }
            catch { /* ignore */ }
            el.classList.remove(styles.grabbing);
        }
        if (wasDrag) {
            const handler = (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
            };
            el?.addEventListener("click", handler, { capture: true, once: true });
        }
    }, []);
    function handleSort(key) {
        let newDir;
        if (sort.key === key) {
            newDir = sort.dir === "desc" ? "asc" : "desc";
        }
        else {
            newDir = "desc";
        }
        if (onSort) {
            onSort(key, newDir);
        }
        else {
            setInternalSort({ key, dir: newDir });
        }
    }
    function toggleExpand(rowKey) {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(rowKey))
                next.delete(rowKey);
            else
                next.add(rowKey);
            return next;
        });
    }
    const sortCol = sort.key ? columns.find((c) => c.key === sort.key) : null;
    const sorted = sort.key && !onSort
        ? [...data].sort((a, b) => {
            const va = sortCol?.sortValue ? sortCol.sortValue(a) : (a[sort.key] ?? 0);
            const vb = sortCol?.sortValue ? sortCol.sortValue(b) : (b[sort.key] ?? 0);
            if (typeof va === "string" && typeof vb === "string") {
                return sort.dir === "asc"
                    ? va.localeCompare(vb)
                    : vb.localeCompare(va);
            }
            return sort.dir === "asc" ? va - vb : vb - va;
        })
        : data;
    const hasSubRows = !!getSubRows;
    const hasExpandedContent = !!renderExpandedContent;
    /** Build interactive row props with optional sound */
    const interactiveProps = (clickHandler, enterHandler) => {
        if (!sound) {
            return {
                onClick: clickHandler,
                ...(enterHandler ? { onMouseEnter: enterHandler } : {}),
            };
        }
        return SoundService.interactive(clickHandler, enterHandler);
    };
    return (_jsxs("div", { className: `${styles.container} ${mini ? styles.mini : ""}`, children: [(title || storageKey) && (_jsxs("div", { className: styles.tableHeader, children: [title && _jsx("h2", { className: styles.title, children: title }), storageKey && (_jsx(ColumnFilter, { columns: columns, hiddenColumns: hiddenColumns, onToggle: toggleColumn, storageKey: storageKey }))] })), _jsx("div", { ref: scrollRef, className: styles.tableScroll, style: maxHeight ? { maxHeight, overflowY: "auto" } : undefined, "data-table-scroll": true, onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: onPointerUp, onPointerCancel: onPointerUp, children: _jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsx("tr", { children: visibleColumns.map((col) => {
                                    const isSortable = col.sortable !== false;
                                    const isActive = sort.key === col.key;
                                    const thClasses = [
                                        styles.th,
                                        isSortable ? styles.thSortable : "",
                                        isActive ? styles.thActive : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ");
                                    return (_jsx(HeaderCell, { col: col, thClasses: thClasses, isSortable: isSortable, handleSort: handleSort, sort: sort }, col.key));
                                }) }) }), _jsx("tbody", { children: sorted.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length, className: styles.emptyRow, children: emptyText }) })) : (sorted.map((row, ri) => {
                                const key = getRowKey ? getRowKey(row, ri) : ri;
                                const subRows = hasSubRows ? getSubRows(row) : [];
                                const isExpanded = expanded.has(key);
                                const colsToRender = visibleColumns;
                                const isExpandable = (subRows && subRows.length > 0) || hasExpandedContent;
                                const clickable = !!onRowClick || isExpandable;
                                const isActive = activeRowKey != null && key === activeRowKey;
                                const isHighlighted = highlightedRowKey != null && key === highlightedRowKey;
                                const customClass = getRowClassName ? getRowClassName(row, ri) : "";
                                const customStyle = getRowStyle ? getRowStyle(row, ri) : undefined;
                                return (_jsxs(Fragment, { children: [_jsx("tr", { ref: isHighlighted && highlightedRowRef
                                                ? highlightedRowRef
                                                : undefined, className: `${styles.tr} ${clickable ? styles.clickable : ""} ${isExpandable ? styles.expandableRow : ""} ${isActive ? styles.activeRow : ""} ${isHighlighted ? styles.highlightedRow : ""} ${customClass}`, style: customStyle, ...(clickable
                                                ? interactiveProps(isExpandable ? () => toggleExpand(key) : () => onRowClick(row), onRowMouseEnter ? () => onRowMouseEnter(row, ri) : undefined)
                                                : {}), ...(!clickable && onRowMouseEnter ? { onMouseEnter: () => onRowMouseEnter(row, ri) } : {}), onMouseLeave: onRowMouseLeave ? () => onRowMouseLeave(row, ri) : undefined, children: colsToRender.map((col, ci) => {
                                                const isFirst = ci === 0;
                                                const isSorted = sort.key === col.key;
                                                const tdClass = isFirst ? styles.tdName : styles.td;
                                                const extraClass = col.className || "";
                                                const sortedClass = !isFirst && isSorted ? styles.tdSorted : "";
                                                const cellStyle = {
                                                    ...(col.align ? { textAlign: col.align } : {}),
                                                    ...(col.width ? { width: col.width, maxWidth: col.width } : {}),
                                                };
                                                let content;
                                                if (col.render) {
                                                    content = col.render(row, ri);
                                                }
                                                else {
                                                    content = row[col.key] ?? "—";
                                                }
                                                return (_jsxs("td", { className: `${tdClass} ${extraClass} ${sortedClass}`, style: cellStyle, children: [isFirst && isExpandable && (_jsx("span", { className: `${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ""}`, children: _jsx(ChevronDown, { size: 12 }) })), content] }, col.key));
                                            }) }), isExpanded && hasExpandedContent && (_jsx("tr", { className: styles.expandedContentRow, children: _jsx("td", { colSpan: colsToRender.length, className: styles.expandedContentCell, children: renderExpandedContent(row) }) })), isExpanded &&
                                            !hasExpandedContent &&
                                            subRows.map((sub, si) => (_jsx("tr", { className: styles.subRow, children: colsToRender.map((col) => {
                                                    const cellStyle = col.align
                                                        ? { textAlign: col.align }
                                                        : {};
                                                    let content;
                                                    if (col.renderSub) {
                                                        content = col.renderSub(sub, si);
                                                    }
                                                    else if (col.render) {
                                                        content = col.render(sub, si);
                                                    }
                                                    else {
                                                        content = sub[col.key] ?? "—";
                                                    }
                                                    return (_jsx("td", { style: cellStyle, children: content }, col.key));
                                                }) }, `${key}-sub-${si}`)))] }, key));
                            })) })] }) })] }));
}
//# sourceMappingURL=TableComponent.js.map