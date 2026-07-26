"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import {
  ArrowLeft,
  Coins,
  Download,
  MoneyBill,
  ReceiptText,
  Search,
} from "./icons";
import {
  formatCurrency,
  formatDate,
  getInstallmentSchedule,
  getPlanPaidAmount,
  getPlanReceipts,
  getPlanStatus,
  getRemainingAmount,
  mapOrderToPaymentPlan,
  PaymentPlan,
} from "@/data/lipa-mdogo-data";
import { useGetOrders } from "@/hooks/useOrders";
import type { PlanProduct } from "@/types/lipa-mdogo";
import RecordPaymentModal from "./RecordPaymentModal";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-800",
  overdue: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function LipaMdogoDetailPage({ planId }: { planId: string }) {
  const { orders, isLoading, isError, error } = useGetOrders();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const paymentPlans = useMemo<PaymentPlan[]>(() => {
    return orders
      .map(mapOrderToPaymentPlan)
      .filter((plan): plan is PaymentPlan => Boolean(plan));
  }, [orders]);
  const plan = paymentPlans.find(
    (item) => item.id === planId || item.invoiceNo === planId,
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-950">
        <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading Lipa Mdogo details...
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-950">
        <div className="mx-auto max-w-7xl rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          {error?.message ?? "Could not load Lipa Mdogo details."}
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-950">
        <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white p-8 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <h1 className="text-lg font-bold text-slate-800">Plan not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            No live installment invoice matches {planId}.
          </p>
          <Link
            href="/admin/mdogo"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lipa Mdogo
          </Link>
        </div>
      </main>
    );
  }

  const paid = getPlanPaidAmount(plan);
  const remaining = getRemainingAmount(plan);
  const status = getPlanStatus(plan);
  const receipts = getPlanReceipts(plan);
  const schedule = getInstallmentSchedule(plan);
  const paymentRows = schedule.filter((item) => item.paidAmount > 0);
  const progress = plan.totalAmount > 0 ? Math.min(100, (paid / plan.totalAmount) * 100) : 0;
  const nextPayment = schedule.find((item) => item.status !== "paid");
  const paidInstallmentCount = receipts.length || paymentRows.length;
  const lastPaymentDate =
    receipts.at(-1)?.date ?? paymentRows.at(-1)?.dueDate ?? null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 lg:py-7">
        <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/admin/mdogo"
              className="mb-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-950 sm:gap-3 sm:text-3xl">
              <ReceiptText className="h-6 w-6 shrink-0 text-amber-600 sm:h-7 sm:w-7" />
              Lipa Mdogo Details
            </h1>
            <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
              {plan.invoiceNo} - {plan.customer} - {plan.orderId}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setIsPaymentOpen(true)}
              disabled={remaining <= 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              <MoneyBill className="h-4 w-4" />
              Record Payment
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-950 px-4 py-5 text-white sm:px-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase text-amber-300">
                  Installment Invoice
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h2 className="max-w-full break-all font-mono text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
                    {plan.invoiceNo}
                  </h2>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <InfoBlock label="Customer" value={plan.customer} />
                  <InfoBlock label="Phone" value={plan.phone || "-"} />
                  <InfoBlock label="Email" value={plan.email || "-"} />
                </div>
              </div>
              <div className="grid w-full gap-2 rounded-lg border border-white/10 bg-white/5 p-4 text-sm lg:w-auto lg:min-w-[260px]">
                <InfoLine label="Order" value={plan.orderId} />
                <InfoLine label="Issued" value={formatDate(plan.startDate)} />
                <InfoLine label="Frequency" value={plan.frequency} />
                <InfoLine label="Installments" value={String(plan.installments)} />
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5 p-4 sm:space-y-6 sm:p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SummaryTile label="Total" value={formatCurrency(plan.totalAmount)} />
                <SummaryTile label="Paid" value={formatCurrency(paid)} tone="text-emerald-700" />
                <SummaryTile
                  label="Remaining"
                  value={formatCurrency(remaining)}
                  tone={remaining > 0 ? "text-red-600" : "text-emerald-700"}
                />
                <SummaryTile
                  label="Next Due"
                  value={nextPayment ? formatDate(nextPayment.dueDate) : "Complete"}
                />
              </div>

              <div className="rounded-lg border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">Invoice Items</h3>
                    <p className="text-xs text-slate-500">
                      {plan.products.length} line item{plan.products.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    Monthly installment
                    <div className="text-sm font-bold text-slate-900">
                      {formatCurrency(plan.installmentAmount)}
                    </div>
                  </div>
                </div>
                {plan.products.length === 0 ? (
                  <div className="p-4">
                    <EmptyState
                      compact
                      icon={Search}
                      title="No products on this plan"
                      description="Line items connected to this installment plan will appear here when returned from the backend."
                    />
                  </div>
                ) : (
                  <>
                  <div className="space-y-3 p-3 sm:hidden">
                    {plan.products.map((product) => (
                      <InvoiceItemCard key={product.name} product={product} />
                    ))}
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-slate-900">Invoice Total</span>
                        <span className="text-base font-extrabold text-slate-950">
                          {formatCurrency(plan.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-[520px] border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                          <th className="px-4 py-3">Item</th>
                          <th className="px-4 py-3 text-right">Qty</th>
                          <th className="px-4 py-3 text-right">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plan.products.map((product) => (
                          <tr key={product.name} className="border-t border-slate-100">
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-slate-600">
                              {product.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-slate-600">
                              <PlanProductPrice product={product} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="border-t border-slate-200 bg-slate-50 p-4">
                      <div className="ml-auto grid max-w-sm gap-2 rounded-lg border border-slate-200 bg-white p-4">
                        <SummaryAmount label="Subtotal" value={formatCurrency(plan.totalAmount)} />
                        <SummaryAmount label="Total" value={formatCurrency(plan.totalAmount)} strong />
                      </div>
                    </div>
                  </div>
                  </>
                )}
              </div>

              <div className="rounded-lg border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">Payment Schedule</h3>
                    <p className="text-xs text-slate-500">
                      {plan.installments} installments - {progress.toFixed(0)}% paid
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:w-40">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {schedule.length === 0 ? (
                  <div className="p-4">
                    <EmptyState
                      compact
                      icon={Search}
                      title="No installment schedule"
                      description="Scheduled installment rows will appear when the payment plan has a valid start date and installment count."
                    />
                  </div>
                ) : (
                  <>
                  <div className="space-y-3 p-3 sm:hidden">
                    {schedule.map((item) => (
                      <ScheduleCard key={item.installmentNo} item={item} />
                    ))}
                  </div>
                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                          {["#", "Due Date", "Amount", "Paid", "Balance", "Status", "Ref"].map(
                            (heading) => (
                              <th key={heading} className="px-4 py-3">
                                {heading}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((item) => (
                          <tr key={item.installmentNo} className="border-t border-slate-100">
                            <td className="px-4 py-3 text-xs font-bold text-slate-500">
                              #{item.installmentNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {formatDate(item.dueDate)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-emerald-700">
                              {formatCurrency(item.paidAmount)}
                            </td>
                            <td
                              className={`px-4 py-3 text-sm font-semibold ${
                                item.balance > 0 ? "text-red-600" : "text-emerald-700"
                              }`}
                            >
                              {formatCurrency(item.balance)}
                            </td>
                            <td className="px-4 py-3">
                              <ScheduleStatus status={item.status} />
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                              {item.receipt?.ref || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </>
                )}
              </div>

              <section className="overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm">
                <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="flex items-center gap-2 font-bold text-slate-950">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                          <ReceiptText className="h-5 w-5" />
                        </span>
                        Paid installments
                      </h3>
                      <p className="mt-1 text-xs text-emerald-800">
                        {paidInstallmentCount} payment{paidInstallmentCount === 1 ? "" : "s"} collected
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase text-emerald-700">
                        Collected
                      </div>
                      <div className="text-lg font-extrabold text-emerald-800">
                        {formatCurrency(paid)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <LedgerMetric label="Last payment" value={lastPaymentDate ? formatDate(lastPaymentDate) : "-"} />
                    <LedgerMetric label="Progress" value={`${progress.toFixed(0)}%`} />
                  </div>
                </div>

                {receipts.length || paymentRows.length ? (
                  <>
                  <div className="max-h-[420px] space-y-3 overflow-auto bg-slate-50 p-3 sm:hidden">
                    {receipts.length
                      ? receipts.map((receipt) => (
                          <PaymentCard
                            key={receipt.id}
                            id={receipt.id}
                            date={receipt.date}
                            amount={receipt.amount}
                            method={receipt.method}
                            reference={receipt.ref}
                          />
                        ))
                      : paymentRows.map((payment) => (
                          <PaymentCard
                            key={payment.installmentNo}
                            id={`${plan.invoiceNo}-${payment.installmentNo}`}
                            date={payment.dueDate}
                            amount={payment.paidAmount}
                            method={plan.paymentMethod}
                            reference="-"
                          />
                        ))}
                  </div>
                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-[760px] border-collapse">
                      <thead>
                        <tr>
                          {["Payment", "Date", "Amount", "Method", "Ref", "Download"].map((heading) => (
                            <th
                              key={heading}
                              className="bg-slate-50 p-3 text-left text-[10px] font-bold uppercase text-slate-500"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {receipts.length
                          ? receipts.map((receipt) => (
                              <PaymentRow
                                key={receipt.id}
                                id={receipt.id}
                                date={receipt.date}
                                amount={receipt.amount}
                                method={receipt.method}
                                reference={receipt.ref}
                              />
                            ))
                          : paymentRows.map((payment) => (
                              <PaymentRow
                                key={payment.installmentNo}
                                id={`${plan.invoiceNo}-${payment.installmentNo}`}
                                date={payment.dueDate}
                                amount={payment.paidAmount}
                                method={plan.paymentMethod}
                                reference="-"
                              />
                            ))}
                      </tbody>
                    </table>
                  </div>
                  </>
                ) : (
                  <div className="p-5">
                    <EmptyState
                      compact
                      icon={Search}
                      title="No payments recorded"
                      description="Payments will appear here after installments are collected."
                    />
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-4 border-t border-slate-200 bg-slate-50 p-4 sm:space-y-5 sm:p-5 lg:border-l lg:border-t-0">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">Balance</h3>
                    <p className="text-xs text-slate-500">Collection status</p>
                  </div>
                  <Coins className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="break-words text-2xl font-extrabold text-slate-950 sm:text-3xl">
                  {formatCurrency(remaining)}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>{formatCurrency(paid)} paid</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
      <RecordPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        plan={plan}
      />
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-semibold uppercase text-slate-400">{label}</div>
      <div className="truncate font-medium text-white">{value}</div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone = "text-slate-950",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="text-[10px] font-bold uppercase text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-extrabold ${tone}`}>{value}</div>
    </div>
  );
}

function ScheduleStatus({ status }: { status: string }) {
  const className =
    status === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : status === "overdue"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${className}`}>
      {status}
    </span>
  );
}

function LedgerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white px-3 py-2">
      <div className="text-[10px] font-bold uppercase text-slate-500">{label}</div>
      <div className="mt-0.5 truncate text-xs font-extrabold text-slate-900">
        {value}
      </div>
    </div>
  );
}

function InvoiceItemCard({ product }: { product: PlanProduct }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-sm font-bold text-slate-900">{product.name}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <MobileMetric label="Qty" value={String(product.quantity)} />
        <div className="min-w-0 rounded-md bg-slate-50 p-2">
          <div className="text-[10px] font-bold uppercase text-slate-500">Unit</div>
          <div className="mt-1">
            <PlanProductPrice product={product} />
          </div>
        </div>
        <MobileMetric label="Total" value={formatCurrency(product.total)} strong />
      </div>
    </div>
  );
}

function PlanProductPrice({ product }: { product: PlanProduct }) {
  if (product.originalPrice && product.unitPrice < product.originalPrice) {
    return (
      <span className="inline-flex flex-col items-end gap-0.5">
        <span className="text-xs text-slate-400 line-through">
          {formatCurrency(product.originalPrice)}
        </span>
        <span className="font-semibold text-emerald-700">
          {formatCurrency(product.unitPrice)}
        </span>
      </span>
    );
  }

  return <span>{formatCurrency(product.unitPrice)}</span>;
}

function SummaryAmount({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className={`${strong ? "text-lg font-extrabold text-slate-950" : "text-sm font-bold text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}

function ScheduleCard({
  item,
}: {
  item: ReturnType<typeof getInstallmentSchedule>[number];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500">
            Installment #{item.installmentNo}
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {formatDate(item.dueDate)}
          </div>
        </div>
        <ScheduleStatus status={item.status} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <MobileMetric label="Amount" value={formatCurrency(item.amount)} />
        <MobileMetric label="Paid" value={formatCurrency(item.paidAmount)} strong />
        <MobileMetric
          label="Balance"
          value={formatCurrency(item.balance)}
          tone={item.balance > 0 ? "text-red-600" : "text-emerald-700"}
          strong
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-xs">
        <span className="font-medium text-slate-500">Ref</span>
        <span className="max-w-[70%] truncate font-mono text-slate-700">
          {item.receipt?.ref || "-"}
        </span>
      </div>
    </div>
  );
}

function PaymentCard({
  id,
  date,
  amount,
  method,
  reference,
}: {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Coins className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-mono text-xs font-bold text-slate-800">
              {id}
            </div>
            <div className="mt-1 text-xs text-slate-500">{formatDate(date)}</div>
          </div>
        </div>
        <div className="text-right text-sm font-extrabold text-emerald-700">
          {formatCurrency(amount)}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">
          {method}
        </span>
        <span className="max-w-[50%] truncate font-mono text-slate-500">
          {reference}
        </span>
      </div>
    </div>
  );
}

function MobileMetric({
  label,
  value,
  tone = "text-slate-900",
  strong = false,
}: {
  label: string;
  value: string;
  tone?: string;
  strong?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-md bg-slate-50 p-2">
      <div className="text-[10px] font-bold uppercase text-slate-500">{label}</div>
      <div className={`mt-1 truncate ${strong ? "font-extrabold" : "font-semibold"} ${tone}`}>
        {value}
      </div>
    </div>
  );
}

function PaymentRow({
  id,
  date,
  amount,
  method,
  reference,
}: {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-emerald-50/50">
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Coins className="h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-xs font-bold text-slate-800">{id}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-slate-600">{formatDate(date)}</td>
      <td className="px-3 py-3 text-xs font-bold text-emerald-700">
        {formatCurrency(amount)}
      </td>
      <td className="px-3 py-3 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">{method}</span>
      </td>
      <td className="px-3 py-3 font-mono text-xs text-slate-500">{reference}</td>
      <td className="px-3 py-3">
        <button
          type="button"
          aria-label={`Download payment ${id}`}
          title="Download payment"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Download className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
