"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import type { Expense, ExpenseStatus } from "../../../../../../data/transaction-data";
import ExpenseField from "./ExpenseField";

const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.string().trim().min(1, "Category is required"),
  vendor: z.string().trim().min(1, "Vendor is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  method: z.enum(["M-Pesa", "Cash", "Bank Transfer", "Card"]),
  status: z.enum(["pending", "approved", "rejected"]),
  note: z.string().trim(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

function createExpenseId() {
  return `EXP-${Date.now().toString().slice(-5)}`;
}

export default function AddExpenseModal({
  isOpen,
  onAddExpense,
  onClose,
}: {
  isOpen: boolean;
  onAddExpense: (expense: Expense) => void;
  onClose: () => void;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      category: "",
      vendor: "",
      amount: 0,
      method: "M-Pesa",
      status: "pending",
      note: "",
    },
  });

  if (!isOpen) {
    return null;
  }

  function submitExpense(values: ExpenseFormValues) {
    onAddExpense({
      id: createExpenseId(),
      date: values.date,
      category: values.category,
      vendor: values.vendor,
      method: values.method,
      amount: values.amount,
      status: values.status as ExpenseStatus,
      note: values.note,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Add Expense</h3>
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
          <ExpenseField label="Category" placeholder="e.g. Logistics" required error={errors.category?.message} {...register("category")} />
          <ExpenseField label="Vendor" placeholder="e.g. Rider Dispatch" required error={errors.vendor?.message} {...register("vendor")} />
          <ExpenseField label="Amount" type="number" placeholder="0" required error={errors.amount?.message} {...register("amount", { valueAsNumber: true })} />
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
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
