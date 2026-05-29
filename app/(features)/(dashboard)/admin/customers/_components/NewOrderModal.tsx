"use client";

import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { X, ShoppingCart, Plus, Trash2, Tag, Percent, Calculator, PackageSearch } from "lucide-react";
import type { Customer, OrderFormData, LineItem, PaymentType, OrderStatus } from "@/types/customer";
import { DEMO_VARIANTS } from "@/lib/customerUtils";

interface NewOrderModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: OrderFormData, lineItems: LineItem[]) => void;
}

interface LineItemRow {
  id: number;
  variantId: string;
  qty: number;
  originalPrice: number;
  discountPrice: string; // empty string = no discount
}

const newOrderSchema = z.object({
  paymentType: z.enum(["full", "installment"]),
  installmentPlan: z.string(),
  startDate: z.string(),
  amountPaid: z.number().min(0, "Amount paid cannot be negative"),
  status: z.enum(["pending", "processing", "shipped", "delivered"]),
});

type NewOrderFormValues = z.infer<typeof newOrderSchema>;

const INPUT = "w-full px-3 py-2.5 border border-slate-300 text-black placeholder:text-slate-400 transition rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";
const LABEL = "block text-xs font-semibold text-slate-600 mb-1.5";

let rowCounter = 0;
function newRow(): LineItemRow {
  return { id: ++rowCounter, variantId: "", qty: 1, originalPrice: 0, discountPrice: "" };
}

