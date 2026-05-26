"use client";

import styles from "./PaginationComponent.module.css";

export interface PaginationComponentProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  limit?: number;
}

export default function PaginationComponent({
  page,
  totalPages,
  totalItems,
  onPageChange,
  limit,
}: PaginationComponentProps) {
  if (totalPages <= 1) return null;

  const renderInfo = () => {
    if (limit) {
      const start = (page - 1) * limit + 1;
      const end = Math.min(page * limit, totalItems);
      return `Showing ${start}–${end} of ${totalItems.toLocaleString()}`;
    }
    return `Page ${page} of ${totalPages} · ${totalItems} total`;
  };

  return (
    <div className={styles.pagination}>
      <span className={styles.pageInfo}>{renderInfo()}</span>
      <div className={styles.pageButtons}>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
