import Link from "next/link";
import {
  formatCurrency,
  formatDate,
} from "@/data/transaction-data";
import EmptyState from "@/components/common/EmptyState";
import { Eye, Pencil, Trash2, WalletCards } from "lucide-react";
import type { Expense } from "@/types/transactions";
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="py-3">Expense</th>
            <th className="py-3">Date</th>
            <th className="py-3">Category</th>
            <th className="py-3">Vendor</th>
            <th className="py-3">Method</th>
            <th className="py-3 text-right">Amount</th>
            <th className="py-3 text-right">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="py-4">
                <p className="font-semibold text-slate-900">{expense.expenseNo}</p>
                <p className="text-xs text-slate-500">
                  {expense.items.length} item{expense.items.length === 1 ? "" : "s"}
                </p>
              </td>
              <td className="py-4 text-slate-600">
                {formatDate(expense.date)}
              </td>
              <td className="py-4 text-slate-700">{expense.category}</td>
              <td className="py-4 text-slate-700">{expense.vendor}</td>
              <td className="py-4 text-slate-600">{expense.method}</td>
              <td className="py-4 text-right font-semibold text-slate-900">
                {formatCurrency(expense.amount)}
              </td>
              <td className="py-4 text-right">
                <ExpenseStatusBadge status={expense.status} />
              </td>
              <td className="py-4 text-right">
                <div className="inline-flex items-center gap-2">
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
