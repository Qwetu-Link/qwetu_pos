"use client";

interface Props {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
}: Props) {
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  // Page numbers window
  const windowSize = 5;
  let pageStart = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const pageEnd = Math.min(totalPages, pageStart + windowSize - 1);
  if (pageEnd - pageStart < windowSize - 1)
    pageStart = Math.max(1, pageEnd - windowSize + 1);

  const pageNums = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, i) => pageStart + i
  );

  const btnBase =
    "px-2.5 py-1.5 text-sm rounded-lg transition font-medium";
  const btnActive = "bg-emerald-600 text-white";
  const btnInactive = "bg-gray-100 hover:bg-gray-200 text-gray-700";
  const btnNav = "bg-emerald-600 text-white hover:bg-emerald-700";

  return (
    <div className="bg-white rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 text-sm border mt-4">
      {/* Info */}
      <span className="text-gray-500">
        {start}–{end} of {totalItems} items
      </span>

      {/* Pages */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${btnNav} disabled:opacity-40`}
        >
          «
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${btnNav} disabled:opacity-40`}
        >
          ‹
        </button>
        {pageNums.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${btnNav} disabled:opacity-40`}
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${btnNav} disabled:opacity-40`}
        >
          »
        </button>
      </div>

      {/* Per page */}
      <div className="flex items-center gap-2">
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="border border-black rounded-lg px-2 py-1 text-sm outline-none text-black bg-white"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="text-gray-500">per page</span>
      </div>
    </div>
  );
}
