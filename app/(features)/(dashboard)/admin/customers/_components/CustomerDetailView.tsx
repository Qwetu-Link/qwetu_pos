"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleUser, ShoppingBag } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { useCustomersContext } from "./CustomersContext";
import type { OrderFormData, LineItem } from "@/types/customer";
import { CustomerProfilePanel } from "./CustomerProfilePanel";
import { OrdersTable } from "./OrdersTable";
import { NewOrderModal } from "./NewOrderModal";

interface CustomerDetailViewProps {
  customerId: string;
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const { getById, getOrdersByCustomer, createOrder } = useCustomersContext();

  const customer = getById(customerId);
  const orders = customer ? getOrdersByCustomer(customerId) : [];

  const [newOrderOpen, setNewOrderOpen] = useState(false);

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm max-w-md">
          <CircleUser size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Customer not found</h2>
          <p className="text-slate-500 mb-6">
            No customer with ID <span className="font-mono">{customerId}</span> exists.
          </p>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateOrder = (formData: OrderFormData, lineItems: LineItem[]) => {
    createOrder(customer, formData, lineItems);
    setNewOrderOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">

        {/* Breadcrumb / nav */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm"
          >
            <ArrowLeft size={15} /> Back to Customers
          </Link>
          <div className="text-sm text-slate-500 bg-white/80 rounded-full px-4 py-1.5 shadow-sm border border-slate-200 flex items-center gap-1.5">
            <CircleUser size={14} /> Customer 360°
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* LEFT: Profile */}
          <div className="lg:col-span-1">
            <CustomerProfilePanel customer={customer} />
          </div>

          {/* RIGHT: Orders */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingBag size={22} className="text-emerald-600" />
                Customer Orders
                <span className="text-base font-normal text-slate-400">
                  ({orders.length})
                </span>
              </h2>
              <button
                onClick={() => setNewOrderOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm hover:-translate-y-0.5"
              >
                <ShoppingCart size={15} /> + New Order
              </button>
            </div>

            <OrdersTable orders={orders} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewOrderModal
        customer={customer}
        isOpen={newOrderOpen}
        onClose={() => setNewOrderOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}
