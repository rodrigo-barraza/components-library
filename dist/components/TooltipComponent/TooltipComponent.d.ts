/**
 * TooltipComponent — theme-aware tooltip with Plain and Rich variants.
 *
 * Both variants render on the theme's popover surface tokens (same family
 * as SelectComponent menus) with a translucent glass treatment, so tooltips
 * follow the active theme in every client.
 *
 *   • Two variants:
 *       - Plain (label):  compact label, popover surface, --border-radius-md
 *       - Rich:           subhead + supporting text, --border-radius-lg,
 *                         optional action slot, higher elevation
 *   • Rich tooltip:  optional title (subhead), supporting text,
 *                    optional action slot, optional persistent mode
 *   • Trigger: hover or focus on the anchor element
 *   • Enter delay: 500ms for plain, immediate for rich
 *   • Exit: plain auto-dismisses after 1500ms; rich stays until pointer leaves
 *   • Positioning: prefers the requested side, flips when viewport space runs out
 *   • No caret — clean floating surface
 *
 * Accessibility (per M3 Tooltips/Accessibility):
 *   • Plain tooltip uses `role="tooltip"` and `aria-describedby` on trigger
 *   • Rich tooltip is an interactive surface with role="status" or live region
 *   • Esc key dismisses the tooltip
 *   • Focus-visible on trigger shows the tooltip
 *   • Touch: long-press to show (not implemented in web — hover/focus only)
 *   • prefers-reduced-motion: skip entrance animation
 *
 * Props — Plain variant (default):
 *
 * Props — Rich variant (activates when `rich` is truthy):
 */
interface TooltipProps {
    label?: React.ReactNode;
    position?: string;
    trigger?: string;
    enterDelay?: number;
    exitDelay?: number;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
    rich?: boolean;
    title?: React.ReactNode;
    content?: React.ReactNode;
    action?: React.ReactNode;
    persistent?: boolean;
    delay?: number;
}
export default function TooltipComponent({ label, position, trigger, enterDelay, exitDelay, disabled, children, className, rich, title, content, action, persistent, delay, }: TooltipProps): string | number | bigint | boolean | import("react").JSX.Element | Iterable<import("react").ReactNode> | Promise<string | number | bigint | boolean | Iterable<import("react").ReactNode> | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | import("react").ReactPortal | null | undefined> | null | undefined;
export {};
//# sourceMappingURL=TooltipComponent.d.ts.map