import { Loader2, Pencil, X } from "lucide-react";
import type { Product, ProductVariant } from "@/types/catalog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type EditVariantValues = {
  color: string;
  size: string;
  buyPrice: number;
  sellPrice: number;
  reorderPoint: number;
};

const editVariantSchema = z.object({
  color: z.string().trim().min(1, "Color is required"),
  size: z.string().trim().min(1, "Size is required"),
  buyPrice: z.number().min(0, "Buy price cannot be negative"),
  sellPrice: z.number().min(0, "Sell price cannot be negative"),
  reorderPoint: z.number().int().min(0, "Reorder point cannot be negative"),
});

interface Props {
  variant: ProductVariant;
  product: Product;
  isOpen: boolean;
  isSaving?: boolean;
  onSave: (data: EditVariantValues) => void | Promise<void>;
  onClose: () => void;
}

export default function EditModal({
  isOpen,
  onClose,
  variant,
  product,
  isSaving = false,
  onSave,
}: Props) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<EditVariantValues>({
    resolver: zodResolver(editVariantSchema),
    defaultValues: {
      color: variant.color,
      size: variant.size,
      buyPrice: variant.buyPrice,
      sellPrice: variant.sellPrice,
      reorderPoint: variant.inventory.reorderPoint,
    },
  });

  const sizeOptions =
    product.category === "Footwear"
      ? Array.from({ length: 41 }, (_, i) => String(i + 10))
      : ["XS", "S", "M", "L", "XL", "XXL"];

  async function handleSave(values: EditVariantValues) {
    await onSave(values);
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
              disabled={isSaving}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <span className="font-mono text-base text-slate-500">
            {product?.name} – ({variant?.sku})
          </span>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Color
            </label>
            <input
              type="text"
              {...register("color")}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            />
            {errors.color ? (
              <p className="mt-1 text-xs text-red-500">{errors.color.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Size
            </label>
            <select
              {...register("size")}
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
                {...register("buyPrice", { valueAsNumber: true })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
              />
              {errors.buyPrice ? (
                <p className="mt-1 text-xs text-red-500">{errors.buyPrice.message}</p>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sell Price (KES)
              </label>
              <input
                type="number"
                {...register("sellPrice", { valueAsNumber: true })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
              />
              {errors.sellPrice ? (
                <p className="mt-1 text-xs text-red-500">{errors.sellPrice.message}</p>
              ) : null}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reorder Point
            </label>
            <input
              type="number"
              {...register("reorderPoint", { valueAsNumber: true })}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            />
            {errors.reorderPoint ? (
              <p className="mt-1 text-xs text-red-500">{errors.reorderPoint.message}</p>
            ) : null}
          </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 border border-slate-300 py-2.5 rounded-xl font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 transition-colors text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
