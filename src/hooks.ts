import { useState } from 'react';
import { Columns } from './utils/types';

export const useTablePagination = (initialRowsPerPage: number) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page,
    setPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};

export const usePagination = (items: Columns, itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemEntries = Object.entries(items);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemEntries.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(itemEntries.length / itemsPerPage);

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    currentItems,
    totalPages,
    handlePaginationChange,
  };
};
