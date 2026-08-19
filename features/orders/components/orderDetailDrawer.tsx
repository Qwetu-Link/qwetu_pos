"use client";

import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Mail,
  Package,
  Phone,
  Receipt,
  User,
  X,
} from "lucide-react";

import StatusBadge from "./statusBadge";
import type { Order } from "@/types/admin/orderTypes";
import {
  formatCurrency,
  formatDate,
  getOrderDisplayNumber,
} from "@/utils/orderUtils";

interface OrderDetailDrawerProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDetailDrawer({
  order,
  open,
  onOpenChange,
}: OrderDetailDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close order details"
        onClick={() => onOpenChange(false)}
        className={`absolute inset-0 bg-slate-950/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Order details"
      >
        {order ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {order.customer}
                  </h2>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-base font-medium text-slate-500">
                  {getOrderDisplayNumber(order)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <DetailSection title="Customer">
                <DetailRow icon={User} label="Name" value={order.customer} />
                <DetailRow icon={Mail} label="Email" value={order.email} />
                <DetailRow icon={Phone} label="Phone" value={order.phone} />
              </DetailSection>

              <DetailSection title="Order Details">
                <DetailRow
                  icon={Package}
                  label="Items"
                  value={String(order.items)}
                />
                <DetailRow
                  icon={Receipt}
                  label="Total"
                  value={formatCurrency(order.total)}
                  valueClassName="font-semibold text-emerald-700"
                />
                <DetailRow
                  icon={CreditCard}
                  label="Payment"
                  value={
                    order.paymentType === "installment"
                      ? `Installment - ${order.installmentPlan ?? "Scheduled plan"}`
                      : "Full Payment"
                  }
                />
                <DetailRow
                  icon={Calendar}
                  label="Created"
                  value={formatDate(order.createdAt)}
                />
              </DetailSection>

              <div className="flex gap-3 pt-2">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  View Full Order
                </Link>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex-1 rounded-xl bg-slate-700 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Manage Order
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        {children}
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-slate-400" />
        {label}
      </div>
      <span className={`text-right text-sm text-slate-800 ${valueClassName ?? ""}`}>
        {value}
      </span>
    </div>
  );
}
