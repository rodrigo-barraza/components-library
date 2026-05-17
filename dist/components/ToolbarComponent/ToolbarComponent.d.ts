/**
 * ToolbarComponent — M3-inspired toolbar container.
 *
 * Material Design 3 Toolbar is a horizontal bar that groups contextual
 * action icons, navigation, and controls. It surfaces the most relevant
 * actions for the current context.
 *
 * @see https://m3.material.io/components/toolbars/overview
 *
 * Compound sub-components:
 *   ToolbarComponent.Group      — logical grouping of related actions
 *   ToolbarComponent.Item       — individual interactive toolbar item (icon button)
 *   ToolbarComponent.Separator  — visual divider between groups
 *   ToolbarComponent.Title      — text label / title within the toolbar
 *   ToolbarComponent.Spacer     — flex spacer to push items apart
 *
 * Accessibility (WAI-ARIA Toolbar pattern):
 *   • role="toolbar" with aria-label
 *   • Roving tabindex: arrow keys move focus between items
 *   • Home / End jump to first / last item
 *   • Tab moves focus out of the toolbar entirely
 *
 * @param {"standard"|"dense"}  [variant="standard"]  — height variant
 * @param {"horizontal"|"vertical"} [orientation="horizontal"] — layout direction
 * @param {boolean}   [divider=false]    — renders a bottom border
 * @param {boolean}   [sticky=false]     — makes toolbar sticky at top
 * @param {boolean}   [elevated=false]   — adds subtle shadow
 * @param {string}    [ariaLabel]        — accessible label for the toolbar
 * @param {string}    [className]
 * @param {object}    [style]
 * @param {React.ReactNode} children
 */
declare function ToolbarComponent({ variant, orientation, divider, sticky, elevated, ariaLabel, className, style, children, ...rest }: {
    [x: string]: any;
    variant?: string | undefined;
    orientation?: string | undefined;
    divider?: boolean | undefined;
    sticky?: boolean | undefined;
    elevated?: boolean | undefined;
    ariaLabel: any;
    className: any;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
declare namespace ToolbarComponent {
    var Group: typeof ToolbarGroup;
    var Item: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
    var Separator: typeof ToolbarSeparator;
    var Title: typeof ToolbarTitle;
    var Spacer: typeof ToolbarSpacer;
}
export default ToolbarComponent;
/**
 * ToolbarGroup — logically groups related toolbar items.
 *
 * M3 toolbars organize actions into leading, center, and trailing
 * groups. Use `role="group"` with an aria-label for screen readers.
 *
 * @param {string}    [ariaLabel]  — accessible group label
 * @param {string}    [className]
 * @param {React.ReactNode} children
 */
declare function ToolbarGroup({ ariaLabel, className, children }: {
    ariaLabel: any;
    className: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * ToolbarSeparator — visual divider between toolbar groups.
 *
 * M3 spec: 1px outline-variant line, 24px height, 4px horizontal margin.
 *
 * @param {string}  [className]
 */
declare function ToolbarSeparator({ className }: {
    className: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * ToolbarTitle — text label displayed within the toolbar.
 *
 * M3 spec: title-medium typography (16px / 500 weight).
 *
 * @param {string}    [className]
 * @param {React.ReactNode} children
 */
declare function ToolbarTitle({ className, children }: {
    className: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * ToolbarSpacer — flex spacer to distribute space between groups.
 *
 * Pushes trailing items to the end (or distributes space evenly
 * when placed between groups).
 */
declare function ToolbarSpacer(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ToolbarComponent.d.ts.map