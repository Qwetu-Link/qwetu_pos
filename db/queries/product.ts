import { db } from "@/db";
import { categoryTable } from "@/db/schema/category";
import { createVariantInventoryRowsQuery } from "@/db/queries/inventory";
import { productImages, productsTable } from "@/db/schema/products";
import {
    locationTable,
    variantInventoryTable,
    variantsTable,
} from "@/db/schema/variants";
import {
    getUploadedProductImagePaths,
    uploadProductImages,
} from "@/services/imageOperations";
import { ProductImageUpload } from "@/services/processImg";
import { deleteImages } from "@/services/uploadImg";
import {
    buildVariantCreateInputs,
    computeInventoryStatus,
    DEFAULT_STOCK_LOCATIONS,
} from "@/utils/catalog-utils";
import { and, asc, desc, eq } from "drizzle-orm";
import crypto from "crypto";

type ProductImageInput = ProductImageUpload & {
    variantId?: string | null;
    variantClientId?: string | null;
};

type UploadedProductImageInput = {
    originalPath: string;
    optimizedPath: string;
    thumbnailPath: string;
    watermarkPath: string;
    width: number;
    height: number;
    fileSize: number;
    mimeType: string;
    uploadedPaths: string[];
    variantId?: string | null;
};

function isUuid(value?: string | null) {
    return Boolean(
        value?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
    );
}

function getProductImageUrl(path?: string | null) {
    if (!path) return undefined;
    if (path.startsWith("http") || path.startsWith("data:image") || path.startsWith("/")) {
        return path;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) return undefined;

    return `${supabaseUrl}/storage/v1/object/public/products/${path}`;
}

export const getProductsQuery = async (businessId?: string) => {
    const productRows = businessId
        ? await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.businessId, businessId))
            .orderBy(desc(productsTable.createdAt))
        : await db
            .select()
            .from(productsTable)
            .orderBy(desc(productsTable.createdAt));

    const [imageRows, variantRows, categoryRows, inventoryRows] = await Promise.all([
        db
            .select()
            .from(productImages)
            .where(businessId ? eq(productImages.businessId, businessId) : undefined)
            .orderBy(asc(productImages.displayOrder), asc(productImages.createdAt)),
        db
            .select()
            .from(variantsTable)
            .where(businessId ? eq(variantsTable.businessId, businessId) : undefined)
            .orderBy(desc(variantsTable.createdAt)),
        db
            .select({
                id: categoryTable.id,
                name: categoryTable.name,
                businessId: categoryTable.businessId,
            })
            .from(categoryTable)
            .where(businessId ? eq(categoryTable.businessId, businessId) : undefined),
        db
            .select({
                variantId: variantInventoryTable.variantId,
                locationName: locationTable.name,
                totalStock: variantInventoryTable.totalStock,
                reorderPoint: variantInventoryTable.reorderPoint,
                status: variantInventoryTable.status,
                lastRestocked: variantInventoryTable.lastRestocked,
            })
            .from(variantInventoryTable)
            .innerJoin(locationTable, eq(variantInventoryTable.locationId, locationTable.id))
            .where(businessId ? eq(variantInventoryTable.businessId, businessId) : undefined),
    ]);

    return productRows.map((product) => {
        const productImageRows = imageRows.filter((image) => image.productId === product.id);
        const productVariantRows = variantRows.filter((variant) => variant.productId === product.id);
        const category = categoryRows.find((item) => item.id === product.categoryId);

        const imageDetails = productImageRows
            .map((image) => {
                const url = getProductImageUrl(
                    image.thumbnailPath ?? image.optimizedPath ?? image.originalPath,
                );

                if (!url) return null;

                return {
                    id: image.id,
                    url,
                    variantId: image.variantId,
                    alt: image.alt,
                    isPrimary: image.isPrimary,
                    displayOrder: image.displayOrder,
                };
            })
            .filter((image): image is NonNullable<typeof image> => Boolean(image));
        const imageUrls = imageDetails.map((image) => image.url);

        return {
            id: product.id,
            categoryId: product.categoryId,
            name: product.name,
            category: category?.name ?? "Uncategorized",
            brand: product.brand,
            description: product.description ?? "",
            imageUrl: imageUrls[0],
            images: imageUrls,
            imageDetails,
            variants: productVariantRows.map((variant) => ({
                id: variant.id,
                sku: variant.sku,
                color: variant.color,
                size: variant.size,
                buyPrice: variant.buyPrice,
                sellPrice: variant.sellPrice,
                inventory: (() => {
                    const variantInventoryRows = inventoryRows.filter(
                        (inventory) => inventory.variantId === variant.id,
                    );
                    const stock = variantInventoryRows.reduce(
                        (sum, inventory) => sum + inventory.totalStock,
                        0,
                    );
                    const reorderPoint = variantInventoryRows[0]?.reorderPoint ?? 10;
                    const status = variantInventoryRows.some(
                        (inventory) => inventory.status === "incoming",
                    )
                        ? "incoming" as const
                        : variantInventoryRows[0]?.status ?? "reorder";
                    const locations = DEFAULT_STOCK_LOCATIONS.map((defaultLocation) => {
                        const locationInventory = variantInventoryRows.find(
                            (inventory) => inventory.locationName === defaultLocation.name,
                        );

                        return {
                            name: defaultLocation.name,
                            stock: locationInventory?.totalStock ?? defaultLocation.stock,
                            reorderPoint: locationInventory?.reorderPoint ?? reorderPoint,
                        };
                    });

                    return computeInventoryStatus({
                        totalStock: stock,
                        reorderPoint,
                        status,
                        lastRestocked:
                            variantInventoryRows[0]?.lastRestocked?.toISOString().slice(0, 10) ??
                            variant.updatedAt.toISOString().slice(0, 10),
                        locations,
                    });
                })(),
            })),
        };
    });
};

