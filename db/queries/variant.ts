import { db } from "@/db";
import { productsTable } from "@/db/schema/products";
import { variantInventoryTable, variantsTable } from "@/db/schema/variants";
import { createVariantInventoryRowsQuery } from "@/db/queries/inventory";
import { and, desc, eq } from "drizzle-orm";

export const getVariantsQuery = async (businessId: string) => {
    return db
        .select()
        .from(variantsTable)
        .where(eq(variantsTable.businessId, businessId))
        .orderBy(desc(variantsTable.createdAt));
};

export const getVariantByIdQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const [variant] = await db
        .select()
        .from(variantsTable)
        .where(and(
            eq(variantsTable.id, data.id),
            eq(variantsTable.businessId, data.businessId),
        ));

    return variant;
};

async function ensureProductBelongsToBusiness(productId: string, businessId: string) {
    const [product] = await db
        .select({ id: productsTable.id })
        .from(productsTable)
        .where(and(
            eq(productsTable.id, productId),
            eq(productsTable.businessId, businessId),
        ));

    if (!product) {
        throw new Error("The selected product does not belong to this business.");
    }
}

export const createVariantQuery = async (data: {
    businessId: string;
    productId: string;
    sku: string;
    color: string;
    size: string;
    buyPrice: number;
    sellPrice: number;
    mainStock?: number;
}) => {
    const { mainStock, ...variantValues } = data;

    await ensureProductBelongsToBusiness(data.productId, data.businessId);

    return db.transaction(async (tx) => {
        const [variant] = await tx
            .insert(variantsTable)
            .values(variantValues)
            .returning();

        await createVariantInventoryRowsQuery(tx, {
            businessId: data.businessId,
            variantId: variant.id,
            mainStock,
        });

        return variant;
    });
};

export const updateVariantQuery = async (data: {
    id: string;
    businessId: string;
    sku: string;
    color: string;
    size: string;
    buyPrice: number;
    sellPrice: number;
    mainStock?: number;
    reorderPoint?: number;
}) => {
    const { id, businessId, mainStock, reorderPoint, ...values } = data;
    void mainStock;

    return db.transaction(async (tx) => {
        const [variant] = await tx
            .update(variantsTable)
            .set(values)
            .where(and(
                eq(variantsTable.id, id),
                eq(variantsTable.businessId, businessId),
            ))
            .returning();

        if (variant && reorderPoint !== undefined) {
            await tx
                .update(variantInventoryTable)
                .set({
                    reorderPoint,
                })
                .where(and(
                    eq(variantInventoryTable.variantId, id),
                    eq(variantInventoryTable.businessId, businessId),
                ));
        }

        return variant;
    });
};

export const deleteVariantQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const [variant] = await db
        .delete(variantsTable)
        .where(and(
            eq(variantsTable.id, data.id),
            eq(variantsTable.businessId, data.businessId),
        ))
        .returning();

    return variant;
};
