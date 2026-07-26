"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2, WalletCards } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  expenseCategoryValues,
  getExpenseCategoryLabel,
} from "@/data/expense-categories";
import { useCreateExpense } from "@/hooks/useExpenses";
import ExpenseField from "./ExpenseField";
import { expensePageSchema, type ExpensePageValues } from "./expense-form-schema";

export default function AddExpensePage() {
  const router = useRouter();
  const createExpense = useCreateExpense();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ExpensePageValues>({
    resolver: zodResolver(expensePageSchema),
    defaultValues: {
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

  async function submitExpense(values: ExpensePageValues) {
    await createExpense.mutateAsync({
      ...values,
      items: values.category === "inventory_purchase" ? values.items : undefined,
    });
    router.push("/admin/transactions/expenses");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/transactions/expenses"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Expenses
            </Link>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
              <WalletCards className="h-8 w-8 text-emerald-600" />
              Add Expense
            </h1>
            <p className="mt-1 text-slate-500">
              Record vendor details, expense items, and approval state.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(submitExpense)}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <section className="grid gap-4 border-b border-slate-200 p-5 md:grid-cols-2">
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
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Method</span>
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
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Status</span>
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
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Note</span>
              <textarea
                {...register("note")}
                rows={3}
                placeholder="Short expense description"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </section>

          {showExpenseItems ? (
          <section className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Expense Items</h2>
                <p className="text-sm text-slate-500">Break down this expense into individual costs.</p>
              </div>
              <button
                type="button"
                onClick={() => append({ name: "", quantity: 1, unitCost: 0 })}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_120px_160px_44px]"
                >
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
                    className="mt-7 inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Remove expense item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="ml-auto grid max-w-sm gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-600">Subtotal</span>
                <span className="text-sm font-bold text-slate-900">Ksh {total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <span className="text-lg font-extrabold text-slate-950">Ksh {total.toLocaleString()}</span>
              </div>
            </div>

            {createExpense.isError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {createExpense.error.message}
              </div>
            ) : null}
          </section>
          ) : (
          <section className="p-5">
            <div className="ml-auto grid max-w-sm gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-600">Subtotal</span>
                <span className="text-sm font-bold text-slate-900">Ksh {total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <span className="text-lg font-extrabold text-slate-950">Ksh {total.toLocaleString()}</span>
              </div>
            </div>
            {createExpense.isError ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {createExpense.error.message}
              </div>
            ) : null}
          </section>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-5">
            <Link
              href="/admin/transactions/expenses"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createExpense.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {createExpense.isPending ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