export const getProductRowsQuery = async (businessId: string) => {
    return db
        .select()
        .from(productsTable)
        .where(eq(productsTable.businessId, businessId))
        .orderBy(desc(productsTable.createdAt));
};

export const getProductByIdQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const [product] = await db
        .select()
        .from(productsTable)
        .where(and(
            eq(productsTable.id, data.id),
            eq(productsTable.businessId, data.businessId),
        ));

    return product;
};

export const getProductDetailsQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const products = await getProductsQuery(data.businessId);

    return products.find((product) => product.id === data.id) ?? null;
};

async function ensureCategoryBelongsToBusiness(
    categoryId: string | null | undefined,
    businessId: string,
) {
    if (!categoryId) return;

    const [category] = await db
        .select({ id: categoryTable.id })
        .from(categoryTable)
        .where(and(
            eq(categoryTable.id, categoryId),
            eq(categoryTable.businessId, businessId),
        ));

    if (!category) {
        throw new Error("The selected category does not belong to this business.");
    }
}

export const createProductQuery = async (data: {
    businessId: string;
    name: string;
    categoryId?: string | null;
    brand: string;
    description?: string | null;
}) => {
    await ensureCategoryBelongsToBusiness(data.categoryId, data.businessId);

    const [product] = await db
        .insert(productsTable)
        .values({
            businessId: data.businessId,
            name: data.name,
            categoryId: data.categoryId ?? null,
            brand: data.brand,
            description: data.description ?? null,
        })
        .returning();

    return product;
};

export const updateProductQuery = async (data: {
    id: string;
    businessId: string;
    name: string;
    categoryId?: string | null;
    brand: string;
    description?: string | null;
}) => {
    const { id, businessId, name, categoryId, brand, description } = data;

    await ensureCategoryBelongsToBusiness(categoryId, businessId);

    const [product] = await db
        .update(productsTable)
        .set({
            name,
            categoryId: categoryId ?? null,
            brand,
            description: description ?? null,
        })
        .where(and(
            eq(productsTable.id, id),
            eq(productsTable.businessId, businessId),
        ))
        .returning();

    if (product) {
        await db
            .update(productImages)
            .set({ alt: product.name })
            .where(and(
                eq(productImages.productId, id),
                eq(productImages.businessId, businessId),
            ));
    }

    return product;
};

