import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import { SimpleDataTable } from "@/components/datatables";
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
    <SimpleDataTable
      minWidth="min-w-[980px]"
      headers={[
        "Order",
        "Date",
        "Items",
        "Total",
        "Payment",
        "Balance",
        "Status",
        { label: "Action", className: "text-right" },
      ]}
      rows={orders.map((order) => ({
        id: order.id,
        cells: [
          <Link
            key="order"
            href={`/admin/orders/${order.id}`}
            className="inline-flex items-center gap-2 font-medium text-slate-800 hover:text-emerald-700"
          >
            <ReceiptText className="h-4 w-4 text-emerald-600" />
            <span className="font-mono text-xs">{getOrderDisplayNumber(order)}</span>
          </Link>,
          <span key="date" className="whitespace-nowrap">{formatDate(order.createdAt)}</span>,
          <span key="items" className="inline-flex items-center gap-1.5 text-slate-600">
            <Package className="h-4 w-4 text-slate-400" />
            {order.items}
          </span>,
          <span key="total" className="font-semibold text-emerald-700">{formatCurrency(order.total)}</span>,
          <PaymentCell key="payment" order={order} />,
          <BalanceCell key="balance" order={order} />,
          <StatusBadge key="status" status={order.status} />,
          <div key="action" className="flex justify-end">
            <Link
              href={`/admin/orders/${order.id}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-black transition hover:bg-emerald-50"
            >
              <Eye className="h-4 w-4" />
              View
            </Link>
          </div>,
        ],
      }))}
    />
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
