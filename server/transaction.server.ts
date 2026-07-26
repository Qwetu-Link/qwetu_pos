import { getTransactionsQuery } from "@/db/queries/transaction";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to view transactions.",
        });
    }

    return businessId;
}

export const transactionRouter = createTRPCRouter({
    getTransactions: baseProcedure.query(async ({ ctx }) => {
        const businessId = ensureBusinessId(ctx.businessId);

        return getTransactionsQuery(businessId);
    }),
});
