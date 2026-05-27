"use client";

import { useState, useCallback, useMemo } from "react";
import type { Customer, CustomerFormData, Order, OrderFormData, LineItem } from "../types/customer";
import { initialOrders } from "../data/orderData";
import {
  DEMO_CUSTOMERS,
  filterCustomers, generateCustomerId, generateOrderId,
  getPaymentScoreFromRisk, computeOrderTotal,
} from "../lib/customerUtils";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => filterCustomers(customers, search), [customers, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safeCurrentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, safeCurrentPage, perPage]);

  const handleSetSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleSetPerPage = useCallback((value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const addCustomer = useCallback((data: CustomerFormData): Customer => {
    const newCustomer: Customer = {
      id: generateCustomerId(customers),
      name: data.name, email: data.email, phone: data.phone,
      totalOrders: 0, totalSpent: 0, activeInstallments: 0,
      paymentScore: getPaymentScoreFromRisk(data.riskLevel),
      riskLevel: data.riskLevel, segment: data.segment,
      joinedDate: new Date().toISOString().slice(0, 10),
      lastPurchase: new Date().toISOString().slice(0, 10),
      address: data.address,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  }, [customers]);

  const updateCustomer = useCallback((id: string, data: CustomerFormData): Customer | null => {
    let updated: Customer | null = null;
    setCustomers((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      updated = { ...c, ...data, paymentScore: getPaymentScoreFromRisk(data.riskLevel) };
      return updated;
    }));
    return updated;
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getById = useCallback((id: string) => customers.find((c) => c.id === id) ?? null, [customers]);

  const getOrdersByCustomer = useCallback((customerId: string) =>
    orders.filter((o) => o.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders]
  );

  const createOrder = useCallback((
    customer: Customer,
    formData: OrderFormData,
    lineItems: LineItem[]
  ): Order => {
    const total = computeOrderTotal(lineItems);
    const amountPaid = formData.paymentType === "full"
      ? total
      : Math.min(Number(formData.amountPaid || 0), total);
    const remainingAmount = Math.max(0, total - amountPaid);
    const paymentType = formData.paymentType === "installment" && remainingAmount > 0 ? "installment" : "full";

    const newOrder: Order = {
      id: generateOrderId(),
      customerId: customer.id,
      customer: customer.name,
      email: customer.email,
      phone: customer.phone,
      items: lineItems.reduce((s, i) => s + i.qty, 0),
      total,
      amountPaid,
      remainingAmount,
      paymentStatus: remainingAmount > 0 ? "partial" : "paid",
      paymentType,
      installmentPlan: paymentType === "installment" ? formData.installmentPlan : undefined,
      installmentStartDate: paymentType === "installment" ? formData.startDate : undefined,
      status: formData.status,
      createdAt: new Date().toISOString(),
      shippingAddress: customer.address,
      lineItems,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer stats
    setCustomers((prev) => prev.map((c) => {
      if (c.id !== customer.id) return c;
      return {
        ...c,
        totalOrders: c.totalOrders + 1,
        totalSpent: c.totalSpent + total,
        activeInstallments: c.activeInstallments + (paymentType === "installment" ? 1 : 0),
        lastPurchase: new Date().toISOString().slice(0, 10),
      };
    }));

    return newOrder;
  }, []);

  return {
    customers, orders, filtered, paginated,
    search, setSearch: handleSetSearch, currentPage: safeCurrentPage, setCurrentPage: handleSetCurrentPage,
    perPage, setPerPage: handleSetPerPage, totalPages,
    addCustomer, updateCustomer, deleteCustomer,
    getById, getOrdersByCustomer, createOrder,
  };
}
