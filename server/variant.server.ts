import {
    createVariantQuery,
    deleteVariantQuery,
    getVariantByIdQuery,
    getVariantsQuery,
    updateVariantQuery,
} from "@/db/queries/variant";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
    variantCreateSchema,
    variantEditSchema,
    variantIdSchema,
} from "@/validators/variant";
import { TRPCError } from "@trpc/server";

type DatabaseError = {
    code?: string;
    constraint_name?: string;
    constraint?: string;
};

function getDatabaseError(error: unknown): DatabaseError {
    return typeof error === "object" && error !== null ? error : {};
}

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to manage product variants.",
        });
    }

    return businessId;
}

function getFriendlyVariantError(error: unknown, action: "create" | "update" | "delete"): never {
    const databaseError = getDatabaseError(error);
    const constraint = databaseError.constraint_name ?? databaseError.constraint;

    if (databaseError.code === "23505" && constraint === "unique_variant") {
        throw new TRPCError({
            code: "CONFLICT",
            message: "This product already has a variant with the same color and size.",
        });
    }

    if (databaseError.code === "23505" && constraint === "unique_sku") {
        throw new TRPCError({
            code: "CONFLICT",
            message: "A variant with this SKU already exists.",
        });
    }

    if (databaseError.code === "23503") {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The selected product does not exist.",
        });
    }

    const fallbackMessage =
        action === "create"
            ? "Could not create the variant. Please check the details and try again."
            : action === "update"
                ? "Could not update the variant. Please check the details and try again."
                : "Could not delete the variant. Please try again.";

    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: fallbackMessage,
    });
}

export const variantRouter = createTRPCRouter({
    getVariants: baseProcedure.query(async () => {
        return getVariantsQuery();
    }),

    getVariantById: baseProcedure
        .input(variantIdSchema)
        .query(async ({ input }) => {
            return getVariantByIdQuery(input.id);
        }),

    addVariant: baseProcedure
        .input(variantCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await createVariantQuery({
                    ...input,
                    businessId,
                });
            } catch (error) {
                getFriendlyVariantError(error, "create");
            }
        }),

    editVariant: baseProcedure
        .input(variantEditSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await updateVariantQuery({
                    ...input,
                    businessId,
                });
            } catch (error) {
                getFriendlyVariantError(error, "update");
            }
        }),

    removeVariant: baseProcedure
        .input(variantIdSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await deleteVariantQuery({
                    id: input.id,
                    businessId,
                });
            } catch (error) {
                getFriendlyVariantError(error, "delete");
            }
        }),
});
