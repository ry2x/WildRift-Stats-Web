'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

/**
 * A reusable pagination component with navigation controls
 * Shows current page status and allows navigation between pages
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <div className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">
        {totalItems}体のチャンピオン中 {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, totalItems)}
        体を表示
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="page-btns"
          aria-label="最初のページへ"
        >
          «
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-btns"
          aria-label="前のページへ"
        >
          ←
        </button>
        <span className="px-4 py-2 rounded-md bg-linear-to-r from-blue-500 to-purple-500 text-white">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-btns"
          aria-label="次のページへ"
        >
          →
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="page-btns"
          aria-label="最後のページへ"
        >
          »
        </button>
      </div>
    </div>
  );
}
