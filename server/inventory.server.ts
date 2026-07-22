import {
    adjustVariantInventoryQuery,
    transferVariantInventoryQuery,
} from "@/db/queries/inventory";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
    adjustInventorySchema,
    transferInventorySchema,
} from "@/validators/inventory";
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
        message.includes("Could not create default stock locations")
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
