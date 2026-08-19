"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Pencil,
  ReceiptText,
  Store,
  WalletCards,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/data/transaction-data";
import { useGetExpense, useUpdateExpenseStatus } from "@/hooks/useExpenses";
import type { Expense, ExpenseStatus } from "@/types/admin/transactions";
import ExpenseStatusBadge from "./ExpenseStatusBadge";
import { ExpenseDetailSkeleton } from "@/components/skeletons";
import { SimpleDataTable } from "@/components/datatables";

const statusOptions: ExpenseStatus[] = ["pending", "approved", "rejected"];

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof WalletCards;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
          <p className="break-words text-lg font-extrabold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ExpenseStatusControl({ expense }: { expense: Expense }) {
  const updateStatus = useUpdateExpenseStatus();
  const [status, setStatus] = useState<ExpenseStatus>(expense.status);

  async function saveStatus() {
    if (status === expense.status) return;
    await updateStatus.mutateAsync({ id: expense.id, status });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        Status
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Change the approval state for this expense.
      </p>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as ExpenseStatus)}
        className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black focus:ring-2 focus:ring-emerald-500"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={saveStatus}
        disabled={updateStatus.isPending || status === expense.status}
        className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {updateStatus.isPending ? "Updating..." : "Update Status"}
      </button>
      {updateStatus.isError ? (
        <p className="mt-2 text-sm text-red-600">{updateStatus.error.message}</p>
      ) : null}
    </div>
  );
}

export default function ExpenseDetailPage({ expenseId }: { expenseId: string }) {
  const { expense, isLoading, isError, error } = useGetExpense(expenseId);

  const itemTotal = expense?.items.reduce((sum, item) => sum + item.total, 0) ?? 0;
  const hasItems = Boolean(expense?.items.length);

  if (isLoading) {
    return <ExpenseDetailSkeleton />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur sm:hidden">
        <div className="grid h-11 grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2">
          <Link
            href="/admin/transactions/expenses"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
            aria-label="Back to expenses"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-extrabold text-slate-950">
              {expense?.expenseNo ?? "Expense Details"}
            </p>
            <p className="truncate text-xs font-medium text-slate-500">
              {expense ? expense.vendor : "Expense details"}
            </p>
          </div>
          {expense ? (
            <Link
              href={`/admin/transactions/expenses/${expense.id}/edit`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700"
              aria-label={`Edit expense ${expense.expenseNo}`}
            >
              <Pencil className="h-5 w-5" />
            </Link>
          ) : (
            <span className="h-11 w-11" />
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1500px] space-y-5 px-3 py-5 sm:px-5 sm:py-6 lg:px-8">
        <Link
          href="/admin/transactions/expenses"
          className="hidden items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700 sm:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Expenses
        </Link>

        {isError || !expense ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error?.message ?? "Expense not found."}
          </div>
        ) : (
          <>
            <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <ReceiptText className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <h1 className="break-words text-2xl font-extrabold text-slate-950 sm:text-3xl">
                        {expense.expenseNo}
                      </h1>
                      <p className="break-words text-sm text-slate-500">
                        {expense.category} expense for {expense.vendor}
                      </p>
                    </div>
                    <ExpenseStatusBadge status={expense.status} />
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-slate-600">
                    {expense.note || "No note has been added for this expense."}
                  </p>
                </div>
                <div className="hidden w-full flex-wrap items-center gap-2 sm:flex sm:w-auto">
                  <Link
                    href={`/admin/transactions/expenses/${expense.id}/edit`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DetailTile icon={WalletCards} label="Amount" value={formatCurrency(expense.amount)} />
              <DetailTile icon={CalendarDays} label="Date" value={formatDate(expense.date)} />
              <DetailTile icon={CreditCard} label="Method" value={expense.method} />
              <DetailTile icon={Store} label="Vendor" value={expense.vendor} />
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
              <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-slate-900">Expense Items</h2>
                    <p className="text-sm text-slate-500">
                      {hasItems ? "Itemized purchase breakdown." : "Single amount expense."}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(hasItems ? itemTotal : expense.amount)}
                  </span>
                </div>

                {hasItems ? (
                  <>
                    <div className="hidden md:block">
                    <SimpleDataTable
                      minWidth="min-w-[620px]"
                      headers={[
                        "Item",
                        { label: "Qty", className: "text-right" },
                        { label: "Unit Cost", className: "text-right" },
                        { label: "Total", className: "text-right" },
                      ]}
                      rows={expense.items.map((item) => ({
                        id: item.id,
                        cells: [
                          <span key="name" className="font-semibold text-slate-900">{item.name}</span>,
                          <span key="qty" className="block text-right">{item.quantity}</span>,
                          <span key="unit" className="block text-right">{formatCurrency(item.unitCost)}</span>,
                          <span key="total" className="block text-right font-bold text-slate-900">{formatCurrency(item.total)}</span>,
                        ],
                      }))}
                    />
                  </div>
                    <div className="space-y-3 md:hidden">
                      {expense.items.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="min-w-0 break-words font-semibold text-slate-900">{item.name}</p>
                            <p className="shrink-0 text-sm font-bold text-slate-950">{formatCurrency(item.total)}</p>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="font-semibold text-slate-500">Qty</p>
                              <p className="font-bold text-slate-800">{item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-500">Unit Cost</p>
                              <p className="font-bold text-slate-800">{formatCurrency(item.unitCost)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">Recorded amount</p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-950">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                )}
              </div>

              <aside className="grid min-w-0 gap-5 md:grid-cols-2 xl:block xl:space-y-5">
                <ExpenseStatusControl
                  key={`${expense.id}-${expense.status}`}
                  expense={expense}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">Totals</h2>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-500">Subtotal</span>
                      <span className="font-bold text-slate-900">{formatCurrency(expense.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="font-bold text-slate-700">Total</span>
                      <span className="text-xl font-extrabold text-slate-950">{formatCurrency(expense.amount)}</span>
                    </div>
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
