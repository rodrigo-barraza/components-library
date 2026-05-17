/**
 * BreadcrumbComponent — Navigation breadcrumb trail.
 *
 * Renders a horizontal chain of path segments separated by
 * a chevron divider. The last item is styled as the current page
 * (non-interactive, bold). Supports icon prefixes per segment.
 *
 * @param {Array<{label: string, href?: string, icon?: React.ComponentType, onClick?: Function}>} items
 *   — Ordered breadcrumb segments
 * @param {"chevron"|"slash"|"dot"} [separator="chevron"] — Divider style
 * @param {string} [className]
 */
export default function BreadcrumbComponent({ items, separator, className, ...rest }: {
    [x: string]: any;
    items?: never[] | undefined;
    separator?: string | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=BreadcrumbComponent.d.ts.map