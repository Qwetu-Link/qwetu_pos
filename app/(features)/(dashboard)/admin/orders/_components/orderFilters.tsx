import { Search } from "lucide-react";
import { OrderStatus, statusOptions } from "../../../../../../types/orderTypes";

export default function OrderFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: {
  searchTerm: string;
  statusFilter: OrderStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "all") => void;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by ID, customer, email or phone..."
            className="w-full rounded-xl border text-black placeholder:text-slate-400 transition border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as OrderStatus | "all")
          }
          className="rounded-xl border border-slate-200 text-black bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
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
  );
}
