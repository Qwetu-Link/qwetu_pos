"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  Inbox,
  Plus,
  ReceiptText,
  RefreshCw,
  SearchX,
} from "lucide-react";
import type { SortingState, VisibilityState } from "@tanstack/react-table";
import OrderFilters from "./orderFilters";
import OrderStatsCards from "./orderStatsCards";
import { OrderStatus } from "@/data/order-options";
import OrdersTable from "./ordersTable";
import OrderDetailDrawer from "./orderDetailDrawer";
import { useDeleteOrder, useGetOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import type { Density, Order } from "@/types/admin/orderTypes";
import { getOrderDisplayNumber } from "@/utils/orderUtils";

const LS_PREFIX = "orders-table:";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch {
    // Preference persistence should never block the dashboard.
  }
}

export default function OrdersPage() {
  const { orders, isLoading, isError, error, refetch } = useGetOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 250);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [density, setDensity] = useState<Density>(() =>
    loadFromStorage("density", "comfortable"),
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    loadFromStorage("columnVisibility", {}),
  );
  const [sorting, setSorting] = useState<SortingState>(() =>
    loadFromStorage("sorting", [{ id: "createdAt", desc: true }]),
  );
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);

  useEffect(() => saveToStorage("density", density), [density]);
  useEffect(
    () => saveToStorage("columnVisibility", columnVisibility),
    [columnVisibility],
  );
  useEffect(() => saveToStorage("sorting", sorting), [sorting]);

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
    const normalizedSearch = debouncedSearchTerm.toLowerCase();

    return orders.filter((order) => {
      const orderNumber = getOrderDisplayNumber(order).toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        orderNumber.includes(normalizedSearch) ||
        order.customer.toLowerCase().includes(normalizedSearch) ||
        order.email.toLowerCase().includes(normalizedSearch) ||
        order.phone.includes(debouncedSearchTerm);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, debouncedSearchTerm, statusFilter]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
  }, []);

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

  const handleDeleteOrders = useCallback(
    async (ids: string[]) => {
      for (const id of ids) {
        setDeletingOrderId(id);
        try {
          await deleteOrder.mutateAsync({ id });
        } finally {
          setDeletingOrderId(null);
        }
      }
    },
    [deleteOrder],
  );

  const handleRowDelete = useCallback(
    (id: string) => {
      void handleDeleteOrders([id]);
    },
    [handleDeleteOrders],
  );

  const emptyState = useMemo(() => {
    if (isLoading) return null;
    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No orders yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add your first order to get started.
          </p>
        </div>
      );
    }
    if (debouncedSearchTerm) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <SearchX className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No orders match &quot;{debouncedSearchTerm}&quot;
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Try a different search term or clear your search.
          </p>
        </div>
      );
    }
    if (statusFilter !== "all") {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No orders match these filters
          </h3>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-800"
          >
            Clear filters
          </button>
        </div>
      );
    }
    return null;
  }, [clearFilters, debouncedSearchTerm, isLoading, orders.length, statusFilter]);

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
              Track, manage and organize customer orders
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
                clearFilters();
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
          debouncedSearchTerm={debouncedSearchTerm}
          statusFilter={statusFilter}
          totalCount={orders.length}
          filteredCount={filteredOrders.length}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
        />
        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error?.message ?? "Could not load orders."}
          </div>
        ) : null}
        <OrdersTable
          orders={filteredOrders}
          density={density}
          onDensityChange={setDensity}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          sorting={sorting}
          onSortingChange={setSorting}
          cancellingOrderId={updateOrderStatus.isPending ? cancellingOrderId : null}
          deletingOrderId={deleteOrder.isPending ? deletingOrderId : null}
          onCancel={handleCancelOrder}
          onDelete={handleDeleteOrders}
          onRowDelete={handleRowDelete}
          onRowClick={setDrawerOrder}
          isLoading={isLoading}
          totalRows={filteredOrders.length}
          emptyState={emptyState}
        />
      </div>

      <OrderDetailDrawer
        order={drawerOrder}
        open={Boolean(drawerOrder)}
        onOpenChange={(open) => {
          if (!open) setDrawerOrder(null);
        }}
      />
    </div>
  );
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
