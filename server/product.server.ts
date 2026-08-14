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
    message?: string;
    detail?: string;
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
        errorMessage.includes("Only JPG, PNG, and WEBP") ||
        errorMessage.includes("HEIC/HEIF images are not supported") ||
        errorMessage.includes("Product images must") ||
        errorMessage.includes("Could not read image dimensions") ||
        errorMessage.includes("Image storage upload failed") ||
        errorMessage.includes("Image storage cleanup failed") ||
        errorMessage.includes("does not belong to this business") ||
        errorMessage.includes("not found for this business")
    ) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: errorMessage,
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
            ? "Could not create the product because the database rejected the product details."
            : action === "update"
                ? "Could not update the product because the database rejected the product details."
                : action === "upload"
                    ? "Could not save the product image because the image upload or image record save failed."
                    : "Could not delete the product because the database rejected the delete request.";

    if (databaseError.code === "23502") {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A required product field is missing.",
        });
    }

    if (databaseError.code === "22P02") {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One of the product, category, variant, or business ids is invalid.",
        });
    }

    if (databaseError.code === "23505") {
        throw new TRPCError({
            code: "CONFLICT",
            message: "A product, variant, or image record already exists with the same unique value.",
        });
    }

    if (databaseError.code === "23503" && action === "upload") {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Image records could not be saved because the product, business, or variant reference is invalid.",
        });
    }

    if (databaseError.code === "23503" && action === "delete") {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Product could not be deleted because related records still reference it.",
        });
    }

    if (databaseError.code === "23503") {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The selected product, category, variant, or business record does not exist.",
        });
    }

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
