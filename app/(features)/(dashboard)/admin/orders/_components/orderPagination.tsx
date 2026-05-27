"use client";

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface OrderPaginationProps {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function OrderPagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
}: OrderPaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  const maxVisible = 5;
  let pageStart = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const pageEnd = Math.min(totalPages, pageStart + maxVisible - 1);
  if (pageEnd - pageStart < maxVisible - 1) {
    pageStart = Math.max(1, pageEnd - maxVisible + 1);
  }
  const pages = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, index) => pageStart + index,
  );

  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
  };

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const active = "bg-emerald-600 text-white";
  const inactive = "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
      <span className="text-slate-500">
        {start}-{end} of {totalItems} orders
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className={`${base} ${inactive}`}
          aria-label="First page"
        >
          <ChevronFirst className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${base} ${inactive}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`${base} ${page === currentPage ? active : inactive}`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${base} ${inactive}`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`${base} ${inactive}`}
          aria-label="Last page"
        >
          <ChevronLast className="h-4 w-4" />
        </button>
      </div>

      <label className="flex items-center gap-2 text-slate-500">
        <select
          value={perPage}
          onChange={(event) => onPerPageChange(Number(event.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {[5, 10, 25, 50].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        per page
      </label>
    </div>
  );
}
