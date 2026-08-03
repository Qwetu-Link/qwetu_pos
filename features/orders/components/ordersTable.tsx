"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import EmptyState from "@/components/common/EmptyState";
import { DataTable } from "@/components/datatables";
import { Eye, Inbox, XCircle } from "lucide-react";
import StatusBadge from "./statusBadge";
import { Order } from "@/types/orderTypes";
import { formatCurrency, formatDate, getOrderDisplayNumber } from "@/utils/orderUtils";

function getColumns({
  cancellingOrderId,
  onCancel,
}: {
  cancellingOrderId?: string | null;
  onCancel?: (order: Order) => void;
}): ColumnDef<Order>[] {
  return [
    {
      id: "select",
      size: 28,
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
          aria-label="Select all visible orders"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(event) => row.toggleSelected(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
          aria-label={`Select order ${getOrderDisplayNumber(row.original)}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Order Number",
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="font-medium text-slate-800 hover:text-emerald-700"
        >
          {getOrderDisplayNumber(row.original)}
        </Link>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-700">{row.original.customer}</div>
          <div className="text-xs text-slate-400">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <span className="text-slate-500">{row.original.items}</span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold text-emerald-700">
          {formatCurrency(row.original.total)}
        </span>
      ),
    },
    {
      accessorKey: "paymentType",
      header: "Payment",
      cell: ({ row }) => <PaymentCell order={row.original} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <ViewLink orderId={row.original.id} />
          {onCancel && row.original.status !== "cancelled" ? (
            <button
              type="button"
              onClick={() => onCancel(row.original)}
              disabled={cancellingOrderId === row.original.id}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle className="h-4 w-4" />
              {cancellingOrderId === row.original.id ? "Cancelling..." : "Cancel"}
            </button>
          ) : null}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { className: "text-right" },
    },
  ];
}

export default function OrdersTable({
  orders,
  cancellingOrderId,
  onCancel,
}: {
  orders: Order[];
  cancellingOrderId?: string | null;
  onCancel?: (order: Order) => void;
}) {
  if (orders.length === 0) {
    return (
      <EmptyState
        compact
        icon={Inbox}
        title="No orders to show"
        description="There are no orders in this view. Try clearing filters, changing the search, or creating a new order."
      />
    );
  }

  return (
    <DataTable
      columns={getColumns({ cancellingOrderId, onCancel })}
      data={orders}
      minWidth="min-w-[1040px]"
      pageSize={10}
      showColumnToggle
      showPagination
      emptyMessage="No orders match this view."
    />
  );
}

function PaymentCell({ order }: { order: Order }) {
  if (order.paymentType === "installment") {
    return (
      <>
        <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700">
          Installment
        </span>
        <p className="mt-1 text-xs text-slate-500">{order.installmentPlan}</p>
      </>
    );
  }

  return <span className="text-sm text-slate-600">Full Payment</span>;
}

function ViewLink({ orderId }: { orderId: string }) {
  return (
    <Link
      href={`/admin/orders/${orderId}`}
      className="inline-flex items-center text-black gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-emerald-50"
    >
      <Eye className="h-4 w-4" />
      View
    </Link>
  );
}
