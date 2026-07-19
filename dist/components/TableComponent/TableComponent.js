"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Columns3, Check, ListChecks } from "lucide-react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import tooltipStyles from "../TooltipComponent/TooltipComponent.module.css";
import styles from "./TableComponent.module.css";
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
        if (unmountTimer.current)
            clearTimeout(unmountTimer.current);
        const rect = thRef.current.getBoundingClientRect();
        setTipCoords({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
        setTipMounted(true);
        showTimer.current = setTimeout(() => setTipVisible(true), 10);
    }, [col.description]);
    const hideTip = useCallback(() => {
        if (enterTimer.current)
            clearTimeout(enterTimer.current);
        if (showTimer.current)
            clearTimeout(showTimer.current);
        setTipVisible(false);
        unmountTimer.current = setTimeout(() => setTipMounted(false), 200);
    }, []);
    const onEnter = useCallback(() => {
        if (!col.description)
            return;
        if (enterTimer.current)
            clearTimeout(enterTimer.current);
        enterTimer.current = setTimeout(showTip, 400);
    }, [col.description, showTip]);
    const onLeave = useCallback(() => {
        hideTip();
    }, [hideTip]);
    const isActive = sort.key === col.key;
    const sortIcon = isActive
        ? sort.dir === "desc"
            ? _jsx(ChevronDown, { size: 12, className: styles['sort-icon'] })
            : _jsx(ChevronUp, { size: 12, className: styles['sort-icon'] })
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
        const defaults = columns.filter((column) => column.defaultHidden).map((column) => column.key);
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
function ColumnFilter({ columns, hiddenColumns, onToggle, onToggleAll, storageKey }) {
    const btnRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const toggle = useCallback(() => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setCoords({ top: rect.bottom + 4, left: rect.right });
        }
        setOpen((previous) => !previous);
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
    const hideableColumns = columns.filter((col) => col.hideable !== false);
    const isAllVisible = hideableColumns.every((col) => !hiddenColumns.has(col.key));
    return (_jsxs(_Fragment, { children: [_jsxs("button", { ref: btnRef, className: `${styles['column-filter-button']} ${hiddenCount > 0 ? styles['column-filter-btn-active'] : ""}`, onClick: toggle, title: "Show/hide columns", children: [_jsx(Columns3, { size: 12 }), _jsx("span", { children: "Columns" }), hiddenCount > 0 && (_jsxs("span", { className: styles['column-filter-count'], children: [columns.length - hiddenCount, "/", columns.length] }))] }), open &&
                createPortal(_jsxs("div", { className: styles['column-filter-dropdown'], "data-column-filter": storageKey, style: { top: coords.top, left: coords.left }, children: [_jsx("div", { className: styles['column-filter-header'], children: "Toggle Columns" }), _jsxs("div", { className: styles['column-filter-list'], children: [_jsxs("button", { className: `${styles['column-filter-item']} ${styles['column-filter-toggle-all']} ${isAllVisible ? styles['column-filter-item-visible'] : ""}`, onClick: () => onToggleAll(!isAllVisible), children: [_jsx("span", { className: styles['column-filter-check'], children: isAllVisible && _jsx(Check, { size: 10 }) }), _jsx(ListChecks, { size: 11, className: styles['column-filter-toggle-all-icon'] }), _jsx("span", { className: styles['column-filter-label'], children: isAllVisible ? "Deselect All" : "Select All" })] }), _jsx("div", { className: styles['column-filter-divider'] }), hideableColumns.map((col) => {
                                    const visible = !hiddenColumns.has(col.key);
                                    return (_jsxs("button", { className: `${styles['column-filter-item']} ${visible ? styles['column-filter-item-visible'] : ""}`, onClick: () => onToggle(col.key), children: [_jsx("span", { className: styles['column-filter-check'], children: visible && _jsx(Check, { size: 10 }) }), _jsx("span", { className: styles['column-filter-label'], children: col.label })] }, col.key));
                                })] })] }), document.body)] }));
}
export default function TableComponent({ title, subtitle, columns, data = [], getRowKey, getSubRows, renderExpandedContent, onRowClick, emptyText = "No data", sortKey: externalSortKey, sortDir: externalSortDir, onSort, sortPinBottom, maxHeight, activeRowKey, highlightedRowKey, highlightedRowRef, onRowMouseEnter, onRowMouseLeave, getRowClassName, getRowStyle, mini = false, storageKey, className, }) {
    const { sound } = useComponents();
    const [internalSort, setInternalSort] = useState(() => {
        if (storageKey) {
            try {
                const saved = localStorage.getItem(`table-sort:${storageKey}`);
                if (saved)
                    return JSON.parse(saved);
            }
            catch { /* ignore */ }
        }
        const firstSortableKey = columns.find((column) => column.sortable !== false)?.key || null;
        return { key: firstSortableKey, dir: "asc" };
    });
    const sort = onSort
        ? { key: externalSortKey || null, dir: (externalSortDir || "desc") }
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
    const toggleAllColumns = useCallback((showAll) => {
        setHiddenColumns(() => {
            const hideableKeys = columns.filter((column) => column.hideable !== false).map((column) => column.key);
            const next = showAll ? new Set() : new Set(hideableKeys);
            saveHiddenColumns(storageKey, next);
            return next;
        });
    }, [storageKey, columns]);
    const visibleColumns = storageKey
        ? columns.filter((column) => !hiddenColumns.has(column.key))
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
        const target = e.target;
        if (target.closest("a, button, input, select, textarea, th"))
            return;
        const element = scrollRef.current;
        if (!element)
            return;
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
    const onPointerMove = useCallback((e) => {
        const drag = dragRef.current;
        if (!drag.active)
            return;
        const deltaX = e.clientX - drag.startX;
        const deltaY = e.clientY - drag.startY;
        if (!drag.moved && Math.abs(deltaX) + Math.abs(deltaY) > 5) {
            drag.moved = true;
            const element = scrollRef.current;
            if (element && drag.pointerId !== undefined) {
                try {
                    element.setPointerCapture(drag.pointerId);
                }
                catch { /* ignore */ }
            }
            scrollRef.current?.classList.add(styles['grabbing']);
        }
        if (drag.moved) {
            const element = scrollRef.current;
            if (element) {
                element.scrollLeft = drag.scrollLeft - deltaX;
                element.scrollTop = drag.scrollTop - deltaY;
            }
        }
    }, []);
    const onPointerUp = useCallback((e) => {
        const drag = dragRef.current;
        const wasDrag = drag.moved;
        drag.active = false;
        drag.moved = false;
        const element = scrollRef.current;
        if (element) {
            try {
                element.releasePointerCapture(e.pointerId);
            }
            catch { /* ignore */ }
            element.classList.remove(styles['grabbing']);
        }
        if (wasDrag && element) {
            const handler = (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
            };
            element.addEventListener("click", handler, { capture: true, once: true });
        }
    }, []);
    function handleSort(key) {
        let newDir;
        if (sort.key === key) {
            newDir = sort.dir === "desc" ? "asc" : "desc";
        }
        else {
            newDir = "asc";
        }
        if (onSort) {
            onSort(key, newDir);
        }
        else {
            const newState = { key, dir: newDir };
            setInternalSort(newState);
            if (storageKey) {
                try {
                    localStorage.setItem(`table-sort:${storageKey}`, JSON.stringify(newState));
                }
                catch { /* ignore */ }
            }
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
    const sortCol = sort.key ? columns.find((column) => column.key === sort.key) : null;
    const sorted = sort.key && !onSort
        ? [...data].sort((a, b) => {
            if (sortPinBottom) {
                const isPinnedA = sortPinBottom(a);
                const isPinnedB = sortPinBottom(b);
                if (isPinnedA !== isPinnedB)
                    return isPinnedA ? 1 : -1;
            }
            const sortValueA = sortCol?.sortValue ? sortCol.sortValue(a) : (a[sort.key] ?? 0);
            const sortValueB = sortCol?.sortValue ? sortCol.sortValue(b) : (b[sort.key] ?? 0);
            if (typeof sortValueA === "string" && typeof sortValueB === "string") {
                return sort.dir === "asc"
                    ? sortValueA.localeCompare(sortValueB)
                    : sortValueB.localeCompare(sortValueA);
            }
            return sort.dir === "asc" ? Number(sortValueA) - Number(sortValueB) : Number(sortValueB) - Number(sortValueA);
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
    const showHeader = !!(title || subtitle || storageKey);
    return (_jsxs("div", { className: `table-component ${styles['container']} ${mini ? styles['mini'] : ""} ${showHeader ? styles['has-header'] : ""} ${className || ""}`, children: [showHeader && (_jsxs("div", { className: styles['table-header'], children: [(title || subtitle) && (_jsxs("div", { className: styles['table-header-content'], children: [title && _jsx("h2", { className: styles['title'], children: title }), subtitle && _jsx("p", { className: styles['subtitle'], children: subtitle })] })), storageKey && (_jsx(ColumnFilter, { columns: columns, hiddenColumns: hiddenColumns, onToggle: toggleColumn, onToggleAll: toggleAllColumns, storageKey: storageKey }))] })), _jsx("div", { ref: scrollRef, className: styles['table-scroll'], style: maxHeight ? { maxHeight, overflowY: "auto" } : undefined, "data-table-scroll": true, onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: onPointerUp, onPointerCancel: onPointerUp, children: _jsxs("table", { className: styles['table'], children: [_jsx("thead", { children: _jsx("tr", { children: visibleColumns.map((col) => {
                                    const isSortable = col.sortable !== false;
                                    const isActive = sort.key === col.key;
                                    const thClasses = [
                                        styles['th'],
                                        isSortable ? styles['th-sortable'] : "",
                                        isActive ? styles['th-active'] : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ");
                                    return (_jsx(HeaderCell, { col: col, thClasses: thClasses, isSortable: isSortable, handleSort: handleSort, sort: sort }, col.key));
                                }) }) }), _jsx("tbody", { children: sorted.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length, className: styles['empty-row'], children: emptyText }) })) : (sorted.map((row, ri) => {
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
                                                : undefined, className: `${styles['tr']} ${clickable ? styles['clickable'] : ""} ${isExpandable ? styles['expandable-row'] : ""} ${isActive ? styles['active-row'] : ""} ${isHighlighted ? styles['highlighted-row'] : ""} ${customClass}`, style: customStyle, ...(clickable
                                                ? interactiveProps(isExpandable ? () => toggleExpand(key) : () => onRowClick?.(row), onRowMouseEnter ? () => onRowMouseEnter(row, ri) : undefined)
                                                : {}), ...(!clickable && onRowMouseEnter ? { onMouseEnter: () => onRowMouseEnter(row, ri) } : {}), onMouseLeave: onRowMouseLeave ? () => onRowMouseLeave(row, ri) : undefined, children: colsToRender.map((col, ci) => {
                                                const isFirst = ci === 0;
                                                const isSorted = sort.key === col.key;
                                                const tdClass = isFirst ? styles['td-name'] : styles['td'];
                                                const extraClass = col.className || "";
                                                const sortedClass = !isFirst && isSorted ? styles['td-sorted'] : "";
                                                const cellStyle = {
                                                    ...(col.align ? { textAlign: col.align } : {}),
                                                    ...(col.width ? { width: col.width, maxWidth: col.width } : {}),
                                                };
                                                let content;
                                                if (col.render) {
                                                    content = col.render(row, ri);
                                                }
                                                else {
                                                    content = (row[col.key] ?? "—");
                                                }
                                                return (_jsxs("td", { className: `${tdClass} ${extraClass} ${sortedClass}`, style: cellStyle, children: [isFirst && isExpandable && (_jsx("span", { className: `${styles['expand-icon']} ${isExpanded ? styles['expand-icon-open'] : ""}`, children: _jsx(ChevronDown, { size: 12 }) })), content] }, col.key));
                                            }) }), isExpanded && hasExpandedContent && (_jsx("tr", { className: styles['expanded-content-row'], children: _jsx("td", { colSpan: colsToRender.length, className: styles['expanded-content-cell'], children: renderExpandedContent(row) }) })), isExpanded &&
                                            !hasExpandedContent &&
                                            subRows.map((sub, si) => (_jsx("tr", { className: styles['sub-row'], children: colsToRender.map((col) => {
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
                                                        content = (sub[col.key] ?? "—");
                                                    }
                                                    return (_jsx("td", { style: cellStyle, children: content }, col.key));
                                                }) }, `${key}-sub-${si}`)))] }, key));
                            })) })] }) })] }));
}
//# sourceMappingURL=TableComponent.js.map