import { useState } from 'react';
import '../styles/pagination.scss';

function Pagination({ items, itemsPerPage = 10, renderItems }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (items.length === 0) return renderItems([]);

  return (
    <div className="pagination-container">
      <div className="pagination-content">
        {renderItems(currentItems)}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Précédent
          </button>

          <div className="pagination-numbers">
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => goToPage(page)}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="pagination-ellipsis">...</span>
              )
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Suivant →
          </button>
        </div>
      )}

      <div className="pagination-info">
        Page {currentPage} sur {totalPages} • {items.length} éléments au total
      </div>
    </div>
  );
}

export default Pagination;
