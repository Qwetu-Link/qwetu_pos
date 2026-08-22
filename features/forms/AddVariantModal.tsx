"use client";

import { useState } from "react";
import { VariantFormValues, variantSchema } from "@/db/schema/validators/variant";
import { CLOTHING_SIZES } from "@/utils/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Puzzle } from "lucide-react";
import { useForm } from "react-hook-form";

interface Props {
  productName: string;
  onAdd: (values: VariantFormValues) => void;
  onClose: () => void;
}

export default function AddVariantModal({ productName, onAdd, onClose }: Props) {
  const romanSizes = CLOTHING_SIZES;
  const [sizeMode, setSizeMode] = useState<"roman" | "number" | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      color: "",
      size: "",
      buyPrice: 0,
      sellPrice: 0,
      mainStock: 0,
    },
  });

  function changeSizeMode(mode: "roman" | "number") {
    setSizeMode(mode);
    setValue("size", mode === "roman" ? romanSizes[0] : "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function submitVariant(values: VariantFormValues) {
    onAdd(values);
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

        <form onSubmit={handleSubmit(submitVariant)} className="space-y-4">
          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("color")}
              placeholder="e.g. Red, Navy Blue"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
            />
            {errors.color ? (
              <p className="mt-1 text-xs text-red-500">{errors.color.message}</p>
            ) : null}
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Size <span className="text-red-500">*</span>
            </label>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${sizeMode === "roman"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="sizeMode"
                  checked={sizeMode === "roman"}
                  onChange={() => changeSizeMode("roman")}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                Roman size
              </label>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${sizeMode === "number"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="sizeMode"
                  checked={sizeMode === "number"}
                  onChange={() => changeSizeMode("number")}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                Number size
              </label>
            </div>
            {sizeMode === null ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500">
                Choose a size type first.
              </div>
            ) : sizeMode === "roman" ? (
              <select
                {...register("size")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
              >
                {romanSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                {...register("size")}
                placeholder="e.g. 36, 40, 42"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
              />
            )}
            {errors.size ? (
              <p className="mt-1 text-xs text-red-500">{errors.size.message}</p>
            ) : null}
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
                {...register("buyPrice", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
              />
              {errors.buyPrice ? (
                <p className="mt-1 text-xs text-red-500">{errors.buyPrice.message}</p>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sell Price (KES) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                {...register("sellPrice", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
              />
              {errors.sellPrice ? (
                <p className="mt-1 text-xs text-red-500">{errors.sellPrice.message}</p>
              ) : null}
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
              {...register("mainStock", { valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
            />
            {errors.mainStock ? (
              <p className="mt-1 text-xs text-red-500">{errors.mainStock.message}</p>
            ) : null}
            <p className="text-xs text-gray-400 mt-1">
              Warehouse A and Outlet will be set to 0. Stock can be transferred later.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition"
            >
              Add Variant
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition  text-black"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
