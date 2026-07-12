"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EmptyState from "@/components/common/EmptyState";
import { Eye, Inbox } from "lucide-react";
import StatusBadge from "./statusBadge";
import { Order } from "@/types/orderTypes";
import { formatCurrency, formatDate } from "@/utils/orderUtils";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        href={`/admin/orders/${row.original.id}`}
        className="font-medium text-slate-800 hover:text-emerald-700"
      >
        {row.original.id}
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
    header: "Action",
    cell: ({ row }) => <ViewLink orderId={row.original.id} />,
  },
];

export default function OrdersTable({
  orders,
}: {
  orders: Order[];
}) {
  // TanStack Table intentionally returns function-heavy instances that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-left text-sm font-semibold text-slate-600"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
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
