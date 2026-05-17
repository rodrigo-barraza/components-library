/**
 * TextAreaComponent — Reusable auto-resizing textarea with consistent styling.
 *
 * @param {string}   value       — Current value
 * @param {Function} onChange    — (e) => void
 * @param {string}   [placeholder] — Placeholder text
 * @param {number}   [minRows=3]  — Minimum visible rows
 * @param {number}   [maxRows=12] — Maximum visible rows before scrolling
 * @param {boolean}  [autoResize=true] — Auto-grow to content


 * @param {string}   [className] — Additional class
 * @param {string}   [id]       — Element ID for accessibility
 */
export default function TextAreaComponent({ value, onChange, placeholder, minRows, maxRows, autoResize, disabled, readOnly, className, id, ...rest }: {
    [x: string]: any;
    value: any;
    onChange: any;
    placeholder: any;
    minRows?: number;
    maxRows?: number;
    autoResize?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    className: any;
    id: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TextAreaComponent.d.ts.map