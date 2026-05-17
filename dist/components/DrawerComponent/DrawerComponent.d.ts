/**
 * DrawerComponent — M3 Side Sheet / slide-in drawer panel.
 *
 * A reusable panel that slides in from either side of the viewport.
 * Supports click-outside dismiss, Escape key, optional scrim overlay,
 * structured sections with label/value grids, and arbitrary children.
 *
 * @param {Object}   props
 * @param {boolean}  props.open                  — Controls drawer visibility
 * @param {Function} props.onClose               — Called when dismissed
 * @param {string}   [props.title="Detail"]      — Drawer header title
 * @param {"right"|"left"} [props.anchor="right"] — Which edge the drawer opens from
 * @param {number|string}  [props.width=480]      — Drawer width (px or CSS value)
 * @param {boolean}  [props.scrim=false]          — Show a backdrop overlay behind the drawer
 * @param {boolean}  [props.dismissible=true]     — Allow scrim click / outside click / Escape dismiss
 * @param {React.ReactNode} [props.headerActions] — Extra elements rendered in the header (before close button)
 * @param {Array<{title: string, items: Array<{label: string, value: React.ReactNode, mono?: boolean}>}>} [props.sections]
 *   — Structured detail sections rendered as label/value grids
 * @param {React.ReactNode} [props.children]      — Additional content rendered after sections
 * @param {string}   [props.className]            — Additional class for the drawer container
 * @param {string}   [props.id]                   — Unique ID for the drawer element
 */
export default function DrawerComponent({ open, onClose, title, anchor, width, scrim, dismissible, headerActions, sections, children, className, id, }: {
    open: any;
    onClose: any;
    title?: string | undefined;
    anchor?: string | undefined;
    width?: number | undefined;
    scrim?: boolean | undefined;
    dismissible?: boolean | undefined;
    headerActions: any;
    sections?: never[] | undefined;
    children: any;
    className: any;
    id: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DrawerComponent.d.ts.map