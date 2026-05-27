"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Inbox } from "lucide-react";
import StatusBadge from "./statusBadge";
import { Order } from "@/types/orderTypes";
import { formatCurrency, formatDate } from "@/lib/orderUtils";

export type OrderViewMode = "table" | "card" | "list";

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
  viewMode,
}: {
  orders: Order[];
  viewMode: OrderViewMode;
}) {
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm">
        <Inbox className="mx-auto mb-2 h-8 w-8" />
        <p>No orders match your search</p>
      </div>
    );
  }

  if (viewMode === "card") {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {table.getRowModel().rows.map((row) => (
          <OrderCard key={row.id} order={row.original} />
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {table.getRowModel().rows.map((row) => (
          <OrderListItem key={row.id} order={row.original} />
        ))}
      </div>
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

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href={`/admin/orders/${order.id}`}
            className="text-lg font-bold text-slate-800 hover:text-emerald-700"
          >
            {order.id}
          </Link>
          <p className="mt-1 font-medium text-slate-700">{order.customer}</p>
          <p className="text-sm text-slate-400">{order.email}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Summary label="Items" value={String(order.items)} />
        <Summary label="Date" value={formatDate(order.createdAt)} />
        <Summary label="Total" value={formatCurrency(order.total)} highlight />
        <div>
          <p className="text-xs text-slate-400">Payment</p>
          <PaymentCell order={order} />
        </div>
      </div>

      <div className="mt-4 flex justify-end ">
        <ViewLink orderId={order.id} />
      </div>
    </div>
  );
}

function OrderListItem({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-bold text-slate-800 hover:text-emerald-700"
        >
          {order.id}
        </Link>
        <p className="truncate text-sm font-medium text-slate-700">
          {order.customer}
        </p>
        <p className="truncate text-xs text-slate-400">{order.email}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-slate-500">{order.items} items</span>
        <span className="font-semibold text-emerald-700">
          {formatCurrency(order.total)}
        </span>
        <StatusBadge status={order.status} />
        <span className="text-black">{formatDate(order.createdAt)}</span>
        <ViewLink orderId={order.id} />
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`font-semibold ${highlight ? "text-emerald-700" : "text-slate-700"}`}
      >
        {value}
      </p>
    </div>
  );
}
