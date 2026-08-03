"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import {
  expenseCategoryValues,
  getExpenseCategoryLabel,
  normalizeExpenseCategory,
} from "@/data/expense-categories";
import type { Expense } from "@/types/transactions";
import ExpenseField from "./ExpenseField";

const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.enum(expenseCategoryValues),
  vendor: z.string().trim().min(1, "Vendor is required"),
  amount: z.number().int().min(0, "Amount cannot be negative").optional(),
  method: z.enum(["M-Pesa", "Cash", "Bank Transfer", "Card"]),
  status: z.enum(["pending", "approved", "rejected"]),
  note: z.string().trim(),
  items: z.array(z.object({
    name: z.string().trim(),
    quantity: z.number().int().min(0),
    unitCost: z.number().int().min(0),
  })).optional(),
}).superRefine((values, ctx) => {
  if (values.category === "inventory_purchase") {
    if (!values.items?.length) {
      ctx.addIssue({ code: "custom", message: "Add at least one expense item", path: ["items"] });
    }
    values.items?.forEach((item, index) => {
      if (!item.name) {
        ctx.addIssue({ code: "custom", message: "Item name is required", path: ["items", index, "name"] });
      }
      if (item.quantity < 1) {
        ctx.addIssue({ code: "custom", message: "Quantity must be at least 1", path: ["items", index, "quantity"] });
      }
      if (item.unitCost <= 0) {
        ctx.addIssue({ code: "custom", message: "Unit cost must be greater than zero", path: ["items", index, "unitCost"] });
      }
    });
    return;
  }

  if (!values.amount || values.amount <= 0) {
    ctx.addIssue({ code: "custom", message: "Amount must be greater than zero", path: ["amount"] });
  }
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function AddExpenseModal({
  expense,
  isOpen,
  isSaving = false,
  onAddExpense,
  onClose,
}: {
  expense?: Expense | null;
  isOpen: boolean;
  isSaving?: boolean;
  onAddExpense: (expense: ExpenseFormValues & { id?: string }) => void;
  onClose: () => void;
}) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    register,
    reset,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    values: expense
      ? {
        date: new Date(expense.date).toISOString().slice(0, 10),
        category: normalizeExpenseCategory(expense.category),
        vendor: expense.vendor,
        amount: expense.amount,
        method: expense.method as ExpenseFormValues["method"],
        status: expense.status,
        note: expense.note,
        items: expense.items.length
          ? expense.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitCost: item.unitCost,
          }))
          : [{ name: expense.note || expense.category, quantity: 1, unitCost: expense.amount }],
      }
      : {
        date: new Date().toISOString().slice(0, 10),
        category: "other",
        vendor: "",
        amount: 0,
        method: "M-Pesa",
        status: "pending",
        note: "",
        items: [{ name: "", quantity: 1, unitCost: 0 }],
      },
  });
  const { append, fields, remove } = useFieldArray({ control, name: "items" });
  const selectedCategory = useWatch({ control, name: "category" });
  const items = useWatch({ control, name: "items" }) ?? [];
  const amount = useWatch({ control, name: "amount" }) ?? 0;
  const showExpenseItems = selectedCategory === "inventory_purchase";
  const itemTotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0), 0);
  const total = showExpenseItems ? itemTotal : Number(amount) || 0;

  if (!isOpen) {
    return null;
  }

  function submitExpense(values: ExpenseFormValues) {
    onAddExpense({
      ...values,
      id: expense?.id,
      items: values.category === "inventory_purchase" ? values.items : undefined,
    });
    reset();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {expense ? "Edit Expense" : "Add Expense"}
            </h3>
            <p className="text-sm text-slate-500">
              Record an operational expense and approval state.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(submitExpense)} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <ExpenseField label="Date" type="date" required error={errors.date?.message} {...register("date")} />
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Category</span>
            <select
              {...register("category")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black focus:ring-2 focus:ring-emerald-500"
            >
              {expenseCategoryValues.map((category) => (
                <option key={category} value={category}>
                  {getExpenseCategoryLabel(category)}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
            ) : null}
          </label>
          <ExpenseField label="Vendor" placeholder="e.g. Rider Dispatch" required error={errors.vendor?.message} {...register("vendor")} />
          {!showExpenseItems ? (
            <ExpenseField
              label="Amount"
              type="number"
              placeholder="0"
              required
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />
          ) : null}
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Method
            </span>
            <select
              {...register("method")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black focus:ring-2 focus:ring-emerald-500"
            >
              <option>M-Pesa</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Card</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Status
            </span>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black focus:ring-2 focus:ring-emerald-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Note
            </span>
            <textarea
              {...register("note")}
              rows={3}
              placeholder="Short expense description"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
            />
          </label>
          {showExpenseItems ? (
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-slate-800">Expense Items</h4>
                <button
                  type="button"
                  onClick={() => append({ name: "", quantity: 1, unitCost: 0 })}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Add Item
                </button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_100px_140px_40px]">
                  <ExpenseField
                    label="Item"
                    placeholder="e.g. Delivery fuel"
                    error={errors.items?.[index]?.name?.message}
                    {...register(`items.${index}.name`)}
                  />
                  <ExpenseField
                    label="Qty"
                    type="number"
                    error={errors.items?.[index]?.quantity?.message}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  />
                  <ExpenseField
                    label="Unit Cost"
                    type="number"
                    error={errors.items?.[index]?.unitCost?.message}
                    {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
                  />
                  <button
                    type="button"
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length === 1}
                    className="mt-7 h-10 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Remove expense item"
                  >
                    X
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-600">Expense Total</span>
                <span className="text-lg font-extrabold text-slate-950">
                  Ksh {total.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 md:col-span-2">
              <span className="text-sm font-bold text-slate-600">Expense Total</span>
              <span className="text-lg font-extrabold text-slate-950">
                Ksh {total.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-black transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {isSaving ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
