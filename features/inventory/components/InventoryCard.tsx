import { MapPin, Package, ArrowLeftRight, SlidersHorizontal } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";
import { StatusBadge } from "./StatusBadge";

interface InventoryCardProps {
  item: InventoryItem;
  onAdjust: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
}

export function InventoryCard({ item, onAdjust, onTransfer }: InventoryCardProps) {
  const lastRestocked = item.inventory.lastRestocked
    ? new Date(item.inventory.lastRestocked).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex flex-col xl:flex-row gap-5">
        {/* LEFT: info + locations */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-xl text-slate-800">
                {item.productName}{" "}
                <span className="text-slate-500 font-normal">
                  — {item.color} ({item.size})
                </span>
              </h3>
              <p className="text-sm text-slate-400 font-mono mt-0.5">
                SKU: {item.sku}
              </p>
            </div>
            <StatusBadge status={item.inventory.status} />
          </div>

          {/* Location breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {item.inventory.locations.map((loc) => {
              const isBelowReorder = loc.stock <= loc.reorderPoint;
              return (
                <div
                  key={loc.name}
                  className={`p-3 rounded-xl border ${
                    isBelowReorder
                      ? "bg-amber-50 border-amber-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin size={12} className="text-slate-500 flex-shrink-0" />
                    <p className="text-sm font-semibold text-slate-700">
                      {loc.name}
                    </p>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-2xl font-bold ${
                        isBelowReorder ? "text-amber-700" : "text-slate-800"
                      }`}
                    >
                      {loc.stock}
                    </span>
                    <span className="text-xs text-slate-400">
                      min: {loc.reorderPoint}
                    </span>
                  </div>
                  {isBelowReorder && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      ⚠️ Below reorder point
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: totals + actions */}
        <div className="xl:w-56 space-y-3">
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <div className="flex items-center justify-center gap-1.5 text-slate-600 mb-1">
              <Package size={14} />
              <p className="text-sm font-medium">Total Stock</p>
            </div>
            <p className="text-3xl font-extrabold text-emerald-800">
              {item.inventory.totalStock}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Reorder threshold: {item.inventory.reorderPoint}
            </p>
          </div>

          <div className="text-xs text-slate-400 text-center bg-slate-50 py-1.5 rounded-lg">
            Last restocked: {lastRestocked}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onAdjust(item)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-slate-300 rounded-xl hover:bg-slate-50 font-medium transition-colors text-slate-700"
            >
              <SlidersHorizontal size={13} /> Adjust
            </button>
            <button
              onClick={() => onTransfer(item)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
            >
              <ArrowLeftRight size={13} /> Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
