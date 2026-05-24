/**
 * TooltipComponent — M3-inspired tooltip with Plain and Rich variants.
 *
 * M3 Spec Reference (Tooltips):
 *   • Two variants:
 *       - Plain (label):  single-line label, inverse-surface bg, 4px radius
 *       - Rich:           multi-line subhead + supporting text, surface-container bg,
 *                         12px radius, optional action button, elevation 2
 *   • Plain tooltip: max 1 line, concise label text
 *   • Rich tooltip:  optional title (subhead), supporting text (body-small),
 *                    optional action slot, optional persistent mode
 *   • Trigger: hover or focus on the anchor element
 *   • Enter delay: 500ms for plain, immediate for rich (on long-press on touch)
 *   • Exit: plain auto-dismisses after 1500ms; rich stays until pointer leaves
 *   • Positioning: prefers below anchor with 4px–8px gap, flips to opposite
 *   • Caret/no-caret: M3 plain tooltips have no caret
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
export default function TooltipComponent({ label, position, trigger, enterDelay, exitDelay, disabled, children, className, rich, title, content, action, persistent, delay, }: TooltipProps): string | number | bigint | boolean | Iterable<import("react").ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
export {};
//# sourceMappingURL=TooltipComponent.d.ts.map