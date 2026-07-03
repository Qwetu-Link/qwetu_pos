"use client";

import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import {
  ArrowLeft,
  Coins,
  Download,
  ReceiptText,
  Search,
} from "./icons";
import {
  formatCurrency,
  formatDate,
  getInstallmentSchedule,
  getPaidAmount,
  getPlanReceipts,
  getPlanStatus,
  getRemainingAmount,
  PaymentPlan,
} from "@/data/lipa-mdogo-data";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-800",
  overdue: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function LipaMdogoDetailPage({ plan }: { plan: PaymentPlan }) {
  const paid = getPaidAmount(plan.id);
  const remaining = getRemainingAmount(plan);
  const status = getPlanStatus(plan);
  const receipts = getPlanReceipts(plan.id);
  const schedule = getInstallmentSchedule(plan);

  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#1a1f2e]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/admin/mdogo"
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f0ede8] px-4 py-2 text-sm font-medium text-[#1a1f2e] transition hover:bg-[#e5e0d8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold text-black">
              <ReceiptText className="h-8 w-8 text-amber-600" />
              Lipa Mdogo Details
            </h1>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Download Full PDF
          </button>
        </div>

        <div className="flex flex-wrap items-stretch gap-4">
          <section className="min-w-[260px] flex-[1.4] overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_-12px_rgba(26,31,46,0.12)]">
            <div className="bg-amber-600 px-5 py-5 text-white">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.1em] opacity-70">
                    Lipa Mdogo
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                    INVOICE
                  </h2>
                  <div className="mt-1 font-mono text-sm opacity-85">
                    {plan.invoiceNo}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                  <div className="mt-2 text-xs opacity-75">
                    Issue: {formatDate(plan.startDate)}
                  </div>
                  <div className="text-xs opacity-75">Order: {plan.orderId}</div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wide opacity-60">
                    Bill To
                  </div>
                  <div className="text-base font-semibold">{plan.customer}</div>
                  <div className="text-sm opacity-80">{plan.phone}</div>
                  <div className="text-sm opacity-80">{plan.email}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide opacity-60">
                    Payment Method
                  </div>
                  <div className="text-base font-semibold">
                    {plan.paymentMethod}
                  </div>
                  <div className="text-sm opacity-80">
                    {plan.installments} installments
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="mb-6">
                <div className="mb-2 flex justify-between border-b border-slate-200 pb-2 text-xs uppercase tracking-wide text-slate-500">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                {plan.products.length === 0 ? (
                  <EmptyState
                    compact
                    icon={Search}
                    title="No products on this plan"
                    description="Line items connected to this installment plan will appear here when returned from the backend."
                  />
                ) : (
                  plan.products.map((product) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between border-b border-[#f3f0eb] py-2.5"
                    >
                      <div>
                        <div className="text-sm font-semibold">{product.name}</div>
                        <div className="text-xs text-slate-500">
                          Qty: {product.quantity} x{" "}
                          {formatCurrency(product.unitPrice)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatCurrency(product.total)}
                      </div>
                    </div>
                  ))
                )}
                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(plan.totalAmount)}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Installment plan · {plan.installments} months x{" "}
                  {formatCurrency(plan.installmentAmount)} monthly
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-800">
                  Payment Schedule
                </div>
                {schedule.length === 0 ? (
                  <EmptyState
                    compact
                    icon={Search}
                    title="No installment schedule"
                    description="Scheduled installment rows will appear when the payment plan has a valid start date and installment count."
                  />
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200">
                        {["#", "Due Date", "Amount", "Paid", "Balance", "Status", "Ref"].map(
                          (heading) => (
                            <th
                              key={heading}
                              className="py-2 pr-2 text-[10px] uppercase text-slate-400"
                            >
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((item) => (
                        <tr key={item.installmentNo} className="border-b border-slate-100">
                          <td className="py-2 text-xs">#{item.installmentNo}</td>
                          <td className="py-2 text-xs">
                            {formatDate(item.dueDate)}
                          </td>
                          <td className="py-2 text-xs font-medium">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="py-2 text-xs text-emerald-700">
                            {formatCurrency(item.paidAmount)}
                          </td>
                          <td
                            className={`py-2 text-xs ${
                              item.balance > 0 ? "text-red-600" : "text-emerald-700"
                            }`}
                          >
                            {formatCurrency(item.balance)}
                          </td>
                          <td className="py-2 text-xs font-medium capitalize">
                            {item.status}
                          </td>
                          <td className="py-2 font-mono text-[10px] text-slate-500">
                            {item.receipt?.ref || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                <SummaryMetric label="Total" value={formatCurrency(plan.totalAmount)} />
                <SummaryMetric
                  label="Paid"
                  value={formatCurrency(paid)}
                  valueClassName="text-emerald-700"
                />
                <SummaryMetric
                  label="Remaining"
                  value={formatCurrency(remaining)}
                  valueClassName={remaining > 0 ? "text-red-600" : "text-emerald-700"}
                />
              </div>
            </div>
          </section>

          <section className="min-w-[280px] flex-1 overflow-hidden rounded-xl border border-[#e5e0d8] bg-white shadow-[0_4px_12px_rgba(26,31,46,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-white px-4 py-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <ReceiptText className="h-5 w-5 text-emerald-600" />
                  Payment receipts
                </h2>
                <p className="text-xs text-slate-500">
                  Complete payment history
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
                <Coins className="mr-1 inline h-4 w-4" />
                {formatCurrency(paid)}
              </div>
            </div>

            {receipts.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse">
                  <thead>
                    <tr>
                      {["Receipt ID", "Date", "Amount", "Method", "Ref", "Note", "Download"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="bg-slate-50 p-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500"
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.map((receipt) => (
                      <tr
                        key={receipt.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-3 py-3 font-mono text-sm font-medium">
                          {receipt.id}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {formatDate(receipt.date)}
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-emerald-700">
                          {formatCurrency(receipt.amount)}
                        </td>
                        <td className="px-3 py-3 text-xs">
                          <span className="rounded-full bg-slate-100 px-2 py-1">
                            {receipt.method}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-500">
                          {receipt.ref}
                        </td>
                        <td className="max-w-[160px] truncate px-3 py-3 text-xs text-slate-500">
                          {receipt.note}
                        </td>
                        <td className="no-print px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e0d8] bg-white px-3 py-1.5 text-xs font-semibold transition hover:bg-[#f9f7f4]"
                          >
                            <Download className="h-3.5 w-3.5" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5">
                <EmptyState
                  compact
                  icon={Search}
                  title="No receipts recorded"
                  description="Payment receipts will appear here after installments are collected."
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryMetric({
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase text-slate-400">{label}</div>
      <div className={`text-lg font-bold ${valueClassName}`}>{value}</div>
    </div>
  );
}