export const deleteProductQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const { product, imagePaths } = await db.transaction(async (tx) => {
        const images = await tx
            .select({
                originalPath: productImages.originalPath,
                optimizedPath: productImages.optimizedPath,
                thumbnailPath: productImages.thumbnailPath,
                watermarkedPath: productImages.watermarkedPath,
            })
            .from(productImages)
            .where(and(
                eq(productImages.productId, data.id),
                eq(productImages.businessId, data.businessId),
            ));

        const paths = new Set<string>();
        for (const image of images) {
            [
                image.originalPath,
                image.optimizedPath,
                image.thumbnailPath,
                image.watermarkedPath,
            ].forEach((path) => {
                if (
                    path &&
                    !path.startsWith("http") &&
                    !path.startsWith("data:image") &&
                    !path.startsWith("/")
                ) {
                    paths.add(path);
                }
            });
        }

        const [deletedProduct] = await tx
            .delete(productsTable)
            .where(and(
                eq(productsTable.id, data.id),
                eq(productsTable.businessId, data.businessId),
            ))
            .returning();

        return {
            product: deletedProduct,
            imagePaths: Array.from(paths),
        };
    });

    if (product && imagePaths.length > 0) {
        await deleteImages(imagePaths);
    }

    return product;
};

export const replaceProductImagesQuery = async (data: {
    businessId: string;
    productId: string;
    files: ProductImageInput[];
}) => {
    if (data.files.length === 0) {
        return [];
    }

    const product = await getProductByIdQuery({
        id: data.productId,
        businessId: data.businessId,
    });

    if (!product) {
        throw new Error("Product not found for this business.");
    }

    const existingImages = await db
        .select({
            originalPath: productImages.originalPath,
            optimizedPath: productImages.optimizedPath,
            thumbnailPath: productImages.thumbnailPath,
            watermarkedPath: productImages.watermarkedPath,
        })
        .from(productImages)
        .where(and(
            eq(productImages.productId, data.productId),
            eq(productImages.businessId, data.businessId),
        ));

    const oldPaths = new Set<string>();
    for (const image of existingImages) {
        [
            image.originalPath,
            image.optimizedPath,
            image.thumbnailPath,
            image.watermarkedPath,
        ].forEach((path) => {
            if (
                path &&
                !path.startsWith("http") &&
                !path.startsWith("data:image") &&
                !path.startsWith("/")
            ) {
                oldPaths.add(path);
            }
        });
    }

    const uploaded = await uploadProductImages(
        data.files,
        data.productId,
        data.businessId,
    );
    const uploadedPaths = getUploadedProductImagePaths(uploaded);

    try {
        const images = await db.transaction(async (tx) => {
            await tx
                .delete(productImages)
                .where(and(
                    eq(productImages.productId, data.productId),
                    eq(productImages.businessId, data.businessId),
                ));

            return tx
                .insert(productImages)
                .values(
                    uploaded.map((image, index) => ({
                        businessId: data.businessId,
                        productId: data.productId,
                        originalPath: image.originalPath,
                        optimizedPath: image.optimizedPath,
                        thumbnailPath: image.thumbnailPath,
                        watermarkedPath: image.watermarkPath,
                        alt: product.name,
                        variantId: data.files[index]?.variantId ?? null,
                        width: image.width,
                        height: image.height,
                        fileSize: image.fileSize,
                        mimeType: image.mimeType,
                        displayOrder: index,
                        isPrimary: index === 0,
                    })),
                )
                .returning();
        });

        await deleteImages(Array.from(oldPaths)).catch(() => undefined);
        return images;
    } catch (error) {
        await deleteImages(uploadedPaths).catch(() => undefined);
        throw error;
    }
};

export const removeProductImagesQuery = async (data: {
    businessId: string;
    productId: string;
    imageUrls: string[];
}) => {
    if (data.imageUrls.length === 0) {
        return [];
    }

    const imageRows = await db
        .select()
        .from(productImages)
        .where(and(
            eq(productImages.productId, data.productId),
            eq(productImages.businessId, data.businessId),
        ));

    const requestedUrls = new Set(data.imageUrls);
    const rowsToDelete = imageRows.filter((image) => {
        const urls = [
            getProductImageUrl(image.thumbnailPath),
            getProductImageUrl(image.optimizedPath),
            getProductImageUrl(image.originalPath),
            getProductImageUrl(image.watermarkedPath),
        ].filter((url): url is string => Boolean(url));

        return urls.some((url) => requestedUrls.has(url));
    });

    if (rowsToDelete.length === 0) {
        return [];
    }

    const imageIds = new Set(rowsToDelete.map((image) => image.id));
    const paths = new Set<string>();
    for (const image of rowsToDelete) {
        [
            image.originalPath,
            image.optimizedPath,
            image.thumbnailPath,
            image.watermarkedPath,
        ].forEach((path) => {
            if (
                path &&
                !path.startsWith("http") &&
                !path.startsWith("data:image") &&
                !path.startsWith("/")
            ) {
                paths.add(path);
            }
        });
    }

    const deleted = await db.transaction(async (tx) => {
        const removed = [];

        for (const imageId of imageIds) {
            const [row] = await tx
                .delete(productImages)
                .where(and(
                    eq(productImages.id, imageId),
                    eq(productImages.productId, data.productId),
                    eq(productImages.businessId, data.businessId),
                ))
                .returning();

            if (row) removed.push(row);
        }

        return removed;
    });

    await deleteImages(Array.from(paths)).catch(() => undefined);
    return deleted;
};

