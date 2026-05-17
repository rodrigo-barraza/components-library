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
 *   @param {string}            label          — Plain tooltip text
 *   @param {"top"|"bottom"|"left"|"right"} [position="top"] — Preferred position
 *   @param {"hover"|"click"}   [trigger="hover"] — Trigger mode
 *   @param {number}            [enterDelay=500]  — Hover delay before show (ms)
 *   @param {number}            [exitDelay=1500]  — Auto-hide delay (ms) for click trigger
 *   @param {boolean}           [disabled=false]  — Disable tooltip entirely
 *   @param {string}            [className=""]    — Extra class on wrapper
 *
 * Props — Rich variant (activates when `rich` is truthy):
 *   @param {boolean}           [rich=false]      — Enable rich tooltip variant
 *   @param {string}            [title]           — Rich tooltip subhead text
 *   @param {React.ReactNode}   [content]         — Rich tooltip supporting text (can be JSX)
 *   @param {React.ReactNode}   [action]          — Rich tooltip action slot (e.g. button)
 *   @param {boolean}           [persistent=false] — Rich tooltip stays visible until dismissed
 *
 * @param {React.ReactNode} children — The trigger/anchor element(s)
 */
export default function TooltipComponent({ label, position, trigger, enterDelay, exitDelay, disabled, children, className, rich, title, content, action, persistent, delay, }: {
    label: any;
    position?: string | undefined;
    trigger?: string | undefined;
    enterDelay?: number | undefined;
    exitDelay?: number | undefined;
    disabled?: boolean | undefined;
    children: any;
    className?: string | undefined;
    rich?: boolean | undefined;
    title: any;
    content: any;
    action: any;
    persistent?: boolean | undefined;
    delay: any;
}): any;
//# sourceMappingURL=TooltipComponent.d.ts.map