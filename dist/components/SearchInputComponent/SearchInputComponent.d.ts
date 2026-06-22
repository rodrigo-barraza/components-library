interface SearchInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSubmit'> {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    compact?: boolean;
    useScrim?: boolean;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    onTrailingClick?: () => void;
    onSubmit?: (value: string) => void;
    onExpand?: () => void;
    onCollapse?: () => void;
    children?: React.ReactNode;
}
interface SuggestionProps {
    icon?: React.ReactNode;
    text: string | React.ReactNode;
    trailing?: React.ReactNode;
    onClick?: (value: string) => void;
    value?: string;
    index?: number;
}
declare function Suggestion({ icon, text, trailing, onClick, value, index }: SuggestionProps): import("react").JSX.Element;
interface SuggestionGroupProps {
    label?: string;
    children?: React.ReactNode;
}
declare function SuggestionGroup({ label, children }: SuggestionGroupProps): import("react").JSX.Element;
interface SuggestionsEmptyProps {
    message?: string | React.ReactNode;
}
declare function SuggestionsEmpty({ message }: SuggestionsEmptyProps): import("react").JSX.Element;
declare const SearchInputWithSubcomponents: import("react").ForwardRefExoticComponent<SearchInputProps & import("react").RefAttributes<HTMLInputElement>> & {
    Suggestion: typeof Suggestion;
    SuggestionGroup: typeof SuggestionGroup;
    Empty: typeof SuggestionsEmpty;
};
export default SearchInputWithSubcomponents;
//# sourceMappingURL=SearchInputComponent.d.ts.map