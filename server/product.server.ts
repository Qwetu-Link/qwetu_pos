import {
    createProductWithRelationsQuery,
    deleteProductQuery,
    getProductByIdQuery,
    getProductsQuery,
    updateProductQuery,
    uploadProductImagesQuery,
} from "@/db/queries/product";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { ProductImageUpload } from "@/services/processImg";
import {
    productCreateSchema,
    productEditSchema,
    productIdSchema,
    productImageUploadSchema,
} from "@/validators/product";
import { TRPCError } from "@trpc/server";

type DatabaseError = {
    code?: string;
    constraint_name?: string;
    constraint?: string;
};

function getDatabaseError(error: unknown): DatabaseError {
    return typeof error === "object" && error !== null ? error : {};
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "";
}

function imageDataToUpload(imageData: string): ProductImageUpload {
    const match = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!match) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid image upload data.",
        });
    }

    const [, mimeType, base64] = match;
    const buffer = Buffer.from(base64, "base64");

    return {
        buffer,
        mimeType,
        fileSize: buffer.length,
    };
}

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to manage products.",
        });
    }

    return businessId;
}

function getFriendlyProductError(error: unknown, action: "create" | "update" | "delete" | "upload"): never {
    const databaseError = getDatabaseError(error);
    const constraint = databaseError.constraint_name ?? databaseError.constraint;
    const errorMessage = getErrorMessage(error);

    if (
        errorMessage.includes("Supabase storage is not configured") ||
        errorMessage.includes("Only JPEG, PNG, and WEBP") ||
        errorMessage.includes("Product images must") ||
        errorMessage.includes("Could not read image dimensions")
    ) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: errorMessage,
        });
    }

    if (databaseError.code === "23503") {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The selected product, category, or business record does not exist.",
        });
    }

    if (databaseError.code === "23505" && constraint === "unique_sku") {
        throw new TRPCError({
            code: "CONFLICT",
            message: "One of the variant SKUs already exists.",
        });
    }

    const fallbackMessage =
        action === "create"
            ? "Could not create the product. Please check the details and try again."
            : action === "update"
                ? "Could not update the product. Please check the details and try again."
                : action === "upload"
                    ? "Could not upload the product image. Please try again."
                    : "Could not delete the product. Please try again.";

    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: fallbackMessage,
    });
}

export const productRouter = createTRPCRouter({
    getProducts: baseProcedure.query(async ({ ctx }) => {
        const businessId = ensureBusinessId(ctx.businessId);

        return getProductsQuery(businessId);
    }),

    getProductById: baseProcedure
        .input(productIdSchema)
        .query(async ({ input }) => {
            return getProductByIdQuery(input.id);
        }),

    addProduct: baseProcedure
        .input(productCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await createProductWithRelationsQuery({
                    ...input,
                    businessId,
                    images: (input.imagesData ?? (input.imageData ? [input.imageData] : []))
                        .map(imageDataToUpload),
                });
            } catch (error) {
                console.error("RAW PRODUCT CREATE ERROR:", error);
                getFriendlyProductError(error, "create");
            }
        }),

    editProduct: baseProcedure
        .input(productEditSchema)
        .mutation(async ({ input }) => {
            try {
                return await updateProductQuery(input);
            } catch (error) {
                getFriendlyProductError(error, "update");
            }
        }),

    uploadProductImage: baseProcedure
        .input(productImageUploadSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await uploadProductImagesQuery({
                    businessId,
                    productId: input.productId,
                    files: [imageDataToUpload(input.imageData)],
                });
            } catch (error) {
                getFriendlyProductError(error, "upload");
            }
        }),

    removeProduct: baseProcedure
        .input(productIdSchema)
        .mutation(async ({ input }) => {
            try {
                return await deleteProductQuery(input.id);
            } catch (error) {
                getFriendlyProductError(error, "delete");
            }
        }),
});
