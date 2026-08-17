"use client";

import { Search, X } from "lucide-react";
import { OrderStatus, statusOptions } from "@/data/order-options";

export default function OrderFilters({
  searchTerm,
  debouncedSearchTerm,
  statusFilter,
  totalCount,
  filteredCount,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: {
  searchTerm: string;
  debouncedSearchTerm: string;
  statusFilter: OrderStatus | "all";
  totalCount: number;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "all") => void;
  onClearFilters: () => void;
}) {
  const hasActiveFilters = debouncedSearchTerm !== "" || statusFilter !== "all";

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by order ID, customer, email or phone..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-black outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value as OrderStatus | "all")
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-black outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-700">
          {filteredCount} of {totalCount} orders
        </span>
        {hasActiveFilters ? (
          <>
            <div className="mx-1 h-4 w-px bg-slate-200" />
            {debouncedSearchTerm ? (
              <FilterChip
                label={`Search: "${debouncedSearchTerm}"`}
                onRemove={() => onSearchChange("")}
              />
            ) : null}
            {statusFilter !== "all" ? (
              <FilterChip
                label={`Status: ${statusFilter}`}
                onRemove={() => onStatusChange("all")}
              />
            ) : null}
            <button
              type="button"
              onClick={onClearFilters}
              className="ml-1 text-sm font-medium text-emerald-600 hover:text-emerald-800"
            >
              Clear all
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 transition hover:text-slate-600"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
