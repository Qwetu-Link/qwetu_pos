import Link from "next/link";
import {
  formatCurrency,
  formatDate,
} from "@/data/transaction-data";
import EmptyState from "@/components/common/EmptyState";
import { SimpleDataTable } from "@/components/datatables";
import { Eye, Pencil, Trash2, WalletCards } from "lucide-react";
import type { Expense } from "@/types/admin/transactions";
import ExpenseStatusBadge from "./ExpenseStatusBadge";

export default function ExpensesTable({
  expenses,
  onDelete,
}: {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
}) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        compact
        icon={WalletCards}
        title="No expenses recorded"
        description="Business expenses will show here after they are added or returned from the backend."
      />
    );
  }

  return (
    <SimpleDataTable
      minWidth="min-w-[780px]"
      headers={[
        "Expense",
        "Date",
        "Category",
        "Vendor",
        "Method",
        { label: "Amount", className: "text-right" },
        { label: "Status", className: "text-right" },
        { label: "Actions", className: "text-right" },
      ]}
      rows={expenses.map((expense) => ({
        id: expense.id,
        cells: [
          <div key="expense">
            <p className="font-semibold text-slate-900">{expense.expenseNo}</p>
            <p className="text-xs text-slate-500">
              {expense.items.length} item{expense.items.length === 1 ? "" : "s"}
            </p>
          </div>,
          formatDate(expense.date),
          expense.category,
          expense.vendor,
          expense.method,
          <span key="amount" className="block text-right font-semibold text-slate-900">
            {formatCurrency(expense.amount)}
          </span>,
          <span key="status" className="block text-right">
            <ExpenseStatusBadge status={expense.status} />
          </span>,
          <div key="actions" className="inline-flex w-full items-center justify-end gap-2">
            <Link
              href={`/admin/transactions/expenses/${expense.id}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              aria-label={`View expense ${expense.expenseNo}`}
              title="View expense"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              href={`/admin/transactions/expenses/${expense.id}/edit`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              aria-label={`Edit expense ${expense.expenseNo}`}
              title="Edit expense"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDelete(expense)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              aria-label={`Delete expense ${expense.id}`}
              title="Delete expense"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>,
        ],
      }))}
    />
  );
}
