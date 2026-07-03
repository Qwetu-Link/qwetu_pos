"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  HandCoins,
  MapPin,
  PackageOpen,
  PenLine,
  Receipt,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { initialOrders } from "@/data/orderData";
import { findOrderById, formatCurrency, formatDate } from "@/utils/orderUtils";
import type { Order, OrderStatus } from "@/types/customer";
import { ORDER_STATUS_CONFIG } from "@/data/customer-config";

const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const terminalStatuses: OrderStatus[] = ["delivered", "cancelled"];

const orderPaymentSchema = z.object({
  amount: z.number().positive("Please enter a valid payment amount"),
  paymentMethod: z.enum(["M-Pesa", "Airtel Money", "Bank Transfer", "Cash"]),
  reference: z.string().trim(),
});

type OrderPaymentFormValues = z.infer<typeof orderPaymentSchema>;

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const initialOrder = findOrderById(initialOrders, decodeURIComponent(params.id));
  const [order, setOrder] = useState<Order | null>(initialOrder ?? null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState<OrderStatus>(
    initialOrder?.status ?? "pending",
  );
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const {
    formState: { errors: paymentErrors },
    handleSubmit: handlePaymentSubmit,
    register: registerPayment,
    reset: resetPayment,
  } = useForm<OrderPaymentFormValues>({
    resolver: zodResolver(orderPaymentSchema),
    defaultValues: {
      amount: 1,
      paymentMethod: "M-Pesa",
      reference: "",
    },
  });

  const isLocked = order ? terminalStatuses.includes(order.status) : true;
  const canRecordPayment =
    !!order &&
    order.paymentType === "installment" &&
    order.remainingAmount > 0 &&
    !isLocked;

  const installmentSummary = useMemo(() => {
    if (!order || order.paymentType !== "installment") return null;

    const months = Number(order.installmentPlan?.match(/\d+/)?.[0] ?? 3);
    const installmentAmount = Math.ceil(order.total / months);
    const paidCount = Math.floor(order.amountPaid / installmentAmount);
    const partialPaid = order.amountPaid % installmentAmount;

    return {
      months,
      installmentAmount,
      paidCount,
      partialPaid,
      nextPaymentDate: addMonths(order.installmentStartDate ?? order.createdAt, Math.min(paidCount + 1, months)),
      progress: Math.min(100, Math.round((order.amountPaid / order.total) * 100)),
    };
  }, [order]);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  function updateStatus() {
    if (!order) return;
    setOrder({ ...order, status: draftStatus });
    setIsStatusOpen(false);
    showToast(`Order status updated to ${ORDER_STATUS_CONFIG[draftStatus].label}`);
  }

  function recordPayment(values: OrderPaymentFormValues) {
    if (!order) return;

    if (values.amount > order.remainingAmount) {
      showToast("Payment amount exceeds the remaining balance", "error");
      return;
    }

    const amountPaid = order.amountPaid + values.amount;
    const remainingAmount = Math.max(0, order.total - amountPaid);

    setOrder({
      ...order,
      amountPaid,
      remainingAmount,
      paymentStatus: remainingAmount === 0 ? "paid" : "partial",
    });
    setIsPaymentOpen(false);
    resetPayment();
    showToast(`Payment of ${formatCurrency(values.amount)} recorded`);
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <Receipt className="mx-auto mb-3 h-10 w-10 text-red-500" />
          <p className="font-semibold text-red-700">Order not found.</p>
          <Link
            href="/admin/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusCfg = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-5 md:px-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-extrabold text-black">
                  <Receipt className="h-7 w-7 text-emerald-600" />
                  Order Details
                </h1>
                <p className="mt-1 font-mono text-sm text-slate-500">Order #{order.id}</p>
              </div>
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.color}`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {statusCfg.label}
              </span>
            </div>
          </div>

          <div className="space-y-6 p-5 md:p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetaTile label="Order ID" value={order.id} mono />
              <MetaTile label="Date" value={formatDate(order.createdAt)} />
              <MetaTile label="Status" value={statusCfg.label} />
              <MetaTile
                label="Payment"
                value={order.paymentType === "installment" ? `Installment (${order.installmentPlan})` : "Full Payment"}
              />
              <MetaTile label="Amount Paid" value={formatCurrency(order.amountPaid)} />
              <MetaTile label="Balance" value={formatCurrency(order.remainingAmount)} danger={order.remainingAmount > 0} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <InfoPanel icon={User} title="Customer Information">
                <p className="font-semibold text-slate-800">{order.customer}</p>
                <p className="mt-1 text-sm text-slate-500">{order.email || "No email provided"}</p>
                <p className="text-sm text-slate-600">{order.phone || "No phone provided"}</p>
              </InfoPanel>
              <InfoPanel icon={CalendarDays} title="Order Information">
                <p className="text-sm text-slate-600">
                  <span className="text-slate-400">Created:</span> {formatDate(order.createdAt)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="text-slate-400">Total items:</span> {order.items}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="text-slate-400">Payment status:</span> {order.paymentStatus}
                </p>
                {order.installmentStartDate && (
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="text-slate-400">Installment start:</span> {formatDate(order.installmentStartDate)}
                  </p>
                )}
              </InfoPanel>
            </div>

            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <PackageOpen className="h-4 w-4 text-emerald-600" />
                Order Items
              </h2>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        {["Item", "SKU", "Qty", "Unit Price", "Subtotal"].map((heading) => (
                          <th key={heading} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.lineItems.map((item) => (
                        <tr key={`${item.sku}-${item.name}`} className="transition hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-400">{item.sku}</td>
                          <td className="px-4 py-3 text-slate-600">{item.qty}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.price < item.originalPrice ? (
                              <span>
                                <span className="mr-1 text-xs text-slate-400 line-through">
                                  {formatCurrency(item.originalPrice)}
                                </span>
                                <span className="font-semibold text-emerald-700">
                                  {formatCurrency(item.price)}
                                </span>
                              </span>
                            ) : (
                              formatCurrency(item.price)
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-emerald-700">
                            {formatCurrency(item.qty * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 bg-emerald-50">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right font-bold text-slate-700">
                          Total
                        </td>
                        <td className="px-4 py-3 text-base font-extrabold text-emerald-700">
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {installmentSummary ? (
              <section className="rounded-xl border border-purple-100 bg-purple-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      Lipa Mdogo Installment Plan
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.installmentPlan} plan, approximately {formatCurrency(installmentSummary.installmentAmount)} per installment.
                    </p>
                  </div>
                  <div className="text-sm md:text-right">
                    <p className="font-semibold text-emerald-700">{formatCurrency(order.amountPaid)} paid</p>
                    <p className="text-red-600">{formatCurrency(order.remainingAmount)} remaining</p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-purple-100">
                  <div
                    className="h-2 rounded-full bg-purple-600 transition-all"
                    style={{ width: `${installmentSummary.progress}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                  <SummaryPill label="Paid installments" value={`${installmentSummary.paidCount}/${installmentSummary.months}`} />
                  <SummaryPill label="Partial paid" value={formatCurrency(installmentSummary.partialPaid)} />
                  <SummaryPill label="Next due" value={formatDate(installmentSummary.nextPaymentDate)} />
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-600">
                <CreditCard className="mx-auto mb-2 h-5 w-5 text-slate-400" />
                Full payment order with no installment schedule.
              </section>
            )}

            {order.shippingAddress && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  Shipping Address
                </p>
                <p className="text-sm font-medium text-slate-700">{order.shippingAddress}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row md:px-6">
            <button
              type="button"
              onClick={() => {
                setDraftStatus(order.status);
                setIsStatusOpen(true);
              }}
              disabled={isLocked}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <PenLine className="h-4 w-4" />
              Update Status
            </button>
            <button
              type="button"
              onClick={() => setIsPaymentOpen(true)}
              disabled={!canRecordPayment}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <HandCoins className="h-4 w-4" />
              Record Payment
            </button>
          </div>
        </section>
      </div>

      {isStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <ModalHeader title="Update Order Status" onClose={() => setIsStatusOpen(false)} />
            <select
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value as OrderStatus)}
              className="mt-5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {ORDER_STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={updateStatus} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                Update
              </button>
              <button type="button" onClick={() => setIsStatusOpen(false)} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentOpen && installmentSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <ModalHeader title="Record Payment" onClose={() => setIsPaymentOpen(false)} />
            <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-800">{order.customer}</p>
              <p>Remaining: {formatCurrency(order.remainingAmount)}</p>
              <p>Suggested installment: {formatCurrency(Math.min(installmentSummary.installmentAmount, order.remainingAmount))}</p>
            </div>
            <form onSubmit={handlePaymentSubmit(recordPayment)} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Amount (KES)</span>
                <input
                  type="number"
                  min={1}
                  max={order.remainingAmount}
                  {...registerPayment("amount", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {paymentErrors.amount ? (
                  <span className="mt-1 block text-xs text-red-500">{paymentErrors.amount.message}</span>
                ) : null}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Payment Method</span>
                <select
                  {...registerPayment("paymentMethod")}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>M-Pesa</option>
                  <option>Airtel Money</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Reference</span>
                <input
                  type="text"
                  {...registerPayment("reference")}
                  placeholder="Transaction ID"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                  Record Payment
                </button>
                <button type="button" onClick={() => setIsPaymentOpen(false)} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

function MetaTile({
  label,
  value,
  mono = false,
  danger = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="mb-0.5 text-xs text-slate-400">{label}</p>
      <p className={`text-sm font-semibold ${mono ? "font-mono" : ""} ${danger ? "text-red-600" : "text-slate-800"}`}>
        {value}
      </p>
    </div>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-slate-50 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-emerald-600" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-purple-100 bg-white/70 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
        <Receipt className="h-5 w-5 text-emerald-600" />
        {title}
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function addMonths(date: string, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate.toISOString();
}
