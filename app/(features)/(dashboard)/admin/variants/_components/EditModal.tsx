import { Pencil, X } from "lucide-react";
import { useState } from "react";
import type { Product, ProductVariant } from "@/types/catalog";

type EditVariantValues = {
  color: string;
  size: string;
  buyPrice: number;
  sellPrice: number;
  reorderPoint: number;
};

interface Props {
  variant: ProductVariant;
  product: Product;
  isOpen: boolean;
  onSave: (data: EditVariantValues) => void;
  onClose: () => void;
}

export default function EditModal({
  isOpen,
  onClose,
  variant,
  product,
  onSave,
}: Props) {
  const [color, setColor] = useState(variant.color);
  const [size, setSize] = useState(variant.size);
  const [buyPrice, setBuyPrice] = useState(String(variant.buyPrice));
  const [sellPrice, setSellPrice] = useState(String(variant.sellPrice));
  const [reorderPoint, setReorderPoint] = useState(
    String(variant.inventory.reorderPoint),
  );

  const sizeOptions =
    product.category === "Footwear"
      ? Array.from({ length: 41 }, (_, i) => String(i + 10))
      : ["XS", "S", "M", "L", "XL", "XXL"];

  function handleSave() {
    onSave({
      color,
      size,
      buyPrice: parseFloat(buyPrice),
      sellPrice: parseFloat(sellPrice),
      reorderPoint: parseInt(reorderPoint),
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="block items-center justify-between mb-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Pencil size={18} className="text-emerald-600" />
              Edit{" "}
            </h3>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <span className="font-mono text-base text-slate-500">
            {product?.name} – ({variant?.sku})
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black placeholder:text-gray-500"
            >
              {sizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Buy Price (KES)
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sell Price (KES)
              </label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reorder Point
            </label>
            <input
              type="number"
              value={reorderPoint}
              onChange={(e) => setReorderPoint(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition-colors"
          >
            Save Changes
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
  );
}
