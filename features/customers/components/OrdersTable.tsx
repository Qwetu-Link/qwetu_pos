import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import { CreditCard, Eye, Package, ReceiptText, ShoppingBag } from "lucide-react";
import type { Order } from "@/types/customer";
import StatusBadge from "@/features/orders/components/statusBadge";
import { formatCurrency, formatDate, getOrderDisplayNumber } from "@/utils/orderUtils";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders for this customer"
        description="When this customer makes a purchase, their order history and payment status will appear here."
        className="rounded-2xl"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Order</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Date</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Items</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Total</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Payment</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Balance</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-2 font-medium text-slate-800 hover:text-emerald-700"
                  >
                    <ReceiptText className="h-4 w-4 text-emerald-600" />
                    <span className="font-mono text-xs">{getOrderDisplayNumber(order)}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-slate-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <Package className="h-4 w-4 text-slate-400" />
                    {order.items}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-emerald-700">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-5 py-3">
                  <PaymentCell order={order} />
                </td>
                <td className="px-5 py-3">
                  <BalanceCell order={order} />
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-black transition hover:bg-emerald-50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentCell({ order }: { order: Order }) {
  if (order.paymentType === "installment") {
    return (
      <div>
        <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
          Installment
        </span>
        <p className="mt-1 text-xs text-slate-500">{order.installmentPlan}</p>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
      <CreditCard className="h-4 w-4 text-slate-400" />
      Full Payment
    </span>
  );
}

function BalanceCell({ order }: { order: Order }) {
  if (order.remainingAmount <= 0) {
    return <span className="text-sm font-medium text-emerald-700">Cleared</span>;
  }

  return (
    <div>
      <p className="font-semibold text-red-600">{formatCurrency(order.remainingAmount)}</p>
      <p className="text-xs text-slate-400">
        Paid {formatCurrency(order.amountPaid)}
      </p>
    </div>
  );
}
