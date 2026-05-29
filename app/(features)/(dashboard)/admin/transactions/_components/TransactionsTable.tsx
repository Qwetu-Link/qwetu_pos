import { Banknote } from "lucide-react";
import {
  formatCurrency,
  formatDate,
} from "../../../../../../data/transaction-data";
import type { Transaction } from "../../../../../../data/transaction-data";
import TransactionStatusBadge from "./TransactionStatusBadge";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="py-3">Transaction</th>
            <th className="py-3">Date</th>
            <th className="py-3">Customer</th>
            <th className="py-3">Type</th>
            <th className="py-3">Method</th>
            <th className="py-3 text-right">Amount</th>
            <th className="py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="py-4">
                <p className="font-semibold text-slate-900">{transaction.id}</p>
                <p className="text-xs text-slate-500">
                  {transaction.reference}
                </p>
              </td>
              <td className="py-4 text-slate-600">
                {formatDate(transaction.date)}
              </td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                    {getInitials(transaction.customer)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {transaction.customer}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {transaction.customerPhone}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-4 capitalize text-slate-600">
                {transaction.type}
              </td>
              <td className="py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  <Banknote className="h-3.5 w-3.5" />
                  {transaction.method}
                </span>
              </td>
              <td
                className={`py-4 text-right font-semibold ${
                  transaction.amount < 0 ? "text-red-600" : "text-slate-900"
                }`}
              >
                {formatCurrency(transaction.amount)}
              </td>
              <td className="py-4 text-right">
                <TransactionStatusBadge status={transaction.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
