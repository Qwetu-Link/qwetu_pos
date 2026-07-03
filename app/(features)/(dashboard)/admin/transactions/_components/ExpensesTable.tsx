import {
  formatCurrency,
  formatDate,
} from "@/data/transaction-data";
import EmptyState from "@/components/common/EmptyState";
import { WalletCards } from "lucide-react";
import type { Expense } from "@/types/transactions";
import ExpenseStatusBadge from "./ExpenseStatusBadge";

export default function ExpensesTable({ expenses }: { expenses: Expense[] }) {
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
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="py-4">
                <p className="font-semibold text-slate-900">{expense.id}</p>
                <p className="text-xs text-slate-500">{expense.note}</p>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
