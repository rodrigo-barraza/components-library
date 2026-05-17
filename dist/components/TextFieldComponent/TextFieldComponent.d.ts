/**
 * TextFieldComponent — M3-compliant text field with floating label.
 *
 * Supports both **Filled** and **Outlined** variants per the Material Design 3
 * text field specification. Includes multiline (textarea) support, character
 * counter, prefix/suffix text, leading/trailing icons, error and disabled states,
 * and full keyboard accessibility.
 *
 * M3 Spec Reference:
 *   • Container height:     56px
 *   • Filled border-radius: 4px top
 *   • Outlined border-radius: 4px all sides
 *   • Label typography:     body-large (16/24) → body-small (12/16)
 *   • Input typography:     body-large (16/24)
 *   • Supporting text:      body-small (12/16)
 *   • Active indicator:     1px → 3px on focus (filled)
 *   • Outline stroke:       1px → 2px on focus (outlined)
 *
 * @param {"filled"|"outlined"} [variant="outlined"] — Visual variant
 * @param {string}   [label]          — Floating label text
 * @param {string}   value            — Controlled value
 * @param {Function} onChange         — (e) => void
 * @param {string}   [type="text"]    — Input type (text, password, email, number, tel, url, search)
 * @param {string}   [placeholder]    — Placeholder shown when focused / no label
 * @param {boolean}  [disabled]       — Disabled state
 * @param {boolean}  [readOnly]       — Read-only state
 * @param {boolean}  [error]          — Error state styling
 * @param {string}   [supportingText] — Helper text below the field
 * @param {string}   [errorText]      — Error message (overrides supportingText when error=true)
 * @param {number}   [maxLength]      — Max character count (enables counter)
 * @param {string}   [prefix]         — Prefix text (e.g., "$")
 * @param {string}   [suffix]         — Suffix text (e.g., "kg")
 * @param {React.ReactNode} [leadingIcon]  — Leading icon element
 * @param {React.ReactNode} [trailingIcon] — Trailing icon element
 * @param {Function} [onTrailingIconClick] — Click handler for trailing icon
 * @param {boolean}  [multiline]      — Render as textarea
 * @param {number}   [rows=3]         — Minimum rows for multiline
 * @param {number}   [maxRows=8]      — Maximum rows before scrolling
 * @param {boolean}  [autoResize=true] — Auto-grow textarea
 * @param {string}   [className]      — Additional root class
 * @param {string}   [id]             — Element ID for accessibility
 * @param {string}   [name]           — Form field name
 * @param {boolean}  [required]       — Required field
 * @param {string}   [autoComplete]   — Autocomplete attribute
 */
declare const TextFieldComponent: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
export default TextFieldComponent;
//# sourceMappingURL=TextFieldComponent.d.ts.map