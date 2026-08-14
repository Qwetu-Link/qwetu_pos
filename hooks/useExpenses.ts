"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useOfflineMutation } from "./useOfflineMutation";

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

    return useOfflineMutation(
        trpc.expenses.addExpense.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
        { procedure: "expenses.addExpense", label: "Create expense" },
    );
};

export const useUpdateExpense = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.expenses.editExpense.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
        { procedure: "expenses.editExpense", label: "Update expense" },
    );
};

export const useUpdateExpenseStatus = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.expenses.updateStatus.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
        { procedure: "expenses.updateStatus", label: "Update expense status" },
    );
};

export const useDeleteExpense = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useOfflineMutation(
        trpc.expenses.removeExpense.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.expenses.pathFilter());
                await queryClient.invalidateQueries(trpc.transactions.pathFilter());
            },
        }),
        { procedure: "expenses.removeExpense", label: "Delete expense" },
    );
};
