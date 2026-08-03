"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  CreditCard,
  HandCoins,
  MapPin,
  PackageOpen,
  Route,
  ShieldCheck,
  PenLine,
  Receipt,
  Sparkles,
  Truck,
  User,
  X,
} from "lucide-react";
import { formatCurrency, formatDate, getOrderDisplayNumber } from "@/utils/orderUtils";
import type { LineItem, Order, OrderStatus } from "@/types/customer";
import { ORDER_STATUS_CONFIG } from "@/data/customer-config";
import { useGetOrder, useRecordOrderPayment, useUpdateOrderStatus } from "@/hooks/useOrders";
import { SimpleDataTable } from "@/components/datatables";
import StatusBadge from "./statusBadge";
import { OrderDetailSkeleton } from "@/components/skeletons";

const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const terminalStatuses: OrderStatus[] = ["delivered", "cancelled"];
const autoCancelMessage = "The order will be cancelled automatically after 48hrs if it remains unpaid.";
const openOrderStatuses = new Set<OrderStatus>(["pending", "processing"]);
const trackingStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

const orderPaymentSchema = z.object({
  amount: z.number().positive("Please enter a valid payment amount"),
  paymentMethod: z.enum(["M-Pesa", "Airtel Money", "Bank Transfer", "Cash"]),
  reference: z.string().trim(),
});

type OrderPaymentFormValues = z.infer<typeof orderPaymentSchema>;

