import {
    adjustVariantInventoryQuery,
    createPurchaseOrderQuery,
    getPurchaseOrdersQuery,
    getStockAdjustmentLogsQuery,
    receivePurchaseOrderQuery,
    transferVariantInventoryQuery,
} from "@/db/queries/inventory";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
    adjustInventorySchema,
    createPurchaseOrderSchema,
    inventoryVariantSchema,
    purchaseOrderIdSchema,
    transferInventorySchema,
} from "@/db/schema/validators/inventory";
import { TRPCError } from "@trpc/server";

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to manage inventory.",
        });
    }

    return businessId;
}

function getInventoryError(error: unknown): never {
    const message = error instanceof Error ? error.message : "";

    if (
        message.includes("Insufficient stock") ||
        message.includes("Inventory location was not found") ||
        message.includes("Could not create default stock locations") ||
        message.includes("Purchase order") ||
        message.includes("already been received") ||
        message.includes("already has a linked expense") ||
        message.includes("not found for this business")
    ) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message,
        });
    }

    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not update inventory. Please try again.",
    });
}

export const inventoryRouter = createTRPCRouter({
    getPurchaseOrders: baseProcedure.query(async ({ ctx }) => {
        const businessId = ensureBusinessId(ctx.businessId);

        try {
            return await getPurchaseOrdersQuery(businessId);
        } catch (error) {
            getInventoryError(error);
        }
    }),

    getAdjustmentLogs: baseProcedure.query(async ({ ctx }) => {
        const businessId = ensureBusinessId(ctx.businessId);

        try {
            return await getStockAdjustmentLogsQuery({ businessId });
        } catch (error) {
            getInventoryError(error);
        }
    }),

    getVariantAdjustmentLogs: baseProcedure
        .input(inventoryVariantSchema)
        .query(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await getStockAdjustmentLogsQuery({
                    businessId,
                    variantId: input.variantId,
                });
            } catch (error) {
                getInventoryError(error);
            }
        }),

    adjustStock: baseProcedure
        .input(adjustInventorySchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await adjustVariantInventoryQuery({
                    businessId,
                    variantId: input.variantId,
                    locationName: input.location,
                    quantity: input.quantity,
                    reason: input.reason,
                    notes: input.notes,
                    adjustedBy: ctx.userId,
                });
            } catch (error) {
                getInventoryError(error);
            }
        }),

    createPurchaseOrder: baseProcedure
        .input(createPurchaseOrderSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await createPurchaseOrderQuery({
                    businessId,
                    variantId: input.variantId,
                    supplierName: input.supplierName,
                    quantity: input.quantity,
                    notes: input.notes,
                    createdBy: ctx.userId,
                });
            } catch (error) {
                getInventoryError(error);
            }
        }),

    receivePurchaseOrder: baseProcedure
        .input(purchaseOrderIdSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await receivePurchaseOrderQuery({
                    businessId,
                    id: input.id,
                    receivedBy: ctx.userId,
                });
            } catch (error) {
                getInventoryError(error);
            }
        }),

    transferStock: baseProcedure
        .input(transferInventorySchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await transferVariantInventoryQuery({
                    businessId,
                    variantId: input.variantId,
                    fromLocationName: input.from,
                    toLocationName: input.to,
                    quantity: input.quantity,
                });
            } catch (error) {
                getInventoryError(error);
            }
        }),
});
