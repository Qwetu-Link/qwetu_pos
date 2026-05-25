"use client";

import { useState } from "react";
import { Info, SlidersHorizontal, X } from "lucide-react";
import { LOCATIONS } from "@/types/inventory";
import type { InventoryItem, LocationName } from "@/types/inventory";

interface AdjustModalProps {
  item: InventoryItem;
  onClose: () => void;
  onConfirm: (sku: string, location: string, qty: number) => void;
}

export function AdjustModal({ item, onClose, onConfirm }: AdjustModalProps) {
  const [qty, setQty] = useState("");
  const [location, setLocation] = useState<LocationName>(LOCATIONS[0]);
  const [error, setError] = useState("");

  function handleConfirm() {
    const parsed = parseInt(qty, 10);
    if (isNaN(parsed) || parsed < 0) {
      setError("Please enter a valid non-negative quantity.");
      return;
    }

    onConfirm(item.sku, location, parsed);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <SlidersHorizontal size={18} className="text-emerald-600" />
            Adjust Stock
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">
              {item.productName}
            </span>
            {" - "}
            <span className="font-mono text-slate-500">{item.sku}</span>
          </p>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm text-amber-700 flex items-start gap-2">
            <Info size={15} className="mt-0.5 flex-shrink-0" />
            Set a new <strong>absolute</strong> stock quantity - this overwrites
            the current value.
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Stock Quantity
            </label>
            <input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setError("");
              }}
              placeholder="e.g. 24"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-black placeholder:text-gray-500"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as LocationName)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              Apply
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-slate-300 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
