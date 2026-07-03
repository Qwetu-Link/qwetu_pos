import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  total?: number;
  totalItems?: number;
  perPage: number;
  onPage?: (page: number) => void;
  onPerPage?: (perPage: number) => void;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages: providedTotalPages,
  total,
  totalItems,
  perPage,
  onPage,
  onPerPage,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const itemTotal = total ?? totalItems ?? 0;
  const totalPages = providedTotalPages ?? Math.max(1, Math.ceil(itemTotal / perPage));
  const page = Math.min(currentPage, totalPages);
  const handlePage = onPage ?? onPageChange;
  const handlePerPage = onPerPage ?? onPerPageChange;
  const start = itemTotal === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, itemTotal);

  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );
  const base =
    "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const active = "bg-emerald-600 text-white";
  const inactive = "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
      <span className="text-slate-500">
        {start}-{end} of {itemTotal} items
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={page === 1}
          onClick={() => handlePage?.(1)}
        >
          <ChevronFirst size={14} />
        </button>
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={page === 1}
          onClick={() => handlePage?.(page - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`${base} ${pageNumber === page ? active : inactive}`}
            onClick={() => handlePage?.(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={page === totalPages}
          onClick={() => handlePage?.(page + 1)}
        >
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={page === totalPages}
          onClick={() => handlePage?.(totalPages)}
        >
          <ChevronLast size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-slate-500">
        <select
          value={perPage}
          onChange={(event) => handlePerPage?.(Number(event.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {[5, 10, 25, 50, 100].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        per page
      </div>
    </div>
  );
}

export { Pagination };
