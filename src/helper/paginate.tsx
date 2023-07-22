import { useEffect, useState } from 'react'
import { MetaType } from '../types/pagination';

export const usePaginate = (itemsPerPage: number, items: Array<any>, filter: string = "") => {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items, filter]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setCurrentPage(event.selected + 1)
    setItemOffset(newOffset);
  };

  return {
    currentItems,
    pageCount,
    currentPage,
    handlePageClick
  }
}

export const usePagination = (pageSize: number = 5) => {

  const [page, setPage] = useState<number>(1)
  const [meta, setMeta] = useState<MetaType>({ count: 0, page: 1 })
  const [resultPerPage, setResultPerPage] = useState<number>(pageSize);

  useEffect(() => {
    setPage(1)
  }, [resultPerPage])

  function handleNextClick() {
    if (meta.page <= Math.ceil(meta.count / resultPerPage)) {
      setPage(Number(meta.page) + 1)
    }
  }

  function handlePrevClick() {
    if (meta.page <= Math.ceil(meta.count / resultPerPage)) {
      const newPage = Number(meta.page) - 1;
      setPage(newPage === 0 ? 1 : newPage)
    }
  }

  function fetchNextPage() {
    setPage(prev => prev + 1);
  }

  return {
    page,
    count: meta.count,
    totalPages: Math.ceil(meta.count / resultPerPage),
    resultPerPage,
    prevDisabled: page === 1,
    nextDisabled: Math.ceil(meta.count / resultPerPage) === page,
    setMeta,
    setPage,
    fetchNextPage,
    setResultPerPage,
    handleNextClick,
    handlePrevClick
  }
}