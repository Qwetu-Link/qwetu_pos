import {
    createOrderQuery,
    deleteOrderQuery,
    getOrderByIdQuery,
    getOrdersQuery,
    updateOrderQuery,
    updateOrderStatusQuery,
} from "@/db/queries/order";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
    orderCreateSchema,
    orderEditSchema,
    orderIdSchema,
    orderStatusSchema,
} from "@/validators/order";
import { TRPCError } from "@trpc/server";

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to manage orders.",
        });
    }

    return businessId;
}

function ensureOrderExists<T>(order: T | undefined) {
    if (!order) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found for this business.",
        });
    }

    return order;
}

function getFriendlyOrderError(error: unknown, action: "create" | "update" | "delete"): never {
    if (error instanceof TRPCError) {
        throw error;
    }

    console.error("RAW ORDER ERROR:", error);

    const fallbackMessage =
        action === "create"
            ? "Could not create the order. Please check the details and try again."
            : action === "update"
                ? "Could not update the order. Please check the details and try again."
                : "Could not delete the order. Please try again.";

    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: fallbackMessage,
    });
}

export const orderRouter = createTRPCRouter({
    getOrders: baseProcedure.query(async ({ ctx }) => {
        const businessId = ensureBusinessId(ctx.businessId);

        return getOrdersQuery(businessId);
    }),

    getOrderById: baseProcedure
        .input(orderIdSchema)
        .query(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);
            const order = await getOrderByIdQuery({
                id: input.id,
                businessId,
            });

            return ensureOrderExists(order);
        }),

    addOrder: baseProcedure
        .input(orderCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const order = await createOrderQuery({
                    ...input,
                    businessId,
                });

                return ensureOrderExists(order);
            } catch (error) {
                getFriendlyOrderError(error, "create");
            }
        }),

    editOrder: baseProcedure
        .input(orderEditSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const order = await updateOrderQuery({
                    ...input,
                    businessId,
                });

                return ensureOrderExists(order);
            } catch (error) {
                getFriendlyOrderError(error, "update");
            }
        }),

    updateStatus: baseProcedure
        .input(orderStatusSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const order = await updateOrderStatusQuery({
                    ...input,
                    businessId,
                });

                return ensureOrderExists(order);
            } catch (error) {
                getFriendlyOrderError(error, "update");
            }
        }),

    removeOrder: baseProcedure
        .input(orderIdSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const order = await deleteOrderQuery({
                    id: input.id,
                    businessId,
                });

                return ensureOrderExists(order);
            } catch (error) {
                getFriendlyOrderError(error, "delete");
            }
        }),
});
