"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useGetExpenses = () => {
    const trpc = useTRPC();
    const query = useQuery(trpc.expenses.getExpenses.queryOptions());

    return {
        ...query,
        expenses: query.data ?? [],
    };
};

export const useGetExpense = (id?: string) => {
    const trpc = useTRPC();
    const query = useQuery(
        trpc.expenses.getExpenseById.queryOptions(
            { id: id ?? "" },
            { enabled: Boolean(id) },
        ),
    );

    return {
        ...query,
        expense: query.data ?? null,
    };
};

export const useCreateExpense = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.expenses.addExpense.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
    );
};

export const useUpdateExpense = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.expenses.editExpense.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
    );
};

export const useUpdateExpenseStatus = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.expenses.updateStatus.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
    );
};

export const useDeleteExpense = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.expenses.removeExpense.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
    );
};
