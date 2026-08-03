import EmptyState from "@/components/common/EmptyState";
import { SimpleDataTable } from "@/components/datatables";
import { Banknote, ReceiptText } from "lucide-react";
import {
  formatCurrency,
  formatDate,
} from "@/data/transaction-data";
import type { Transaction } from "@/types/transactions";
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
  if (transactions.length === 0) {
    return (
      <EmptyState
        compact
        icon={ReceiptText}
        title="No transactions yet"
        description="Sales, refunds, and installment payments will appear here once the backend returns transaction records."
      />
    );
  }

  return (
    <SimpleDataTable
      minWidth="min-w-[820px]"
      headers={[
        "Transaction",
        "Date",
        "Customer",
        "Type",
        "Method",
        { label: "Amount", className: "text-right" },
        { label: "Status", className: "text-right" },
      ]}
      rows={transactions.map((transaction) => ({
        id: transaction.id,
        cells: [
          <div key="transaction">
            <p className="font-semibold text-slate-900">{transaction.id}</p>
            <p className="text-xs text-slate-500">{transaction.reference}</p>
          </div>,
          formatDate(transaction.date),
          <div key="customer" className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
              {getInitials(transaction.customer)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{transaction.customer}</p>
              <p className="truncate text-xs text-slate-500">{transaction.customerPhone}</p>
            </div>
          </div>,
          <span key="type" className="capitalize">{transaction.type}</span>,
          <span key="method" className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <Banknote className="h-3.5 w-3.5" />
            {transaction.method}
          </span>,
          <span
            key="amount"
            className={`block text-right font-semibold ${
              transaction.amount < 0 ? "text-red-600" : "text-slate-900"
            }`}
          >
            {formatCurrency(transaction.amount)}
          </span>,
          <span key="status" className="block text-right">
            <TransactionStatusBadge status={transaction.status} />
          </span>,
        ],
      }))}
    />
  );
}
