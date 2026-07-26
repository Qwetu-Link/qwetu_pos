import { getAnalyticsSummaryQuery } from "@/db/queries/analytics";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

const analyticsSummarySchema = z.object({
    period: z.enum(["last_3_months", "last_6_months", "last_12_months"]).default("last_6_months"),
});

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to view analytics.",
        });
    }

    return businessId;
}

export const analyticsRouter = createTRPCRouter({
    getSummary: baseProcedure
        .input(analyticsSummarySchema.optional())
        .query(async ({ input, ctx }) => {
            return getAnalyticsSummaryQuery(
                ensureBusinessId(ctx.businessId),
                input?.period ?? "last_6_months",
            );
        }),
});
