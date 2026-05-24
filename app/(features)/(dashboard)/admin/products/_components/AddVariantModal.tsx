"use client";

import { NewVariantFormValues, ProductCategory } from "@/types/catalog";
import { Puzzle } from "lucide-react";
import { useState } from "react";

interface Props {
  productName: string;
  category: ProductCategory;
  onAdd: (values: NewVariantFormValues) => void;
  onClose: () => void;
}

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const FOOTWEAR_SIZES = Array.from({ length: 13 }, (_, i) => String(i + 36));

export default function AddVariantModal({ productName, category, onAdd, onClose }: Props) {
  const isFootwear = category === "Footwear";
  const sizes = isFootwear ? FOOTWEAR_SIZES : CLOTHING_SIZES;

  const [form, setForm] = useState<NewVariantFormValues>({
    color: "",
    size: sizes[0],
    buyPrice: 0,
    sellPrice: 0,
    mainStock: 0,
  });

  function handleSubmit() {
    if (!form.color.trim()) return alert("Color is required");
    if (!form.size) return alert("Size is required");
    onAdd(form);
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <h3 className="text-xl text-black font-bold mb-1 flex items-center gap-2">
          <Puzzle size={18} /> Add New Variant
        </h3>
        <p className="text-md text-gray-500 mb-5">For: <span className="font-medium text-gray-700">{productName}</span></p>

        <div className="space-y-4">
          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              placeholder="e.g. Red, Navy Blue"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
            />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Size <span className="text-red-500">*</span>
            </label>
            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Buy Price (KES) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={form.buyPrice}
                onChange={(e) => setForm({ ...form, buyPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sell Price (KES) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={form.sellPrice}
                onChange={(e) => setForm({ ...form, sellPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Main Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Initial Stock (Main Store) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={form.mainStock}
              onChange={(e) => setForm({ ...form, mainStock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Warehouse A and Outlet will be set to 0. Stock can be transferred later.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            Add Variant
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition  text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
