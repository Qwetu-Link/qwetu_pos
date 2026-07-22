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
import { asc, desc, eq } from "drizzle-orm";
import crypto from "crypto";

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

    const [imageRows, variantRows, categoryRows, inventoryRows, locationRows] = await Promise.all([
        db
            .select()
            .from(productImages)
            .orderBy(asc(productImages.displayOrder), asc(productImages.createdAt)),
        db
            .select()
            .from(variantsTable)
            .orderBy(desc(variantsTable.createdAt)),
        db
            .select()
            .from(categoryTable),
        db
            .select()
            .from(variantInventoryTable),
        db
            .select()
            .from(locationTable),
    ]);

    return productRows.map((product) => {
        const productImageRows = imageRows.filter((image) => image.productId === product.id);
        const productVariantRows = variantRows.filter((variant) => variant.productId === product.id);
        const category = categoryRows.find((item) => item.id === product.categoryId);

        const imageUrls = productImageRows
            .map((image) => getProductImageUrl(
                image.thumbnailPath ?? image.optimizedPath ?? image.originalPath,
            ))
            .filter((image): image is string => Boolean(image));

        return {
            id: product.id,
            categoryId: product.categoryId,
            name: product.name,
            category: category?.name ?? "Uncategorized",
            brand: product.brand,
            description: product.description ?? "",
            imageUrl: imageUrls[0],
            images: imageUrls,
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
                    const locations = DEFAULT_STOCK_LOCATIONS.map((defaultLocation) => {
                        const location = locationRows.find(
                            (item) =>
                                item.businessId === product.businessId &&
                                item.name === defaultLocation.name,
                        );
                        const inventory = location
                            ? variantInventoryRows.find((item) => item.locationId === location.id)
                            : undefined;

                        return {
                            name: defaultLocation.name,
                            stock: inventory?.totalStock ?? defaultLocation.stock,
                            reorderPoint: inventory?.reorderPoint ?? defaultLocation.reorderPoint,
                        };
                    });

                    return computeInventoryStatus({
                        totalStock: 0,
                        reorderPoint: variantInventoryRows[0]?.reorderPoint ?? 10,
                        status: variantInventoryRows[0]?.status ?? "reorder",
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

export const getProductRowsQuery = async () => {
    return db
        .select()
        .from(productsTable)
        .orderBy(desc(productsTable.createdAt));
};

export const getProductByIdQuery = async (id: string) => {
    const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id));

    return product;
};

export const createProductQuery = async (data: {
    businessId: string;
    name: string;
    categoryId?: string | null;
    brand: string;
    description?: string | null;
}) => {
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
    name: string;
    categoryId?: string | null;
    brand: string;
    description?: string | null;
}) => {
    const { id, name, categoryId, brand, description } = data;

    const [product] = await db
        .update(productsTable)
        .set({
            name,
            categoryId: categoryId ?? null,
            brand,
            description: description ?? null,
        })
        .where(eq(productsTable.id, id))
        .returning();

    return product;
};

export const deleteProductQuery = async (id: string) => {
    const [product] = await db
        .delete(productsTable)
        .where(eq(productsTable.id, id))
        .returning();

    return product;
};

export const uploadProductImagesQuery = async (data: {
    businessId: string;
    productId: string;
    files: ProductImageUpload[];
}) => {
    if (data.files.length === 0) {
        return [];
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

export const createProductWithRelationsQuery = async (data: {
    businessId: string;
    name: string;
    categoryId?: string | null;
    brand: string;
    description?: string | null;
    images?: ProductImageUpload[];
    variants?: {
        sku?: string;
        color: string;
        size: string;
        buyPrice: number;
        sellPrice: number;
        mainStock?: number;
    }[];
}) => {
    const productId = crypto.randomUUID();

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

            const images = uploaded.length
                ? await tx
                    .insert(productImages)
                    .values(
                        uploaded.map((image, index) => ({
                            businessId: data.businessId,
                            productId,
                            originalPath: image.originalPath,
                            optimizedPath: image.optimizedPath,
                            thumbnailPath: image.thumbnailPath,
                            watermarkedPath: image.watermarkPath,
                            width: image.width,
                            height: image.height,
                            fileSize: image.fileSize,
                            mimeType: image.mimeType,
                            displayOrder: index,
                            isPrimary: index === 0,
                        })),
                    )
                    .returning()
                : [];

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
