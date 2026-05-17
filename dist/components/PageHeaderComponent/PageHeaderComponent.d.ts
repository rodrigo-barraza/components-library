/**
 * PageHeaderComponent — Unified page header with optional back navigation.
 *
 * Merges the prism-client (sticky, blur, back arrow) and portal (simple flex)
 * variants. The `sticky` prop controls whether the header sticks to the top.
 *
 * @param {string} title
 * @param {string} [subtitle]
 * @param {Function} [onBack] — If provided, renders a back arrow button
 * @param {React.ReactNode} [centerContent] — Absolutely centered content
 * @param {React.ReactNode} [children] — Right-side action slot
 * @param {boolean} [sticky=true] — Whether the header is sticky
 * @param {string} [className] — Additional class
 */
export default function PageHeaderComponent({ title, subtitle, onBack, centerContent, children, sticky, className, }: {
    title: any;
    subtitle: any;
    onBack: any;
    centerContent: any;
    children: any;
    sticky?: boolean | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PageHeaderComponent.d.ts.map