function getInstallmentMonths(plan?: string) {
  const months = Number(plan?.match(/\d+/)?.[0] ?? 3);
  if (!Number.isFinite(months) || months < 1) return 1;
  return Math.min(12, Math.floor(months));
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = decodeURIComponent(params.id);
  const { order: fetchedOrder, isLoading, isError, error } = useGetOrder(orderId);
  const updateOrderStatus = useUpdateOrderStatus();
  const recordOrderPayment = useRecordOrderPayment();
  const [orderOverride, setOrderOverride] = useState<Order | null>(null);
  const order = orderOverride?.id === fetchedOrder?.id ? orderOverride : fetchedOrder;
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState<OrderStatus>("pending");
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
    !!order.invoice &&
    order.paymentType === "installment" &&
    order.remainingAmount > 0 &&
    !isLocked;

  const installmentSummary = useMemo(() => {
    if (!order || order.paymentType !== "installment") return null;

    const months = getInstallmentMonths(order.installmentPlan);
    const installmentAmount = Math.ceil(order.total / months);
    const paidCount = Math.floor(order.amountPaid / installmentAmount);
    const partialPaid = order.amountPaid % installmentAmount;

    return {
      months,
      installmentAmount,
      paidCount,
      partialPaid,
      nextPaymentDate: addMonths(order.installmentStartDate ?? order.createdAt, Math.min(paidCount + 1, months)),
      progress: order.total > 0 ? Math.min(100, Math.round((order.amountPaid / order.total) * 100)) : 0,
    };
  }, [order]);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  async function updateStatus() {
    if (!order) return;
    try {
      const updatedOrder = await updateOrderStatus.mutateAsync({
        id: order.id,
        status: draftStatus,
      });
      setOrderOverride(updatedOrder);
      setIsStatusOpen(false);
      showToast(`Order status updated to ${ORDER_STATUS_CONFIG[draftStatus].label}`);
    } catch {
      showToast("Could not update order status", "error");
    }
  }

  async function recordPayment(values: OrderPaymentFormValues) {
    if (!order) return;

    if (values.amount > order.remainingAmount) {
      showToast("Payment amount exceeds the remaining balance", "error");
      return;
    }

    if (!order.invoice) {
      showToast("This order does not have an invoice to receive payment against", "error");
      return;
    }

    try {
      const updatedOrder = await recordOrderPayment.mutateAsync({
        invoiceId: order.invoice.id,
        amount: values.amount,
        paymentDate: new Date().toISOString().slice(0, 10),
        paymentMethod: values.paymentMethod,
        reference: values.reference,
        note: "",
      });

      setOrderOverride(updatedOrder);
      setIsPaymentOpen(false);
      resetPayment();
      showToast(`Payment of ${formatCurrency(values.amount)} recorded`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not record payment", "error");
    }
  }

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order || isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <Receipt className="mx-auto mb-3 h-10 w-10 text-red-500" />
          <p className="font-semibold text-red-700">
            {error?.message ?? "Order not found."}
          </p>
          <Link
            href="/admin/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const paymentProgress = order.total > 0 ? Math.min(100, (order.amountPaid / order.total) * 100) : 0;
  const showAutoCancelMessage =
    openOrderStatuses.has(order.status) &&
    order.paymentStatus === "unpaid" &&
    order.amountPaid === 0;
  const trackingSummary = getTrackingSummary(order);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5 px-3 py-4 sm:px-6 lg:py-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/admin/orders"
              className="mb-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
            <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-950 sm:text-3xl">
              <Receipt className="h-6 w-6 shrink-0 text-emerald-600 sm:h-8 sm:w-8" />
              Order Details
            </h1>
            <p className="mt-1 break-words font-mono text-xs text-slate-500 sm:text-sm">
              {getOrderDisplayNumber(order)} - {order.customer}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.status} />
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-slate-600 ring-1 ring-slate-200">
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {showAutoCancelMessage ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm">
            {autoCancelMessage}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-950 px-4 py-5 text-white sm:px-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase text-emerald-300">
                  Customer Order
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h2 className="max-w-full break-all font-mono text-xl font-extrabold sm:text-2xl md:text-3xl">
                    {getOrderDisplayNumber(order)}
                  </h2>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <InfoBlock label="Customer" value={order.customer} />
                  <InfoBlock label="Phone" value={order.phone || "-"} />
                  <InfoBlock label="Email" value={order.email || "-"} />
                </div>
              </div>
              <div className="grid w-full gap-2 rounded-lg border border-white/10 bg-white/5 p-4 text-sm lg:w-auto lg:min-w-[280px]">
                <InfoLine label="Created" value={formatDate(order.createdAt)} />
                <InfoLine label="Items" value={String(order.items)} />
                <InfoLine
                  label="Payment"
                  value={order.paymentType === "installment" ? order.installmentPlan ?? "Installment" : "Full Payment"}
                />
                <InfoLine label="Payment status" value={order.paymentStatus} />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_340px]">
            <div className="space-y-5 p-4 sm:space-y-6 sm:p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SummaryTile label="Total" value={formatCurrency(order.total)} />
                <SummaryTile label="Paid" value={formatCurrency(order.amountPaid)} tone="text-emerald-700" />
                <SummaryTile
                  label="Balance"
                  value={formatCurrency(order.remainingAmount)}
                  tone={order.remainingAmount > 0 ? "text-red-600" : "text-emerald-700"}
                />
                <SummaryTile label="Status" value={ORDER_STATUS_CONFIG[order.status].label} />
              </div>

              <PremiumTrackingPanel order={order} tracking={trackingSummary} />

              <div className="grid gap-4 lg:grid-cols-2">
                <InfoCard icon={User} title="Customer">
                  <DetailRow label="Name" value={order.customer} />
                  <DetailRow label="Email" value={order.email || "No email provided"} />
                  <DetailRow label="Phone" value={order.phone || "No phone provided"} />
                </InfoCard>
                <InfoCard icon={Truck} title="Fulfillment">
                  <DetailRow label="Created" value={formatDate(order.createdAt)} />
                  <DetailRow label="Order status" value={ORDER_STATUS_CONFIG[order.status].label} />
                  <DetailRow label="Shipping" value={order.shippingAddress || "No shipping address"} />
                </InfoCard>
              </div>

              <section className="rounded-lg border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                      <PackageOpen className="h-4 w-4 text-emerald-600" />
                      Order Items
                    </h3>
                    <p className="text-xs text-slate-500">
                      {order.items} item{order.items === 1 ? "" : "s"} in this order
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    Order total
                    <div className="text-sm font-bold text-slate-900">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                </div>

                {order.lineItems.length === 0 ? (
                  <div className="p-5 text-center text-sm text-slate-500">
                    No line items recorded for this order.
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 p-3 sm:hidden">
                      {order.lineItems.map((item) => (
                        <OrderItemCard key={`${item.sku}-${item.name}`} item={item} />
                      ))}
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-slate-900">Total</span>
                          <span className="text-base font-extrabold text-emerald-700">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <SimpleDataTable
                        minWidth="min-w-[760px]"
                        headers={["Item", "SKU", "Location", "Qty", "Unit Price"]}
                        rows={order.lineItems.map((item) => ({
                          id: `${item.sku}-${item.name}`,
                          cells: [
                            <span key="name" className="font-semibold text-slate-900">{item.name}</span>,
                            <span key="sku" className="font-mono text-xs text-slate-500">{item.sku}</span>,
                            item.locationName ?? "Not recorded",
                            item.qty,
                            <PriceDisplay key="price" item={item} />,
                          ],
                        }))}
                      />
                      <div className="border-t border-slate-200 bg-slate-50 p-4">
                        <div className="ml-auto grid max-w-sm gap-2 rounded-lg border border-slate-200 bg-white p-4">
                          <SummaryAmount label="Subtotal" value={formatCurrency(order.total)} />
                          <SummaryAmount label="Total" value={formatCurrency(order.total)} strong />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </section>

              {installmentSummary ? (
                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        Lipa Mdogo Plan
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {order.installmentPlan} plan, approximately {formatCurrency(installmentSummary.installmentAmount)} per installment.
                      </p>
                    </div>
                    <div className="text-sm sm:text-right">
                      <p className="font-semibold text-emerald-700">{formatCurrency(order.amountPaid)} paid</p>
                      <p className="font-semibold text-red-600">{formatCurrency(order.remainingAmount)} remaining</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${installmentSummary.progress}%` }}
                    />
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <SummaryPill label="Paid installments" value={`${installmentSummary.paidCount}/${installmentSummary.months}`} />
                    <SummaryPill label="Partial paid" value={formatCurrency(installmentSummary.partialPaid)} />
                    <SummaryPill label="Next due" value={formatDate(installmentSummary.nextPaymentDate)} />
                  </div>
                </section>
              ) : (
                <section className="rounded-lg border border-slate-200 bg-white p-5 text-center text-sm text-slate-600">
                  <CreditCard className="mx-auto mb-2 h-5 w-5 text-slate-400" />
                  Full payment order with no installment schedule.
                </section>
              )}
            </div>

            <aside className="space-y-4 border-t border-slate-200 bg-slate-50 p-4 sm:p-5 lg:border-l lg:border-t-0">
              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">Payment Summary</h3>
                    <p className="text-xs text-slate-500">Collection status</p>
                  </div>
                  <HandCoins className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="break-words text-2xl font-extrabold text-slate-950">
                  {formatCurrency(order.remainingAmount)}
                </div>
                <p className="mt-1 text-xs text-slate-500">remaining balance</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${paymentProgress}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>{formatCurrency(order.amountPaid)} paid</span>
                  <span>{paymentProgress.toFixed(0)}%</span>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Shipping Address
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                  {order.shippingAddress || "No shipping address recorded."}
                </p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <TimelineRow label="Created" value={formatDate(order.createdAt)} />
                  {order.installmentStartDate ? (
                    <TimelineRow label="Installment start" value={formatDate(order.installmentStartDate)} />
                  ) : null}
                  <TimelineRow label="Current status" value={ORDER_STATUS_CONFIG[order.status].label} />
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Actions</h3>
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftStatus(order.status);
                      setIsStatusOpen(true);
                    }}
                    disabled={isLocked}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <PenLine className="h-4 w-4" />
                    Update Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaymentOpen(true)}
                    disabled={!canRecordPayment}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <HandCoins className="h-4 w-4" />
                    Record Payment
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>

      {isStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <ModalHeader title="Update Order Status" onClose={() => setIsStatusOpen(false)} />
            <select
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value as OrderStatus)}
              className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {ORDER_STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setIsStatusOpen(false)} className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold hover:bg-slate-50">
                Cancel
              </button>
              <button
                type="button"
                onClick={updateStatus}
                disabled={updateOrderStatus.isPending}
                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateOrderStatus.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentOpen && installmentSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <ModalHeader title="Record Payment" onClose={() => setIsPaymentOpen(false)} />
            <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-slate-700">
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {paymentErrors.amount ? (
                  <span className="mt-1 block text-xs text-red-500">{paymentErrors.amount.message}</span>
                ) : null}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Payment Method</span>
                <select
                  {...registerPayment("paymentMethod")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
                  placeholder="Optional - cash auto-generates CSH-12345"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={recordOrderPayment.isPending}
                  className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {recordOrderPayment.isPending ? "Recording..." : "Record Payment"}
                </button>
                <button type="button" onClick={() => setIsPaymentOpen(false)} className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 left-3 right-3 z-[60] rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-2xl sm:left-auto sm:right-6 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
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
      <span className="text-right font-semibold capitalize text-white">{value}</span>
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
      <div className={`mt-1 truncate text-lg font-extrabold ${tone}`}>{value}</div>
    </div>
  );
}

type TrackingSummary = {
  currentIndex: number;
  progress: number;
  headline: string;
  detail: string;
  etaLabel: string;
  etaValue: string;
  isCancelled: boolean;
};

function PremiumTrackingPanel({
  order,
  tracking,
}: {
  order: Order;
  tracking: TrackingSummary;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-sm">
      <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[1fr_290px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold uppercase text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Tracking
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-white sm:text-2xl">
                {tracking.headline}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                {tracking.detail}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p className="text-xs font-semibold uppercase text-slate-400">{tracking.etaLabel}</p>
              <p className="mt-1 font-bold text-white">{tracking.etaValue}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all ${tracking.isCancelled ? "bg-red-400" : "bg-emerald-400"}`}
                style={{ width: `${tracking.progress}%` }}
              />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {trackingStatuses.map((status, index) => (
                <TrackingStep
                  key={status}
                  label={ORDER_STATUS_CONFIG[status].label}
                  date={getTrackingStepDate(order, status)}
                  state={getTrackingStepState(tracking, index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid content-start gap-3">
          <TrackingMetric
            icon={ShieldCheck}
            label="Order assurance"
            value={order.paymentStatus === "paid" ? "Payment cleared" : `${formatCurrency(order.remainingAmount)} balance`}
            tone={order.paymentStatus === "paid" ? "text-emerald-200" : "text-amber-200"}
          />
          <TrackingMetric
            icon={Route}
            label="Fulfillment lane"
            value={order.shippingAddress ? "Address confirmed" : "Awaiting address"}
            tone={order.shippingAddress ? "text-sky-200" : "text-slate-300"}
          />
          <TrackingMetric
            icon={Truck}
            label="Delivery mode"
            value={order.status === "shipped" ? "Courier active" : "Store dispatch"}
            tone="text-indigo-200"
          />
        </div>
      </div>
    </section>
  );
}

function TrackingStep({
  label,
  date,
  state,
}: {
  label: string;
  date: string;
  state: "complete" | "active" | "upcoming" | "cancelled";
}) {
  const isComplete = state === "complete";
  const isActive = state === "active";
  const isCancelled = state === "cancelled";
  const Icon = isComplete ? CheckCircle2 : CircleDashed;

  return (
    <div className={`rounded-lg border p-3 ${isActive ? "border-emerald-300/50 bg-emerald-300/10" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isCancelled
              ? "bg-red-400/15 text-red-200"
              : isComplete
                ? "bg-emerald-400/15 text-emerald-200"
                : isActive
                  ? "bg-amber-300/15 text-amber-200"
                  : "bg-white/10 text-slate-400"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{label}</p>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
      </div>
    </div>
  );
}

function TrackingMetric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof User;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className={`mt-2 text-sm font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-emerald-600" />
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}

function OrderItemCard({ item }: { item: LineItem }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="font-semibold text-slate-900">{item.name}</div>
      <div className="mt-1 font-mono text-xs text-slate-500">{item.sku}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <MobileMetric label="Qty" value={String(item.qty)} />
        <div className="min-w-0 rounded-md bg-slate-50 p-2">
          <div className="text-[10px] font-bold uppercase text-slate-500">Unit</div>
          <div className="mt-1">
            <PriceDisplay item={item} />
          </div>
        </div>
        <MobileMetric label="Total" value={formatCurrency(item.qty * item.price)} strong tone="text-emerald-700" />
      </div>
      <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
        Location: <span className="font-semibold">{item.locationName ?? "Not recorded"}</span>
      </div>
    </div>
  );
}

function PriceDisplay({ item }: { item: LineItem }) {
  if (item.price < item.originalPrice) {
    return (
      <span className="inline-flex flex-col items-start gap-0.5">
        <span className="text-xs text-slate-400 line-through">
          {formatCurrency(item.originalPrice)}
        </span>
        <span className="font-semibold text-emerald-700">
          {formatCurrency(item.price)}
        </span>
      </span>
    );
  }

  return <span>{formatCurrency(item.price)}</span>;
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

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function getTrackingSummary(order: Order): TrackingSummary {
  if (order.status === "cancelled") {
    return {
      currentIndex: 0,
      progress: 100,
      headline: "Order cancelled",
      detail: "This order is closed and no longer moving through fulfillment.",
      etaLabel: "Resolution",
      etaValue: "Cancelled",
      isCancelled: true,
    };
  }

  const currentIndex = Math.max(0, trackingStatuses.indexOf(order.status));
  const progress = Math.round((currentIndex / (trackingStatuses.length - 1)) * 100);
  const etaDate = getTrackingEta(order);

  const copy: Record<OrderStatus, { headline: string; detail: string; etaLabel: string }> = {
    pending: {
      headline: "Order received",
      detail: "Payment and stock checks are queued before the order moves into packing.",
      etaLabel: "Processing target",
    },
    processing: {
      headline: "Being prepared",
      detail: "Items are being picked, verified, and packed for dispatch.",
      etaLabel: "Dispatch target",
    },
    shipped: {
      headline: "Out for delivery",
      detail: "The order has left fulfillment and is moving toward the customer.",
      etaLabel: "Delivery target",
    },
    delivered: {
      headline: "Delivered successfully",
      detail: "Fulfillment is complete and the order is ready for after-sale follow-up.",
      etaLabel: "Completed",
    },
    cancelled: {
      headline: "Order cancelled",
      detail: "This order is closed and no longer moving through fulfillment.",
      etaLabel: "Resolution",
    },
  };

  return {
    currentIndex,
    progress,
    ...copy[order.status],
    etaValue: order.status === "delivered" ? formatDate(order.createdAt) : formatDate(etaDate),
    isCancelled: false,
  };
}

function getTrackingStepState(
  tracking: TrackingSummary,
  index: number,
): "complete" | "active" | "upcoming" | "cancelled" {
  if (tracking.isCancelled) return "cancelled";
  if (index < tracking.currentIndex) return "complete";
  if (index === tracking.currentIndex) return "active";
  return "upcoming";
}

function getTrackingStepDate(order: Order, status: OrderStatus) {
  const offsets: Record<OrderStatus, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 4,
    cancelled: 0,
  };

  if (order.status === "cancelled") return "Stopped";
  if (!trackingStatuses.includes(status)) return "-";
  return formatDate(addDays(order.createdAt, offsets[status]));
}

function getTrackingEta(order: Order) {
  const offsets: Record<OrderStatus, number> = {
    pending: 1,
    processing: 2,
    shipped: 4,
    delivered: 0,
    cancelled: 0,
  };

  return addDays(order.createdAt, offsets[order.status]);
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
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

function addDays(date: string, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
}

function addMonths(date: string, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate.toISOString();
}
