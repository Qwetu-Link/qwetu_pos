"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useGetTransactions = () => {
    const trpc = useTRPC();
    const query = useQuery(trpc.transactions.getTransactions.queryOptions());

    return {
        ...query,
        transactions: query.data ?? [],
    };
};
