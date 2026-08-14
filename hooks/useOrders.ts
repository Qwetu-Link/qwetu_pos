"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useOfflineMutation } from "./useOfflineMutation";

export const useGetOrders = () => {
    const trpc = useTRPC();
    const query = useQuery(trpc.orders.getOrders.queryOptions());

    return {
        ...query,
        orders: query.data ?? [],
    };
};

export const useGetOrder = (id?: string) => {
    const trpc = useTRPC();
    const query = useQuery(
        trpc.orders.getOrderById.queryOptions(
            { id: id ?? "" },
            { enabled: Boolean(id) },
        ),
    );

    return {
        ...query,
        order: query.data ?? null,
    };
};

export const useCreateOrder = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.orders.addOrder.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
        { procedure: "orders.addOrder", label: "Create order" },
    );
};

export const useUpdateOrder = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.orders.editOrder.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
        { procedure: "orders.editOrder", label: "Update order" },
    );
};

export const useUpdateOrderStatus = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.orders.updateStatus.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.products.pathFilter());
                await queryClient.invalidateQueries(trpc.inventory.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
        { procedure: "orders.updateStatus", label: "Update order status" },
    );
};

export const useRecordOrderPayment = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.orders.recordPayment.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
        { procedure: "orders.recordPayment", label: "Record order payment" },
    );
};

export const useDeleteOrder = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.orders.removeOrder.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
        { procedure: "orders.removeOrder", label: "Delete order" },
    );
};
