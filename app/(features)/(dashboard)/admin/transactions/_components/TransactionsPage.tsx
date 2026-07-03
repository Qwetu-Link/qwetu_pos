"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  ReceiptText,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import {
  formatCurrency,
  transactions,
} from "@/data/transaction-data";
import TransactionStatCard from "./TransactionStatCard";
import TransactionsTable from "./TransactionsTable";

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const stats = useMemo(() => {
    const income = transactions
      .filter((item) => item.amount > 0 && item.status === "completed")
      .reduce((sum, item) => sum + item.amount, 0);
    const pending = transactions.filter((item) => item.status === "pending").length;
    const failed = transactions.filter((item) => item.status === "failed").length;

    return { income, pending, failed };
  }, []);

  const totalPages = Math.max(1, Math.ceil(transactions.length / perPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = transactions.slice(
    (visiblePage - 1) * perPage,
    visiblePage * perPage,
  );

  function updatePerPage(value: number) {
    setPerPage(value);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
              <ReceiptText className="h-8 w-8 text-emerald-600" />
              Transactions Hub
            </h1>
            <p className="mt-1 text-slate-500">
              Track sales, installment collections, refunds, and payment status.
            </p>
          </div>
          <Link
            href="/admin/transactions/expenses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Expenses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TransactionStatCard
            icon={TrendingUp}
            label="Completed Income"
            value={formatCurrency(stats.income)}
            tone="text-emerald-600"
          />
          <TransactionStatCard
            icon={ReceiptText}
            label="Transactions"
            value={transactions.length}
            tone="text-blue-600"
          />
          <TransactionStatCard
            icon={Clock3}
            label="Pending"
            value={stats.pending}
            tone="text-amber-600"
          />
          <TransactionStatCard
            icon={XCircle}
            label="Failed"
            value={stats.failed}
            tone="text-red-600"
          />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Transactions
              </h2>
              <p className="text-sm text-slate-500">
                Latest payment activity across all methods.
              </p>
            </div>
            <CreditCard className="h-5 w-5 text-slate-400" />
          </div>

          <TransactionsTable transactions={paginatedTransactions} />
        </section>
        {transactions.length > 0 && (
          <Pagination
            currentPage={visiblePage}
            totalPages={totalPages}
            total={transactions.length}
            perPage={perPage}
            onPage={setCurrentPage}
            onPerPage={updatePerPage}
          />
        )}
      </div>
    </main>
  );
}
