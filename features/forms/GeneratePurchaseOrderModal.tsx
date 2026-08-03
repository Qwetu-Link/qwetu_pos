"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { InventoryItem } from "@/types/inventory";

const purchaseOrderFormSchema = z.object({
  supplierName: z.string().trim().min(1, "Supplier is required"),
  quantity: z.number().int().min(1, "Quantity must be greater than zero"),
  notes: z.string().trim().max(1000, "Notes must be 1000 characters or fewer").optional(),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

function getRecommendedQuantity(item: InventoryItem) {
  const reorderPoint = Math.max(item.inventory.reorderPoint, 1);
  const totalStock = item.inventory.totalStock;
  const targetStock = reorderPoint * 2;

  return Math.max(targetStock - totalStock, reorderPoint - totalStock, 1);
}

export function GeneratePurchaseOrderModal({
  item,
  isCreating = false,
  onClose,
  onConfirm,
}: {
  item: InventoryItem;
  isCreating?: boolean;
  onClose: () => void;
  onConfirm: (variantId: string, supplierName: string, quantity: number, notes?: string) => Promise<void>;
}) {
  const recommendedQuantity = getRecommendedQuantity(item);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      supplierName: item.supplierName || "Unassigned supplier",
      quantity: recommendedQuantity,
      notes: `Restock ${item.productName} - ${item.color} ${item.size} (${item.sku}).`,
    },
  });

  async function handleCreate(values: PurchaseOrderFormValues) {
    await onConfirm(item.variantId, values.supplierName, values.quantity, values.notes);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <ShoppingCart size={19} className="text-amber-500" />
            Generate Purchase Order
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="text-slate-400 transition hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{item.productName}</p>
            <p className="mt-1 text-sm text-slate-500">
              {item.color} / {item.size} · SKU {item.sku}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Current stock</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{item.inventory.totalStock}</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Reorder point</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{item.inventory.reorderPoint}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Supplier</label>
            <input
              {...register("supplierName")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.supplierName ? (
              <p className="mt-1 text-xs text-red-500">{errors.supplierName.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Recommended order quantity</label>
            <input
              type="number"
              min={1}
              {...register("quantity", { valueAsNumber: true })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.quantity ? (
              <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Notes / Reference</label>
            <textarea
              rows={3}
              {...register("notes")}
              className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.notes ? (
              <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
            ) : null}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 rounded-xl border border-slate-300 py-2.5 font-medium text-black transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
            >
              {isCreating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Draft PO"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
