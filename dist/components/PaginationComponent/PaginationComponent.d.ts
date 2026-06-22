export interface PaginationComponentProps {
    page: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    limit?: number;
}
export default function PaginationComponent({ page, totalPages, totalItems, onPageChange, limit, }: PaginationComponentProps): import("react").JSX.Element | null;
//# sourceMappingURL=PaginationComponent.d.ts.map