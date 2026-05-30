"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Plus,
  Receipt,
  WalletCards,
  XCircle,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import {
  expenses,
  formatCurrency,
} from "@/data/transaction-data";
import type { Expense } from "@/types/transactions";
import AddExpenseModal from "./AddExpenseModal";
import ExpensesTable from "./ExpensesTable";
import TransactionStatCard from "./TransactionStatCard";

export default function ExpensesPage() {
  const expenseItems = expenses;
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const stats = useMemo(() => {
    const approvedTotal = expenseItems
      .filter((expense) => expense.status === "approved")
      .reduce((sum, expense) => sum + expense.amount, 0);
    const pendingTotal = expenseItems
      .filter((expense) => expense.status === "pending")
      .reduce((sum, expense) => sum + expense.amount, 0);
    const rejected = expenseItems.filter(
      (expense) => expense.status === "rejected",
    ).length;

    return { approvedTotal, pendingTotal, rejected };
  }, [expenseItems]);

  const totalPages = Math.max(1, Math.ceil(expenseItems.length / perPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedExpenses = expenseItems.slice(
    (visiblePage - 1) * perPage,
    visiblePage * perPage,
  );

  function addExpense(expense: Expense) {
    void expense;
    setCurrentPage(1);
  }

  function updatePerPage(value: number) {
    setPerPage(value);
    setCurrentPage(1);
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Link
                href="/admin/transactions"
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Transactions
              </Link>
              <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
                <WalletCards className="h-8 w-8 text-emerald-600" />
                Expenses
              </h1>
              <p className="mt-1 text-slate-500">
                Review business spending, approvals, and expense categories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpenseOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TransactionStatCard
              icon={WalletCards}
              label="Approved Spend"
              value={formatCurrency(stats.approvedTotal)}
              tone="text-emerald-600"
            />
            <TransactionStatCard
              icon={Clock3}
              label="Pending Spend"
              value={formatCurrency(stats.pendingTotal)}
              tone="text-amber-600"
            />
            <TransactionStatCard
              icon={Receipt}
              label="Expense Records"
              value={expenseItems.length}
              tone="text-blue-600"
            />
            <TransactionStatCard
              icon={XCircle}
              label="Rejected"
              value={stats.rejected}
              tone="text-red-600"
            />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Expense Register
                </h2>
                <p className="text-sm text-slate-500">
                  Operational expenses and approval state.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpenseOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </button>
            </div>

            <ExpensesTable expenses={paginatedExpenses} />
          </section>
          {expenseItems.length > 0 && (
            <Pagination
              currentPage={visiblePage}
              totalPages={totalPages}
              total={expenseItems.length}
              perPage={perPage}
              onPage={setCurrentPage}
              onPerPage={updatePerPage}
            />
          )}
        </div>
      </main>
      <AddExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onAddExpense={addExpense}
      />
    </>
  );
}
