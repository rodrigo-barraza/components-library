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
 */
export interface ToolbarComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "standard" | "dense" | "flat" | string;
    orientation?: "horizontal" | "vertical" | string;
    divider?: boolean;
    sticky?: boolean;
    elevated?: boolean;
    ariaLabel?: string;
}
declare function ToolbarComponent({ variant, orientation, divider, sticky, elevated, ariaLabel, className, style, children, ...rest }: ToolbarComponentProps): import("react/jsx-runtime").JSX.Element;
declare namespace ToolbarComponent {
    var Group: typeof ToolbarGroup;
    var Item: import("react").ForwardRefExoticComponent<import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
        icon?: React.ComponentType<{
            size?: number;
            strokeWidth?: number;
            className?: string;
        }>;
        label?: string;
        ariaLabel?: string;
        active?: boolean;
    } & import("react").RefAttributes<HTMLButtonElement>>;
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
 */
interface ToolbarGroupProps {
    ariaLabel?: string;
    className?: string;
    children?: React.ReactNode;
}
declare function ToolbarGroup({ ariaLabel, className, children }: ToolbarGroupProps): import("react/jsx-runtime").JSX.Element;
/**
 * ToolbarSeparator — visual divider between toolbar groups.
 *
 * M3 spec: 1px outline-variant line, 24px height, 4px horizontal margin.
 */
interface ToolbarSeparatorProps {
    className?: string;
}
declare function ToolbarSeparator({ className }: ToolbarSeparatorProps): import("react/jsx-runtime").JSX.Element;
/**
 * ToolbarTitle — text label displayed within the toolbar.
 *
 * M3 spec: title-medium typography (16px / 500 weight).
 */
interface ToolbarTitleProps {
    className?: string;
    children?: React.ReactNode;
}
declare function ToolbarTitle({ className, children }: ToolbarTitleProps): import("react/jsx-runtime").JSX.Element;
/**
 * ToolbarSpacer — flex spacer to distribute space between groups.
 *
 * Pushes trailing items to the end (or distributes space evenly
 * when placed between groups).
 */
declare function ToolbarSpacer(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ToolbarComponent.d.ts.map