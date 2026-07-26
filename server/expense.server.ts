import {
    createExpenseQuery,
    deleteExpenseQuery,
    getExpenseByIdQuery,
    getExpensesQuery,
    updateExpenseQuery,
    updateExpenseStatusQuery,
} from "@/db/queries/expense";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
    expenseCreateSchema,
    expenseEditSchema,
    expenseIdSchema,
    expenseStatusSchema,
} from "@/validators/expense";
import { TRPCError } from "@trpc/server";

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to manage expenses.",
        });
    }

    return businessId;
}

function ensureExpenseExists<T>(expense: T | undefined) {
    if (!expense) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Expense not found for this business.",
        });
    }

    return expense;
}

export const expenseRouter = createTRPCRouter({
    getExpenses: baseProcedure.query(async ({ ctx }) => {
        return getExpensesQuery(ensureBusinessId(ctx.businessId));
    }),

    getExpenseById: baseProcedure
        .input(expenseIdSchema)
        .query(async ({ input, ctx }) => {
            const expense = await getExpenseByIdQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureExpenseExists(expense);
        }),

    addExpense: baseProcedure
        .input(expenseCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const expense = await createExpenseQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureExpenseExists(expense);
        }),

    editExpense: baseProcedure
        .input(expenseEditSchema)
        .mutation(async ({ input, ctx }) => {
            const expense = await updateExpenseQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureExpenseExists(expense);
        }),

    updateStatus: baseProcedure
        .input(expenseStatusSchema)
        .mutation(async ({ input, ctx }) => {
            const expense = await updateExpenseStatusQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureExpenseExists(expense);
        }),

    removeExpense: baseProcedure
        .input(expenseIdSchema)
        .mutation(async ({ input, ctx }) => {
            const expense = await deleteExpenseQuery({
                ...input,
                businessId: ensureBusinessId(ctx.businessId),
            });

            return ensureExpenseExists(expense);
        }),
});
