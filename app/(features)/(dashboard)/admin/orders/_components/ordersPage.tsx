"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Grid2X2,
  List,
  Plus,
  ReceiptText,
  RefreshCw,
  Table2,
} from "lucide-react";
import AddOrderModal from "./addOrderModal";
import { initialOrders } from "../../../../../../data/orderData";
import OrderFilters from "./orderFilters";
import Pagination from "@/components/Pagination";
import OrderStatsCards from "./orderStatsCards";
import { Order, OrderStatus } from "../../../../../../types/orderTypes";
import OrdersTable, { OrderViewMode } from "./ordersTable";
import type { Customer } from "@/types/customer";
import { DEMO_CUSTOMERS } from "@/lib/customerUtils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [viewMode, setViewMode] = useState<OrderViewMode>("table");

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
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customer.toLowerCase().includes(normalizedSearch) ||
        order.email.toLowerCase().includes(normalizedSearch) ||
        order.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / perPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * perPage,
    safeCurrentPage * perPage,
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: OrderStatus | "all") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
              <ReceiptText className="h-8 w-8 text-emerald-600" />
              Order Pipeline
            </h1>
            <p className="mt-1 text-slate-500">
              Track, manage and manually add customer orders
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 font-medium text-white transition hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Manual Add Order
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCurrentPage(1);
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
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
        <div className="flex justify-end">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {[
              { value: "table", label: "Table", icon: Table2 },
              { value: "card", label: "Cards", icon: Grid2X2 },
              { value: "list", label: "List", icon: List },
            ].map((option) => {
              const Icon = option.icon;
              const isActive = viewMode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setViewMode(option.value as OrderViewMode)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <OrdersTable orders={paginatedOrders} viewMode={viewMode} />
        <Pagination
          currentPage={safeCurrentPage}
          totalItems={filteredOrders.length}
          perPage={perPage}
          onPageChange={setCurrentPage}
          onPerPageChange={handlePerPageChange}
        />
      </div>

      {isAddModalOpen && (
        <AddOrderModal
          orders={orders}
          customers={customers}
          onAdd={(order) => {
            setOrders((currentOrders) => [order, ...currentOrders]);
            setIsAddModalOpen(false);
          }}
          onAddCustomer={(customer) => {
            setCustomers((currentCustomers) => [customer, ...currentCustomers]);
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}
