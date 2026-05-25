"use client";

import { useState } from "react";
import { ArrowLeftRight, X } from "lucide-react";
import { LOCATIONS } from "@/types/inventory";
import type { InventoryItem, LocationName } from "@/types/inventory";

interface TransferModalProps {
  item: InventoryItem;
  onClose: () => void;
  onConfirm: (sku: string, from: string, to: string, qty: number) => boolean;
}

export function TransferModal({
  item,
  onClose,
  onConfirm,
}: TransferModalProps) {
  const [from, setFrom] = useState<LocationName>(LOCATIONS[0]);
  const [to, setTo] = useState<LocationName>(LOCATIONS[1]);
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");

  const fromLocationStock =
    item.inventory.locations.find((l) => l.name === from)?.stock ?? 0;

  function handleConfirm() {
    const parsed = parseInt(qty, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid positive quantity.");
      return;
    }
    if (from === to) {
      setError("Source and destination must be different.");
      return;
    }

    const success = onConfirm(item.sku, from, to, parsed);
    if (!success) {
      setError(`Insufficient stock at ${from}. Available: ${fromLocationStock}`);
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <ArrowLeftRight size={18} className="text-emerald-600" />
            Transfer Stock
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Location{" "}
              <span className="text-slate-400 font-normal">
                (available: {fromLocationStock})
              </span>
            </label>
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value as LocationName);
                setError("");
              }}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Location
            </label>
            <select
              value={to}
              onChange={(e) => {
                setTo(e.target.value as LocationName);
                setError("");
              }}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity to Transfer
            </label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setError("");
              }}
              placeholder="e.g. 10"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-black placeholder:text-gray-500"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftRight size={15} /> Transfer
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
