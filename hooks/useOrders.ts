"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

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

    return useMutation(
        trpc.orders.addOrder.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
    );
};

export const useUpdateOrder = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.orders.editOrder.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
    );
};

export const useUpdateOrderStatus = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.orders.updateStatus.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.products.pathFilter());
                await queryClient.invalidateQueries(trpc.inventory.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
    );
};

export const useRecordOrderPayment = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.orders.recordPayment.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
    );
};

export const useDeleteOrder = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.orders.removeOrder.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.orders.pathFilter());
                await queryClient.invalidateQueries(trpc.customers.pathFilter());
            },
        }),
    );
};
