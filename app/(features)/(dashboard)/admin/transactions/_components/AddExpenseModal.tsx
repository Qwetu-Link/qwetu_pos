"use client";

import type { FormEvent } from "react";
import { Plus, X } from "lucide-react";
import type { Expense, ExpenseStatus } from "../../../../../../data/transaction-data";
import ExpenseField from "./ExpenseField";

export default function AddExpenseModal({
  isOpen,
  onAddExpense,
  onClose,
}: {
  isOpen: boolean;
  onAddExpense: (expense: Expense) => void;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  function submitExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = Number(formData.get("amount") || 0);
    const status = String(formData.get("status") || "pending") as ExpenseStatus;

    onAddExpense({
      id: `EXP-${Date.now().toString().slice(-5)}`,
      date: String(formData.get("date") || new Date().toISOString().slice(0, 10)),
      category: String(formData.get("category") || ""),
      vendor: String(formData.get("vendor") || ""),
      method: String(formData.get("method") || "M-Pesa"),
      amount,
      status,
      note: String(formData.get("note") || ""),
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
        <form onSubmit={submitExpense} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <ExpenseField label="Date" name="date" type="date" required />
          <ExpenseField label="Category" name="category" placeholder="e.g. Logistics" required />
          <ExpenseField label="Vendor" name="vendor" placeholder="e.g. Rider Dispatch" required />
          <ExpenseField label="Amount" name="amount" type="number" placeholder="0" required />
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Method
            </span>
            <select
              name="method"
              defaultValue="M-Pesa"
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
              name="status"
              defaultValue="pending"
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
              name="note"
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
