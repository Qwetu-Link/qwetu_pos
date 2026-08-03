"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  Plus,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import OrderFilters from "./orderFilters";
import OrderStatsCards from "./orderStatsCards";
import { OrderStatus } from "@/data/order-options";
import OrdersTable from "./ordersTable";
import { useGetOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import type { Order } from "@/types/orderTypes";
import { getOrderDisplayNumber } from "@/utils/orderUtils";
import { TableSkeleton } from "@/components/skeletons";

export default function OrdersPage() {
  const { orders, isLoading, isError, error, refetch } = useGetOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const count = (status: OrderStatus) =>
      orders.filter((order) => order.status === status).length;
    const installmentCount = orders.filter(
      (order) => order.paymentType === "installment",
    ).length;

    return {
      total: orders.length,
      pending: count("pending"),
      processing: count("processing"),
      shipped: count("shipped"),
      delivered: count("delivered"),
      cancelled: count("cancelled"),
      installmentPercentage: orders.length
        ? Math.round((installmentCount / orders.length) * 100)
        : 0,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return orders.filter((order) => {
      const orderNumber = getOrderDisplayNumber(order).toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        orderNumber.includes(normalizedSearch) ||
        order.customer.toLowerCase().includes(normalizedSearch) ||
        order.email.toLowerCase().includes(normalizedSearch) ||
        order.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleCancelOrder = async (order: Order) => {
    setCancellingOrderId(order.id);

    try {
      await updateOrderStatus.mutateAsync({
        id: order.id,
        status: "cancelled",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold text-black">
              <ReceiptText className="h-8 w-8 text-emerald-600" />
              Order Pipeline
            </h1>
            <p className="mt-1 text-slate-500">
              Track, manage and manually add customer orders
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/orders/add"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 font-medium text-white transition hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Manual Add Order
            </Link>
            <button
              type="button"
              onClick={async () => {
                setSearchTerm("");
                setStatusFilter("all");
                await refetch();
              }}
              className="inline-flex text-black items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 transition hover:bg-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2.5 text-white transition hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <OrderStatsCards stats={stats} />
        <OrderFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />
        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error?.message ?? "Could not load orders."}
          </div>
        ) : null}
        {isLoading ? (
          <TableSkeleton rows={8} columns={9} />
        ) : (
          <OrdersTable
            orders={filteredOrders}
            cancellingOrderId={updateOrderStatus.isPending ? cancellingOrderId : null}
            onCancel={handleCancelOrder}
          />
        )}
      </div>

    </div>
  );
}
