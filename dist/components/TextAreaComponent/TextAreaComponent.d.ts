/**
 * TextAreaComponent — Reusable auto-resizing textarea with consistent styling.
 */
export interface TextAreaComponentProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    minRows?: number;
    maxRows?: number;
    autoResize?: boolean;
}
export default function TextAreaComponent({ value, onChange, placeholder, minRows, maxRows, autoResize, disabled, readOnly, className, id, ...rest }: TextAreaComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TextAreaComponent.d.ts.map