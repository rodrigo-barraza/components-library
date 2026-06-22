import React from "react";
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
    className?: string;
}
export default function TableComponent<T, TSub = unknown>({ title, subtitle, columns, data, getRowKey, getSubRows, renderExpandedContent, onRowClick, emptyText, sortKey: externalSortKey, sortDir: externalSortDir, onSort, maxHeight, activeRowKey, highlightedRowKey, highlightedRowRef, onRowMouseEnter, onRowMouseLeave, getRowClassName, getRowStyle, mini, storageKey, className, }: TableComponentProps<T, TSub>): React.JSX.Element;
//# sourceMappingURL=TableComponent.d.ts.map