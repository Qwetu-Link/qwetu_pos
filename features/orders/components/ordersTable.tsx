"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import EmptyState from "@/components/common/EmptyState";
import { DataTable } from "@/components/datatables";
import { Eye, Inbox, MoreHorizontal, Package2, PlusCircle, XCircle } from "lucide-react";
import StatusBadge from "./statusBadge";
import type { Order } from "@/types/orderTypes";
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
      header: "Order",
      cell: ({ row }) => (
        <div className="min-w-[160px] space-y-1">
          <Link
            href={`/admin/orders/${row.original.id}`}
            className="font-semibold text-slate-800 transition hover:text-emerald-700"
          >
            {getOrderDisplayNumber(row.original)}
          </Link>
          <p className="text-xs text-slate-400">{row.original.paymentStatus}</p>
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <div className="font-medium text-slate-700">{row.original.customer}</div>
          <div className="truncate text-xs text-slate-400">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => <span className="text-slate-600">{row.original.items}</span>,
    },
    {
      accessorKey: "total",
      header: "Amount",
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
        <span className="text-sm text-slate-500">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }) => (
        <ActionMenu
          order={row.original}
          cancellingOrderId={cancellingOrderId}
          onCancel={onCancel}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { className: "w-[88px] text-right" },
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
            <Package2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
            <p className="text-sm text-slate-500">
              Review recent activity, payment progress, and delivery status in one place.
            </p>
          </div>
        </div>
        <Link
          href="/admin/orders/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add order
        </Link>
      </div>
      <div className="p-4">
        <DataTable
          columns={getColumns({ cancellingOrderId, onCancel })}
          data={orders}
          minWidth="min-w-[1080px]"
          pageSize={10}
          showToolbar
          showColumnToggle
          showPagination
          emptyMessage="No orders match this view."
        />
      </div>
    </div>
  );
}

function PaymentCell({ order }: { order: Order }) {
  if (order.paymentType === "installment") {
    return (
      <div className="space-y-1">
        <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
          Installment
        </span>
        <p className="text-xs text-slate-500">{order.installmentPlan ?? "Scheduled plan"}</p>
      </div>
    );
  }

  return <span className="text-sm text-slate-600">Full payment</span>;
}

function ActionMenu({
  order,
  cancellingOrderId,
  onCancel,
}: {
  order: Order;
  cancellingOrderId?: string | null;
  onCancel?: (order: Order) => void;
}) {
  return (
    <div className="flex justify-end">
      <details className="relative">
        <summary className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
          <MoreHorizontal className="h-4 w-4" />
        </summary>
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <Link
            href={`/admin/orders/${order.id}`}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
          {onCancel && order.status !== "cancelled" ? (
            <button
              type="button"
              onClick={() => onCancel(order)}
              disabled={cancellingOrderId === order.id}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle className="h-4 w-4" />
              {cancellingOrderId === order.id ? "Cancelling..." : "Cancel"}
            </button>
          ) : null}
        </div>
      </details>
    </div>
  );
}
