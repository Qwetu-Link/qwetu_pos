import { MapPin, Search } from "lucide-react";
import { LOCATIONS } from "@/data/inventory-locations";

interface FilterBarProps {
  search: string;
  location: string;
  onSearchChange: (v: string) => void;
  onLocationChange: (v: string) => void;
}

export function FilterBar({
  search,
  location,
  onSearchChange,
  onLocationChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
          />
        </div>

        <div className="relative">
          <MapPin
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer text-black placeholder:text-gray-500"
          >
            <option value="all">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
