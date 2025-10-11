import '../assets/dataSencor.scss';
import React, { useMemo } from 'react';

function Pagination({ handlePageChange, currentPage, totalPages }) {
  const maxVisiblePages = 5;

  const getPageNumbers = useMemo(() => {
    let pages = [];

    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang ít -> hiển thị hết
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = start + maxVisiblePages - 1;

      if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisiblePages + 1); // Đảm bảo start >= 1
      }

      for (let i = start; i <= end; i++) pages.push(i);

      // Logic ellipsis được cải thiện - chỉ hiện "..." khi cách > 1 page
      if (start > 1) {
        if (start > 2) { // Chỉ hiện "..." khi start > 2 (tránh "1 ... 3")
          pages.unshift('...');
        }
        pages.unshift(1);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) { // Chỉ hiện "..." khi end < totalPages - 1
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]); // useMemo để tối ưu performance

  // Validate props
  if (!totalPages || totalPages <= 0) return null;
  if (currentPage < 1 || currentPage > totalPages) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="page-btn"
          aria-label="First page"
        >
          «
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-btn"
          aria-label="Previous page"
        >
          ‹
        </button>

        {getPageNumbers.map((pageNum, index) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="ellipsis" aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-btn"
          aria-label="Next page"
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="page-btn"
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
}

export default Pagination;
