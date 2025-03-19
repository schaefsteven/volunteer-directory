// components/Pagination.tsx
"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // components/Pagination.tsx
  // Update the component

  return (
    <div className="flex flex-wrap items-center justify-center space-x-1 space-y-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded border bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {totalPages <= 7 ? (
        // Show all pages if there are 7 or fewer
        [...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {index + 1}
          </button>
        ))
      ) : (
        // Show limited pages for larger page counts
        <>
          {/* First page */}
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            1
          </button>

          {/* Ellipsis for pages before current */}
          {currentPage > 3 && <span className="px-3 py-1">...</span>}

          {/* Pages around current */}
          {[...Array(Math.min(5, totalPages))]
            .map((_, i) => {
              const pageNum = Math.max(2, currentPage - 1) + i;
              if (pageNum > 1 && pageNum < totalPages) {
                return (
                  <button
                    key={i}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })
            .filter(Boolean)}

          {/* Ellipsis for pages after current */}
          {currentPage < totalPages - 2 && (
            <span className="px-3 py-1">...</span>
          )}

          {/* Last page */}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded border bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
