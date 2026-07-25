"use client";

import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { Customer, CustomerFormData, Order, OrderFormData, LineItem } from "../types/customer";
import {
  filterCustomers, computeOrderTotal,
} from "../utils/customerUtils";
import { useGetOrders } from "./useOrders";

const EMPTY_CUSTOMERS: Customer[] = [];

export function useCustomers() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const customersQuery = useQuery(trpc.customers.getCustomers.queryOptions());
  const ordersQuery = useGetOrders();
  const customers = customersQuery.data ?? EMPTY_CUSTOMERS;
  const orders = ordersQuery.orders;
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

  const createCustomerMutation = useMutation(
    trpc.customers.addCustomer.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.customers.pathFilter());
      },
    })
  );

  const updateCustomerMutation = useMutation(
    trpc.customers.editCustomer.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.customers.pathFilter());
      },
    })
  );

  const deleteCustomerMutation = useMutation(
    trpc.customers.removeCustomer.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.customers.pathFilter());
      },
    })
  );

  const addCustomer = useCallback(async (data: CustomerFormData) => {
    return createCustomerMutation.mutateAsync(data);
  }, [createCustomerMutation]);

  const updateCustomer = useCallback(async (id: string, data: CustomerFormData) => {
    return updateCustomerMutation.mutateAsync({
      id,
      ...data,
    });
  }, [updateCustomerMutation]);

  const deleteCustomer = useCallback(async (id: string) => {
    await deleteCustomerMutation.mutateAsync({ id });
  }, [deleteCustomerMutation]);

  const getById = useCallback(
    (identifier: string) =>
      customers.find(
        (customer) => customer.id === identifier || customer.slug === identifier,
      ) ?? null,
    [customers],
  );

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
    isLoading: customersQuery.isLoading || ordersQuery.isLoading,
    isError: customersQuery.isError || ordersQuery.isError,
    error: customersQuery.error ?? ordersQuery.error,
    createError: createCustomerMutation.error,
    updateError: updateCustomerMutation.error,
    deleteError: deleteCustomerMutation.error,
    isCreating: createCustomerMutation.isPending,
    isUpdating: updateCustomerMutation.isPending,
    isDeleting: deleteCustomerMutation.isPending,
    search, setSearch: handleSetSearch, currentPage: safeCurrentPage, setCurrentPage: handleSetCurrentPage,
    perPage, setPerPage: handleSetPerPage, totalPages,
    addCustomer, updateCustomer, deleteCustomer,
    getById, getOrdersByCustomer, createOrder,
  };
}