export function NewOrderModal({ customer, isOpen, onClose, onSubmit }: NewOrderModalProps) {
  const [rows, setRows] = useState<LineItemRow[]>([newRow()]);
  const [error, setError] = useState("");
  const {
    control,
    formState: { errors },
    handleSubmit: handleFormSubmit,
    register,
    reset,
  } = useForm<NewOrderFormValues>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      paymentType: "full",
      installmentPlan: "3 months",
      startDate: "",
      amountPaid: 0,
      status: "pending",
    },
  });
  const paymentType = useWatch({ control, name: "paymentType" });

  const getVariant = (id: string) => DEMO_VARIANTS.find((v) => v.variantId === id);

  const updateRow = useCallback((id: number, patch: Partial<LineItemRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const handleVariantChange = useCallback((rowId: number, variantId: string) => {
    const variant = getVariant(variantId);
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, variantId, originalPrice: variant?.sellPrice ?? 0, discountPrice: "" }
          : r
      )
    );
  }, []);

  const removeRow = (id: number) => {
    if (rows.length === 1) {
      setRows([newRow()]);
    } else {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const getEffectivePrice = (row: LineItemRow) => {
    const disc = parseFloat(row.discountPrice);
    return !isNaN(disc) && disc > 0 ? disc : row.originalPrice;
  };

  const orderTotal = rows.reduce((sum, r) => sum + r.qty * getEffectivePrice(r), 0);

  const handleClose = () => {
    setRows([newRow()]);
    reset();
    setError("");
    onClose();
  };

  const handleSubmit = (values: NewOrderFormValues) => {
    setError("");
    const validRows = rows.filter((r) => r.variantId && r.qty > 0 && getEffectivePrice(r) > 0);
    if (!validRows.length) {
      setError("Please add at least one valid product variant with a price.");
      return;
    }
    const lineItems: LineItem[] = validRows.map((r) => {
      const variant = getVariant(r.variantId)!;
      return {
        variantId: r.variantId,
        productId: variant.productId,
        sku: variant.sku,
        name: variant.name,
        qty: r.qty,
        price: getEffectivePrice(r),
        originalPrice: r.originalPrice,
      };
    });
    onSubmit(
      {
        paymentType: values.paymentType as PaymentType,
        amountPaid: values.amountPaid,
        installmentPlan: values.paymentType === "installment" ? values.installmentPlan : undefined,
        startDate: values.startDate || undefined,
        status: values.status as OrderStatus,
      },
      lineItems
    );
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 rounded-t-2xl flex justify-between items-center z-10">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <ShoppingCart size={18} className="text-emerald-600" />
            New Order ·{" "}
            <span className="text-emerald-700">{customer.name}</span>
          </h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit(handleSubmit)} className="p-6 space-y-6">
          {/* Payment + Status row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={LABEL}>Payment Type <span className="text-red-500">*</span></label>
              <select
                {...register("paymentType")}
                className={INPUT}
              >
                <option value="full">Full Payment</option>
                <option value="installment">Partial Payment (Installment)</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Order Status <span className="text-red-500">*</span></label>
              <select {...register("status")} className={INPUT}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {paymentType === "installment" && (
              <>
                <div>
                  <label className={LABEL}>Installment Plan</label>
                  <select {...register("installmentPlan")} className={INPUT}>
                    {["3 months", "6 months", "9 months", "12 months"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Start Date</label>
                  <input type="date" {...register("startDate")} className={INPUT} />
                </div>
              </>
            )}

            <div>
              <label className={LABEL}>Amount Paid Now (KES)</label>
              <input
                type="number" min={0}
                {...register("amountPaid", { valueAsNumber: true })}
                placeholder={paymentType === "full" ? "Auto-set to total" : "Deposit amount"}
                className={INPUT}
                readOnly={paymentType === "full"}
              />
              {errors.amountPaid ? (
                <p className="mt-1 text-xs text-red-500">{errors.amountPaid.message}</p>
              ) : null}
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-700">Order Items</label>
              <button
                type="button"
                onClick={() => setRows((prev) => [...prev, newRow()])}
                className="flex items-center gap-1.5 text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors font-medium"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {rows.map((row) => {
                const effPrice = getEffectivePrice(row);
                const subtotal = row.qty * effPrice;
                const discount = row.qty * Math.max(0, row.originalPrice - effPrice);

                return (
                  <div key={row.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-sm">
                    {/* Variant select */}
                    <div className="mb-3">
                      <label className={LABEL}>
                        <PackageSearch size={12} className="inline mr-1 text-emerald-600" />
                        Product Variant
                      </label>
                      <select
                        value={row.variantId}
                        onChange={(e) => handleVariantChange(row.id, e.target.value)}
                        className={INPUT}
                      >
                        <option value="">Select product variant...</option>
                        {DEMO_VARIANTS.map((v) => (
                          <option key={v.variantId} value={v.variantId}>
                            {v.name} — KES {v.sellPrice.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Qty / Prices / Subtotal / Remove */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className={LABEL}>Qty</label>
                        <input
                          type="number" min={1} value={row.qty}
                          onChange={(e) => updateRow(row.id, { qty: parseInt(e.target.value) || 1 })}
                          className={INPUT}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>
                          <Tag size={11} className="inline mr-0.5 text-purple-600" />
                          Original Price
                        </label>
                        <input
                          type="number" min={0} value={row.originalPrice || ""}
                          onChange={(e) => updateRow(row.id, { originalPrice: parseFloat(e.target.value) || 0 })}
                          className={INPUT} placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className={LABEL}>
                          <Percent size={11} className="inline mr-0.5 text-orange-600" />
                          Discount Price
                        </label>
                        <input
                          type="number" min={0} value={row.discountPrice}
                          onChange={(e) => updateRow(row.id, { discountPrice: e.target.value })}
                          className={INPUT} placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className={LABEL}>
                          <Calculator size={11} className="inline mr-0.5 text-green-600" />
                          Subtotal
                        </label>
                        <div className="px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700 text-center">
                          KES {subtotal.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Per-row summary */}
                    {row.variantId && (
                      <div className="flex flex-wrap gap-4 mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-500">
                        <span>
                          Discount:{" "}
                          <span className="font-semibold text-orange-600">
                            KES {discount.toLocaleString()}
                          </span>
                        </span>
                        <span>
                          Final Price:{" "}
                          <span className="font-semibold text-emerald-700">
                            KES {(row.qty * effPrice).toLocaleString()}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order total */}
            <div className="mt-4 text-right">
              <span className="text-slate-700 font-semibold">Order Total: </span>
              <span className="text-emerald-700 text-2xl font-extrabold">
                KES {orderTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              type="button" onClick={handleClose}
              className="px-6 py-2.5 border border-slate-300 text-black rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <ShoppingCart size={15} /> Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
