"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useDashboardSummary = () => {
    const trpc = useTRPC();
    const query = useQuery(trpc.dashboard.getSummary.queryOptions());

    return {
        ...query,
        summary: query.data ?? null,
    };
};
