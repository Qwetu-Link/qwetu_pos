import {
    createCategoryQuery,
    deleteCategoryQuery,
    getCategoriesQuery,
    getCategoryByIdQuery,
    updateCategoryQuery,
} from "@/db/queries/category";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import {
    categoryIdSchema,
    categorySchema,
    editCategorySchema,
} from "@/validators/category";

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
            message: "You must be signed in to manage categories.",
        });
    }

    return businessId;
}

function ensureCategoryExists<T>(category: T | undefined) {
    if (!category) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found for this business.",
        });
    }

    return category;
}

function getFriendlyCategoryError(error: unknown, action: "create" | "update" | "delete"): never {
    if (error instanceof TRPCError) {
        throw error;
    }

    const databaseError = getDatabaseError(error);
    const constraint = databaseError.constraint_name ?? databaseError.constraint;

    if (databaseError.code === "23505" && constraint === "category_business_name_idx") {
        throw new TRPCError({
            code: "CONFLICT",
            message: "A category with this name already exists.",
        });
    }

    if (databaseError.code === "23503" && action === "delete") {
        throw new TRPCError({
            code: "CONFLICT",
            message: "This category is being used by products and cannot be deleted.",
        });
    }

    const fallbackMessage =
        action === "create"
            ? "Could not create the category. Please check the details and try again."
            : action === "update"
                ? "Could not update the category. Please check the details and try again."
                : "Could not delete the category. Please try again.";

    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: fallbackMessage,
    });
}

export const categoryRouter = createTRPCRouter({
    getCategories: baseProcedure.query(async ({ ctx }) => {
        const businessId = ensureBusinessId(ctx.businessId);

        return getCategoriesQuery(businessId);
    }),

    getCategoryById: baseProcedure
        .input(categoryIdSchema)
        .query(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);
            const category = await getCategoryByIdQuery({
                id: input.id,
                businessId,
            });

            return ensureCategoryExists(category);
        }),

    addCategory: baseProcedure
        .input(categorySchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await createCategoryQuery({
                    ...input,
                    businessId,
                });
            } catch (error) {
                getFriendlyCategoryError(error, "create");
            }
        }),

    editCategory: baseProcedure
        .input(editCategorySchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const category = await updateCategoryQuery({
                    ...input,
                    businessId,
                });

                return ensureCategoryExists(category);
            } catch (error) {
                getFriendlyCategoryError(error, "update");
            }
        }),

    removeCategory: baseProcedure
        .input(categoryIdSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const category = await deleteCategoryQuery({
                    id: input.id,
                    businessId,
                });

                return ensureCategoryExists(category);
            } catch (error) {
                getFriendlyCategoryError(error, "delete");
            }
        }),
});
