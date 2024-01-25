"use client";
import React, { useEffect, useState, useMemo } from "react";

const PaginationComponent = ({
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (total > 0 && itemsPerPage > 0) {
      setTotalPages(Math.ceil(total / itemsPerPage));
    }
  }, [total, itemsPerPage]);

  const paginationItems = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 10; // Change this number to control how many page links you want to display

    if (totalPages <= maxVisiblePages) {
      // If the total number of pages is less than or equal to maxVisiblePages, show all page links
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <div
            key={i}
            className={i === currentPage ? "active" : ""}
            onClick={() => onPageChange(i)}
          >
            {i}
          </div>
        );
      }
    } else {
      // If the total number of pages is greater than maxVisiblePages, show limited links with ellipsis
      const middlePageIndex = Math.ceil(maxVisiblePages / 2);
      const showEllipsisStart = currentPage > middlePageIndex + 1;
      const showEllipsisEnd = currentPage < totalPages - middlePageIndex;

      // First page
      pages.push(
        <div
          key={1}
          className={1 === currentPage ? "active" : ""}
          onClick={() => onPageChange(1)}
        >
          {1}
        </div>
      );

      if (showEllipsisStart) {
        // Show ellipsis at the start
        pages.push(<div key="start-ellipsis">...</div>);
      }

      let startPage;
      let endPage;

      if (currentPage <= middlePageIndex) {
        // When the current page is close to the first page
        startPage = 2;
        endPage = maxVisiblePages - 1;
      } else if (currentPage >= totalPages - middlePageIndex) {
        // When the current page is close to the last page
        startPage = totalPages - maxVisiblePages + 2;
        endPage = totalPages - 1;
      } else {
        // Normal case
        startPage = currentPage - middlePageIndex;
        endPage = currentPage + middlePageIndex;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <div
            key={i}
            className={i === currentPage ? "active" : ""}
            onClick={() => onPageChange(i)}
          >
            {i}
          </div>
        );
      }

      if (showEllipsisEnd) {
        // Show ellipsis at the end
        pages.push(<div key="end-ellipsis">...</div>);
      }

      // Last page
      pages.push(
        <div
          key={totalPages}
          className={totalPages === currentPage ? "active" : ""}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </div>
      );
    }

    return pages;
  }, [totalPages, currentPage]);

  //showing enteries as per
  const getRangeText = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, total);
    return `Showing ${startItem} to ${endItem} of ${total} items`;
  };

  return (
    <>
      <div className="float-right d-flex justify-content-center mt-3">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {paginationItems.map((item, index) => (
              <li key={index} className={item.props.className}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(Number(item.key))}
                >
                  {item}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div style={{fontSize:'0.8rem'}}>{getRangeText()}</div>
    </>
  );
};

export default PaginationComponent;
