import { useState, useCallback } from "react";

/**
 * Hook quản lý pagination
 */
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  }, []);

  const updatePagination = useCallback((paginationData) => {
    if (paginationData) {
      setTotal(paginationData.total || 0);
      setTotalPages(paginationData.pages || 0);
    }
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotal(0);
    setTotalPages(0);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    total,
    totalPages,
    handlePageChange,
    handleLimitChange,
    updatePagination,
    reset,
  };
};

export default usePagination;
