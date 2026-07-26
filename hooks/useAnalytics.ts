"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { AnalyticsPeriod } from "@/types/analytics";

export const useAnalyticsSummary = (period: AnalyticsPeriod = "last_6_months") => {
    const trpc = useTRPC();
    const query = useQuery(trpc.analytics.getSummary.queryOptions({ period }));

    return {
        ...query,
        analytics: query.data ?? null,
    };
};
