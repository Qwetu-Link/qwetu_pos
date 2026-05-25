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
  onPage: (p: number) => void;
  onPerPage: (v: number) => void;
}

export function Pagination({
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
  let startP = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endP = Math.min(totalPages, startP + maxVisible - 1);
  if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);
  const pages = Array.from({ length: endP - startP + 1 }, (_, i) => startP + i);

  const base = "px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const active = "bg-emerald-600 text-white";
  const inactive = "bg-slate-100 hover:bg-slate-200 text-slate-700";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap justify-between items-center gap-3 text-sm mt-4">
      <span className="text-slate-500">
        {start}–{end} of {total} items
      </span>

      <div className="flex items-center gap-1">
        <button className={`${base} ${inactive}`} disabled={currentPage === 1} onClick={() => onPage(1)}>
          <ChevronFirst size={14} />
        </button>
        <button className={`${base} ${inactive}`} disabled={currentPage === 1} onClick={() => onPage(currentPage - 1)}>
          <ChevronLeft size={14} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`${base} ${p === currentPage ? active : inactive}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}
        <button className={`${base} ${inactive}`} disabled={currentPage === totalPages} onClick={() => onPage(currentPage + 1)}>
          <ChevronRight size={14} />
        </button>
        <button className={`${base} ${inactive}`} disabled={currentPage === totalPages} onClick={() => onPage(totalPages)}>
          <ChevronLast size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-slate-500">
        <select
          value={perPage}
          onChange={(e) => onPerPage(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {[10, 25, 50, 100].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        Items per page
      </div>
    </div>
  );
}