export const uploadProductImagesQuery = async (data: {
    businessId: string;
    productId: string;
    files: ProductImageInput[];
}) => {
    if (data.files.length === 0) {
        return [];
    }

    const product = await getProductByIdQuery({
        id: data.productId,
        businessId: data.businessId,
    });

    if (!product) {
        throw new Error("Product not found for this business.");
    }

    const uploaded = await uploadProductImages(
        data.files,
        data.productId,
        data.businessId,
    );
    const uploadedPaths = getUploadedProductImagePaths(uploaded);

    try {
        return await db.transaction(async (tx) => {
            return tx
                .insert(productImages)
                .values(
                    uploaded.map((image, index) => ({
                        businessId: data.businessId,
                        productId: data.productId,
                        originalPath: image.originalPath,
                        optimizedPath: image.optimizedPath,
                        thumbnailPath: image.thumbnailPath,
                        watermarkedPath: image.watermarkPath,
                        alt: product.name,
                        variantId: data.files[index]?.variantId ?? null,
                        width: image.width,
                        height: image.height,
                        fileSize: image.fileSize,
                        mimeType: image.mimeType,
                        displayOrder: index,
                        isPrimary: index === 0,
                    })),
                )
                .returning();
        });
    } catch (error) {
        await deleteImages(uploadedPaths).catch(() => undefined);
        throw error;
    }
};

export const saveUploadedProductImagesQuery = async (data: {
    businessId: string;
    productId: string;
    mode: "append" | "replace";
    images: UploadedProductImageInput[];
}) => {
    if (data.images.length === 0) {
        return [];
    }

    const product = await getProductByIdQuery({
        id: data.productId,
        businessId: data.businessId,
    });

    if (!product) {
        throw new Error("Product not found for this business.");
    }

    const uploadedPaths = data.images.flatMap((image) => image.uploadedPaths);
    const oldPaths = new Set<string>();

    if (data.mode === "replace") {
        const existingImages = await db
            .select({
                originalPath: productImages.originalPath,
                optimizedPath: productImages.optimizedPath,
                thumbnailPath: productImages.thumbnailPath,
                watermarkedPath: productImages.watermarkedPath,
            })
            .from(productImages)
            .where(and(
                eq(productImages.productId, data.productId),
                eq(productImages.businessId, data.businessId),
            ));

        for (const image of existingImages) {
            [
                image.originalPath,
                image.optimizedPath,
                image.thumbnailPath,
                image.watermarkedPath,
            ].forEach((path) => {
                if (
                    path &&
                    !path.startsWith("http") &&
                    !path.startsWith("data:image") &&
                    !path.startsWith("/")
                ) {
                    oldPaths.add(path);
                }
            });
        }
    }

    try {
        const images = await db.transaction(async (tx) => {
            if (data.mode === "replace") {
                await tx
                    .delete(productImages)
                    .where(and(
                        eq(productImages.productId, data.productId),
                        eq(productImages.businessId, data.businessId),
                    ));
            }

            return tx
                .insert(productImages)
                .values(
                    data.images.map((image, index) => ({
                        businessId: data.businessId,
                        productId: data.productId,
                        originalPath: image.originalPath,
                        optimizedPath: image.optimizedPath,
                        thumbnailPath: image.thumbnailPath,
                        watermarkedPath: image.watermarkPath,
                        alt: product.name,
                        variantId: image.variantId ?? null,
                        width: image.width,
                        height: image.height,
                        fileSize: image.fileSize,
                        mimeType: image.mimeType,
                        displayOrder: index,
                        isPrimary: index === 0,
                    })),
                )
                .returning();
        });

        if (data.mode === "replace") {
            await deleteImages(Array.from(oldPaths)).catch(() => undefined);
        }

        return images;
    } catch (error) {
        await deleteImages(uploadedPaths).catch(() => undefined);
        throw error;
    }
};

