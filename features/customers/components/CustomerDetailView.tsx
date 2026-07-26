"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CircleUser,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { RISK_CONFIG, SEGMENT_CONFIG } from "@/data/customer-config";
import type { Order } from "@/types/customer";
import { getInitials, getLoyaltyProgress, getLoyaltyStatus } from "@/utils/customerUtils";
import { formatCurrency, formatDate, getOrderDisplayNumber } from "@/utils/orderUtils";
import { useCustomersContext } from "./CustomersContext";
import { OrdersTable } from "./OrdersTable";
import StatusBadge from "@/features/orders/components/statusBadge";

interface CustomerDetailViewProps {
  customerId: string;
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const { getById, getOrdersByCustomer } = useCustomersContext();

  const customer = getById(customerId);
  const orders = customer ? getOrdersByCustomer(customer.id) : [];

  if (!customer) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-950">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <div className="w-full rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <CircleUser size={48} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-800">Customer not found</h2>
            <p className="mt-2 text-sm text-slate-500">
              No customer matching <span className="font-mono">{customerId}</span> exists.
            </p>
            <Link
              href="/admin/customers"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft size={16} /> Back to Customers
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const paid = orders.reduce((sum, order) => sum + order.amountPaid, 0);
  const outstanding = orders.reduce((sum, order) => sum + order.remainingAmount, 0);
  const lastOrder = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  const loyalty = getLoyaltyStatus(customer.totalSpent);
  const loyaltyPct = getLoyaltyProgress(customer.totalSpent);
  const risk = RISK_CONFIG[customer.riskLevel];
  const segment = SEGMENT_CONFIG[customer.segment];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <ArrowLeft size={16} /> Back to Customers
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase text-slate-500 shadow-sm">
            <CircleUser size={14} /> Customer 360
          </div>
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-4 py-4 text-white sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xl font-black sm:text-2xl">
                  {getInitials(customer.name)}
                </div>
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${segment.color}`}>
                      {customer.segment}
                    </span>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${risk.color}`}>
                      {risk.label}
                    </span>
                  </div>
                  <h1 className="break-words text-2xl font-black tracking-normal sm:text-3xl">
                    {customer.name}
                  </h1>
                  <p className="mt-1.5 max-w-3xl text-sm text-slate-300">
                    Joined {formatSafeDate(customer.joinedDate)} · Last purchase {formatSafeDate(customer.lastPurchase)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/customers/${encodeURIComponent(customer.slug)}/orders/add`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
                >
                  <ShoppingCart size={16} /> New Order
                </Link>
                <Link
                  href="/admin/customers"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <ShoppingBag size={16} /> All Customers
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4 p-4 sm:p-5">
              <div className="flex flex-wrap gap-3">
                <MetricCard icon={ShoppingBag} label="Total orders" value={String(customer.totalOrders)} />
                <MetricCard icon={CreditCard} label="Total spent" value={formatCurrency(customer.totalSpent)} tone="emerald" />
                <MetricCard icon={WalletCards} label="Outstanding" value={formatCurrency(outstanding)} tone={outstanding > 0 ? "red" : "emerald"} />
                <MetricCard icon={Sparkles} label="Active plans" value={String(customer.activeInstallments)} tone="amber" />
              </div>

              <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">Contact Details</h2>
                      <p className="text-xs text-slate-500">Primary customer information</p>
                    </div>
                    <CircleUser className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="space-y-3">
                    <InfoLine icon={Mail} label="Email" value={customer.email || "Not provided"} />
                    <InfoLine icon={Phone} label="Phone" value={customer.phone || "Not provided"} />
                    <InfoLine icon={MapPin} label="Address" value={customer.address || "Not provided"} />
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">Account Health</h2>
                      <p className="text-xs text-slate-500">Loyalty and payment posture</p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SmallStat label="Loyalty" value={loyalty} />
                    <SmallStat label="Payment score" value={`${customer.paymentScore}%`} />
                    <SmallStat label="Collected" value={formatCurrency(paid)} />
                    <SmallStat label="Last order" value={lastOrder ? formatDate(lastOrder.createdAt) : "-"} />
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">Loyalty progress</span>
                      <span className="font-bold text-emerald-700">{loyaltyPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${loyaltyPct}%` }} />
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
                  <div>
                    <h2 className="flex items-center gap-2 font-bold text-slate-900">
                      <ShoppingBag size={18} className="text-emerald-600" />
                      Customer Orders
                    </h2>
                    <p className="text-xs text-slate-500">{orders.length} order{orders.length === 1 ? "" : "s"} on this account</p>
                  </div>
                  <Link
                    href={`/admin/customers/${encodeURIComponent(customer.slug)}/orders/add`}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <ShoppingCart size={15} /> New Order
                  </Link>
                </div>
                <div className="p-3 sm:hidden">
                  <MobileOrders orders={orders} />
                </div>
                <div className="hidden sm:block">
                  <OrdersTable orders={orders} />
                </div>
              </section>

              <div className="grid gap-3 xl:grid-cols-2">
                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <h2 className="mb-4 font-bold text-slate-900">Customer Timeline</h2>
                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <TimelineItem
                      icon={CalendarDays}
                      label="Joined"
                      value={formatSafeDate(customer.joinedDate)}
                    />
                    <TimelineItem
                      icon={ShoppingBag}
                      label="Last purchase"
                      value={formatSafeDate(customer.lastPurchase)}
                    />
                    <TimelineItem
                      icon={TrendingUp}
                      label="Segment"
                      value={`${customer.segment} customer`}
                    />
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <h2 className="mb-3 font-bold text-slate-900">Payment Summary</h2>
                  <div className="space-y-3">
                    <SideAmount label="Total spent" value={formatCurrency(customer.totalSpent)} />
                    <SideAmount label="Paid across orders" value={formatCurrency(paid)} tone="text-emerald-700" />
                    <SideAmount label="Outstanding balance" value={formatCurrency(outstanding)} tone={outstanding > 0 ? "text-red-600" : "text-emerald-700"} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function formatSafeDate(value?: string) {
  return value ? formatDate(value) : "-";
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "slate",
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
  tone?: "slate" | "emerald" | "amber" | "red";
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-3 sm:w-[calc(50%-0.375rem)] xl:w-44">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="text-xs font-bold uppercase text-slate-500">{label}</div>
      <div className="mt-1 break-words text-lg font-black text-slate-950">{value}</div>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase text-slate-500">{label}</div>
        <div className="mt-0.5 break-words text-sm font-semibold text-slate-800">{value}</div>
      </div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 p-3">
      <div className="text-[10px] font-bold uppercase text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className="text-sm font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function SideAmount({
  label,
  value,
  tone = "text-slate-950",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-right text-sm font-black ${tone}`}>{value}</span>
    </div>
  );
}

function MobileOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-5 text-center">
        <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-slate-300" />
        <div className="font-bold text-slate-800">No orders yet</div>
        <p className="mt-1 text-sm text-slate-500">New purchases will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/admin/orders/${order.id}`}
          className="block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-emerald-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-mono text-xs font-black text-slate-900">
                {getOrderDisplayNumber(order)}
              </div>
              <div className="mt-1 text-xs text-slate-500">{formatDate(order.createdAt)}</div>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <SmallStat label="Items" value={String(order.items)} />
            <SmallStat label="Total" value={formatCurrency(order.total)} />
            <SmallStat label="Balance" value={order.remainingAmount > 0 ? formatCurrency(order.remainingAmount) : "Cleared"} />
          </div>
        </Link>
      ))}
    </div>
  );
}
