import { Package, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getStatus } from "@/utils/variant-utils";
import type { InventoryItem } from "@/types/catalog";

type Props = {
  item: InventoryItem;
  onEdit: (variantId: string, productId: string) => void;
  onDelete: (variantId: string, sku: string) => void;
};

export default function VariantCard({ item, onEdit, onDelete }: Props) {
  const totalStock = item.inventory?.totalStock ?? 0;
  const reorderPoint = item.inventory?.reorderPoint ?? 0;
  const status = getStatus(totalStock, reorderPoint);

  const lastRestocked = item.inventory?.lastRestocked
    ? new Date(item.inventory.lastRestocked).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-xl text-slate-800">
            {item.productName}
            {item.color ? ` - ${item.color}` : ""}
            {item.size ? ` (${item.size})` : ""}
          </h3>

          <p className="text-sm text-slate-400 font-mono mt-0.5">
            SKU: {item.sku}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="space-y-3">
        <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
          <p className="text-sm text-slate-600 font-medium mb-1">
            <span className="inline-flex items-center justify-center gap-1.5">
              <Package size={15} /> Total Stock
            </span>
          </p>
          <p className="text-3xl font-extrabold text-emerald-800">
            {totalStock}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Reorder threshold: {reorderPoint}
          </p>
        </div>

        <div className="text-xs text-slate-400 text-center bg-slate-50 py-1.5 rounded-lg">
          Last restocked: {lastRestocked}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEdit(item.id, item.productId)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 font-medium"
          >
            <Pencil size={13} /> Edit
          </button>

          <button
            onClick={() => onDelete(item.id, item.sku)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
