"use client";

import { useState, useCallback, useMemo } from "react";
import type { Customer, CustomerFormData, Order, OrderFormData, LineItem } from "../types/customer";
import { initialOrders } from "../data/orderData";
import {
  DEMO_CUSTOMERS,
  filterCustomers, computeOrderTotal,
} from "../lib/customerUtils";

export function useCustomers() {
  const customers = DEMO_CUSTOMERS;
  const orders = initialOrders;
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

  const addCustomer = useCallback((data: CustomerFormData) => {
    void data;
    return null;
  }, []);

  const updateCustomer = useCallback((id: string, data: CustomerFormData) => {
    void id;
    void data;
    return null;
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    void id;
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
  ): Order | null => {
    const total = computeOrderTotal(lineItems);
    const amountPaid = formData.paymentType === "full"
      ? total
      : Math.min(Number(formData.amountPaid || 0), total);
    const remainingAmount = Math.max(0, total - amountPaid);
    const paymentType = formData.paymentType === "installment" && remainingAmount > 0 ? "installment" : "full";

    void total;
    void amountPaid;
    void remainingAmount;
    void paymentType;
    return null;
  }, []);

  return {
    customers, orders, filtered, paginated,
    search, setSearch: handleSetSearch, currentPage: safeCurrentPage, setCurrentPage: handleSetCurrentPage,
    perPage, setPerPage: handleSetPerPage, totalPages,
    addCustomer, updateCustomer, deleteCustomer,
    getById, getOrdersByCustomer, createOrder,
  };
}
