"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ArrowLeftRight, Loader2, X } from "lucide-react";
import { LOCATIONS } from "@/data/inventory-locations";
import type { InventoryItem } from "@/types/inventory";

interface TransferModalProps {
  item: InventoryItem;
  isTransferring?: boolean;
  onClose: () => void;
  onConfirm: (variantId: string, from: string, to: string, qty: number) => Promise<boolean>;
}

const transferStockSchema = z.object({
  from: z.enum(LOCATIONS),
  to: z.enum(LOCATIONS),
  qty: z.number().int().min(1, "Please enter a valid positive quantity."),
}).refine((values) => values.from !== values.to, {
  message: "Source and destination must be different.",
  path: ["to"],
});

type TransferStockFormValues = z.infer<typeof transferStockSchema>;

export function TransferModal({
  item,
  isTransferring = false,
  onClose,
  onConfirm,
}: TransferModalProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<TransferStockFormValues>({
    resolver: zodResolver(transferStockSchema),
    defaultValues: {
      from: LOCATIONS[0],
      to: LOCATIONS[1],
      qty: 1,
    },
  });
  const from = useWatch({ control, name: "from" });

  const fromLocationStock =
    item.inventory.locations.find((l) => l.name === from)?.stock ?? 0;

  async function handleConfirm(values: TransferStockFormValues) {
    const success = await onConfirm(item.variantId, values.from, values.to, values.qty);
    if (!success) {
      setError("qty", {
        message: `Insufficient stock at ${values.from}. Available: ${fromLocationStock}`,
      });
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
            disabled={isTransferring}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
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
              {...register("from")}
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
              {...register("to")}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder:text-gray-500"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              </select>
            {errors.to ? (
              <p className="text-red-500 text-xs mt-1">{errors.to.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity to Transfer
            </label>
            <input
              type="number"
              min={1}
              {...register("qty", { valueAsNumber: true })}
              placeholder="e.g. 10"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-black placeholder:text-gray-500"
            />
            {errors.qty && <p className="text-red-500 text-xs mt-1">{errors.qty.message}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isTransferring}
              className="flex-1 border border-slate-300 py-2.5 rounded-xl font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 transition-colors text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTransferring}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isTransferring ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <ArrowLeftRight size={15} /> Transfer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