export const createProductWithRelationsQuery = async (data: {
    businessId: string;
    name: string;
    categoryId?: string | null;
    brand: string;
    description?: string | null;
    images?: ProductImageInput[];
    variants?: {
        clientId?: string;
        sku?: string;
        color: string;
        size: string;
        buyPrice: number;
        sellPrice: number;
        mainStock?: number;
    }[];
}) => {
    const productId = crypto.randomUUID();

    await ensureCategoryBelongsToBusiness(data.categoryId, data.businessId);

    const uploaded = data.images?.length
        ? await uploadProductImages(
            data.images,
            productId,
            data.businessId,
        )
        : [];
    const uploadedPaths = getUploadedProductImagePaths(uploaded);

    try {
        return await db.transaction(async (tx) => {
            const [product] = await tx
                .insert(productsTable)
                .values(
                    {
                        id: productId,
                        businessId: data.businessId,
                        name: data.name,
                        categoryId: data.categoryId ?? null,
                        brand: data.brand,
                        description: data.description ?? null,
                    },
                )
                .returning();

            const variantInputs = data.variants?.length
                ? buildVariantCreateInputs(data.name, data.variants)
                : [];

            const variants = variantInputs.length
                ? await tx
                    .insert(variantsTable)
                    .values(
                        variantInputs.map((variant) => ({
                            sku: variant.sku,
                            color: variant.color,
                            size: variant.size,
                            buyPrice: variant.buyPrice,
                            sellPrice: variant.sellPrice,
                            businessId: data.businessId,
                            productId,
                        })),
                    )
                    .returning()
                : [];

            for (const [index, variant] of variants.entries()) {
                await createVariantInventoryRowsQuery(tx, {
                    businessId: data.businessId,
                    variantId: variant.id,
                    mainStock: variantInputs[index]?.mainStock,
                });
            }

            const variantIdsByClientId = new Map(
                variants.map((variant, index) => [data.variants?.[index]?.clientId, variant.id]),
            );
            const images = uploaded.length
                ? await tx
                    .insert(productImages)
                    .values(
                        uploaded.map((image, index) => {
                            const variantClientId = data.images?.[index]?.variantClientId;
                            const directVariantId = data.images?.[index]?.variantId;
                            const requestedVariantId =
                                (variantClientId ? variantIdsByClientId.get(variantClientId) : undefined) ??
                                (isUuid(directVariantId) ? directVariantId : undefined);

                            return {
                                businessId: data.businessId,
                                productId,
                                variantId: requestedVariantId ?? null,
                                originalPath: image.originalPath,
                                optimizedPath: image.optimizedPath,
                                thumbnailPath: image.thumbnailPath,
                                watermarkedPath: image.watermarkPath,
                                alt: data.name,
                                width: image.width,
                                height: image.height,
                                fileSize: image.fileSize,
                                mimeType: image.mimeType,
                                displayOrder: index,
                                isPrimary: index === 0,
                            };
                        }),
                    )
                    .returning()
                : [];

            return {
                ...product,
                images,
                variants,
            };
        });
    } catch (error) {
        await deleteImages(uploadedPaths).catch(() => undefined);
        throw error;
    }
};

export const updateProductImageAssignmentsQuery = async (data: {
    businessId: string;
    productId: string;
    assignments: {
        imageUrl: string;
        variantId?: string | null;
    }[];
}) => {
    if (data.assignments.length === 0) {
        return [];
    }

    const imageRows = await db
        .select()
        .from(productImages)
        .where(and(
            eq(productImages.productId, data.productId),
            eq(productImages.businessId, data.businessId),
        ));

    const updates = [];

    for (const assignment of data.assignments) {
        const image = imageRows.find((row) => {
            const urls = [
                getProductImageUrl(row.thumbnailPath),
                getProductImageUrl(row.optimizedPath),
                getProductImageUrl(row.originalPath),
                getProductImageUrl(row.watermarkedPath),
            ].filter((url): url is string => Boolean(url));

            return urls.includes(assignment.imageUrl);
        });

        if (!image) continue;

        const [updated] = await db
            .update(productImages)
            .set({ variantId: assignment.variantId ?? null })
            .where(and(
                eq(productImages.id, image.id),
                eq(productImages.productId, data.productId),
                eq(productImages.businessId, data.businessId),
            ))
            .returning();

        if (updated) updates.push(updated);
    }

    return updates;
};
