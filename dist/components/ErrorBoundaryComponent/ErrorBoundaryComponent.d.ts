import { Component } from "react";
/**
 * ErrorBoundaryComponent — React Error Boundary that catches render errors
 * and displays a styled fallback UI instead of a white screen.
 *
 * Wrap page layouts or critical subtrees to prevent the entire app from
 * unmounting on an unexpected exception.
 *
 * @param {React.ReactNode} children — Protected subtree
 * @param {React.ReactNode} [fallback] — Custom fallback UI (default: built-in error card)
 * @param {string} [title] — Error card heading (default: "Something went wrong")
 * @param {string} [subtitle] — Error card description
 * @param {(error: Error, info: { componentStack: string }) => void} [onError] — Error callback
 * @param {boolean} [showDetails] — Show error.message in the fallback (default: false)
 */
export default class ErrorBoundaryComponent extends Component {
    constructor(props: any);
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
        error: any;
    };
    componentDidCatch(error: any, info: any): void;
    handleRetry: () => void;
    render(): any;
}
//# sourceMappingURL=ErrorBoundaryComponent.d.ts.map