import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show only a window of pages around the current page
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="flex w-0 flex-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="mr-3 h-5 w-5" aria-hidden="true" />
          Previous
        </button>
      </div>
      <div className="hidden md:flex">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                {page}
              </span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                  currentPage === page
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="ml-3 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}