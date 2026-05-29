import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPage: (page: number) => void;
  onPerPage: (value: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  perPage,
  onPage,
  onPerPage,
}: PaginationProps) {
  const start = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
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
        {start}-{end} of {total} items
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={currentPage === 1}
          onClick={() => onPage(1)}
        >
          <ChevronFirst size={14} />
        </button>
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={currentPage === 1}
          onClick={() => onPage(currentPage - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`${base} ${page === currentPage ? active : inactive}`}
            onClick={() => onPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={currentPage === totalPages}
          onClick={() => onPage(currentPage + 1)}
        >
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className={`${base} ${inactive}`}
          disabled={currentPage === totalPages}
          onClick={() => onPage(totalPages)}
        >
          <ChevronLast size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-slate-500">
        <select
          value={perPage}
          onChange={(event) => onPerPage(Number(event.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {[10, 25, 50, 100].map((value) => (
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
