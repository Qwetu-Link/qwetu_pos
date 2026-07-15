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

function getFriendlyCategoryError(error: unknown, action: "create" | "update" | "delete"): never {
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
    getCategories: baseProcedure.query(async () => {
        return getCategoriesQuery();
    }),

    getCategoryById: baseProcedure
        .input(categoryIdSchema)
        .query(async ({ input }) => {
            return getCategoryByIdQuery(input.id);
        }),

    addCategory: baseProcedure
        .input(categorySchema)
        .mutation(async ({ input, ctx }) => {
            if (!ctx.businessId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be signed in to create a category.",
                });
            }

            try {
                return await createCategoryQuery({
                    ...input,
                    businessId: ctx.businessId,
                });
            } catch (error) {
                getFriendlyCategoryError(error, "create");
            }
        }),

    editCategory: baseProcedure
        .input(editCategorySchema)
        .mutation(async ({ input }) => {
            try {
                return await updateCategoryQuery(input);
            } catch (error) {
                getFriendlyCategoryError(error, "update");
            }
        }),

    removeCategory: baseProcedure
        .input(categoryIdSchema)
        .mutation(async ({ input }) => {
            try {
                return await deleteCategoryQuery(input.id);
            } catch (error) {
                getFriendlyCategoryError(error, "delete");
            }
        }),
});
