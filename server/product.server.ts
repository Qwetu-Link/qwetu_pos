import {
    createProductWithRelationsQuery,
    deleteProductQuery,
    getProductByIdQuery,
    getProductDetailsQuery,
    getProductsQuery,
    removeProductImagesQuery,
    replaceProductImagesQuery,
    saveUploadedProductImagesQuery,
    updateProductImageAssignmentsQuery,
    updateProductQuery,
    uploadProductImagesQuery,
} from "@/db/queries/product";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { ProductImageUpload } from "@/services/processImg";
import {
    productCreateSchema,
    productEditSchema,
    productIdSchema,
    productImageRemoveSchema,
    productImageReplaceSchema,
    productImageUploadSchema,
    productUploadedImagesSaveSchema,
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

function imageAttachmentsToUploads(
    attachments?: { imageData: string; variantId?: string | null }[],
) {
    return attachments?.map((attachment) => ({
        ...imageDataToUpload(attachment.imageData),
        variantId: attachment.variantId,
        variantClientId: attachment.variantId,
    }));
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

function ensureProductExists<T>(product: T | undefined) {
    if (!product) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found for this business.",
        });
    }

    return product;
}

function getFriendlyProductError(error: unknown, action: "create" | "update" | "delete" | "upload"): never {
    if (error instanceof TRPCError) {
        throw error;
    }

    const databaseError = getDatabaseError(error);
    const constraint = databaseError.constraint_name ?? databaseError.constraint;
    const errorMessage = getErrorMessage(error);

    if (
        errorMessage.includes("Supabase storage is not configured") ||
        errorMessage.includes("Only JPEG, PNG, and WEBP") ||
        errorMessage.includes("Product images must") ||
        errorMessage.includes("Could not read image dimensions") ||
        errorMessage.includes("does not belong to this business") ||
        errorMessage.includes("not found for this business")
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
        .query(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);
            const product = await getProductByIdQuery({
                id: input.id,
                businessId,
            });

            return ensureProductExists(product);
        }),

    getProductDetails: baseProcedure
        .input(productIdSchema)
        .query(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);
            const product = await getProductDetailsQuery({
                id: input.id,
                businessId,
            });

            return ensureProductExists(product);
        }),

    addProduct: baseProcedure
        .input(productCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const imageUploads =
                    imageAttachmentsToUploads(input.imageAttachments) ??
                    (input.imagesData ?? (input.imageData ? [input.imageData] : []))
                        .map(imageDataToUpload);

                return await createProductWithRelationsQuery({
                    ...input,
                    businessId,
                    images: imageUploads,
                });
            } catch (error) {
                console.error("RAW PRODUCT CREATE ERROR:", error);
                getFriendlyProductError(error, "create");
            }
        }),

    editProduct: baseProcedure
        .input(productEditSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const product = await updateProductQuery({
                    ...input,
                    businessId,
                });

                if (input.imageAssignments?.length) {
                    await updateProductImageAssignmentsQuery({
                        businessId,
                        productId: input.id,
                        assignments: input.imageAssignments,
                    });
                }

                return ensureProductExists(product);
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
                    files: [{
                        ...imageDataToUpload(input.imageData),
                        variantId: input.variantId,
                    }],
                });
            } catch (error) {
                getFriendlyProductError(error, "upload");
            }
        }),

    replaceProductImages: baseProcedure
        .input(productImageReplaceSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const files =
                    imageAttachmentsToUploads(input.imageAttachments) ??
                    input.imagesData.map(imageDataToUpload);

                return await replaceProductImagesQuery({
                    businessId,
                    productId: input.productId,
                    files,
                });
            } catch (error) {
                getFriendlyProductError(error, "upload");
            }
        }),

    removeProductImages: baseProcedure
        .input(productImageRemoveSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await removeProductImagesQuery({
                    businessId,
                    productId: input.productId,
                    imageUrls: input.imageUrls,
                });
            } catch (error) {
                getFriendlyProductError(error, "delete");
            }
        }),

    saveUploadedProductImages: baseProcedure
        .input(productUploadedImagesSaveSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await saveUploadedProductImagesQuery({
                    businessId,
                    productId: input.productId,
                    mode: input.mode,
                    images: input.images,
                });
            } catch (error) {
                getFriendlyProductError(error, "upload");
            }
        }),

    removeProduct: baseProcedure
        .input(productIdSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const product = await deleteProductQuery({
                    id: input.id,
                    businessId,
                });

                return ensureProductExists(product);
            } catch (error) {
                getFriendlyProductError(error, "delete");
            }
        }),
});
