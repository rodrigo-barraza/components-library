import { Component, type ReactNode } from "react";
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    title?: string;
    subtitle?: string;
    onError?: (error: Error, info: {
        componentStack: string;
    }) => void;
    showDetails?: boolean;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
/**
 * ErrorBoundaryComponent — React Error Boundary that catches render errors
 * and displays a styled fallback UI instead of a white screen.
 *
 * Wrap page layouts or critical subtrees to prevent the entire app from
 * unmounting on an unexpected exception.
 */
export default class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): {
        hasError: boolean;
        error: Error;
    };
    componentDidCatch(error: Error, info: {
        componentStack: string;
    }): void;
    handleRetry: () => void;
    render(): string | number | bigint | boolean | import("react").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | Iterable<ReactNode> | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | import("react").ReactPortal | null | undefined> | null | undefined;
}
export {};
//# sourceMappingURL=ErrorBoundaryComponent.d.ts.map