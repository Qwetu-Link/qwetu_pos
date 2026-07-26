import { getDashboardSummaryQuery } from "@/db/queries/dashboard";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to view dashboard data.",
        });
    }

    return businessId;
}

export const dashboardRouter = createTRPCRouter({
    getSummary: baseProcedure.query(async ({ ctx }) => {
        return getDashboardSummaryQuery(ensureBusinessId(ctx.businessId));
    }),
});
