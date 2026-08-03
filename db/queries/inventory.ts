import { db } from "@/db";
import { productsTable } from "@/db/schema/products";
import { usersTable } from "@/db/schema/users";
import { expenseItemTable, expenseTable, transactionTable } from "@/db/schema/payments";
import {
    locationTable,
    purchaseOrderItemsTable,
    purchaseOrdersTable,
    stockAdjustmentLogsTable,
    variantInventoryTable,
    variantsTable,
} from "@/db/schema/variants";
import {
    buildVariantInventory,
    DEFAULT_STOCK_LOCATIONS,
} from "@/utils/catalog-utils";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import crypto from "crypto";

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | DbTransaction;

function getInventoryStatus(stock: number, reorderPoint: number) {
    if (stock === 0) return "reorder" as const;
    if (stock <= 3) return "critical" as const;
    if (stock <= reorderPoint * 0.6) return "low" as const;
    return "healthy" as const;
}

async function ensureVariantBelongsToBusiness(
    client: DbClient,
    variantId: string,
    businessId: string,
) {
    const [variant] = await client
        .select({ id: variantsTable.id })
        .from(variantsTable)
        .where(and(
            eq(variantsTable.id, variantId),
            eq(variantsTable.businessId, businessId),
        ));

    if (!variant) {
        throw new Error("Variant not found for this business.");
    }
}

export async function ensureDefaultLocationsQuery(
    client: DbClient,
    businessId: string,
) {
    const locationNames = DEFAULT_STOCK_LOCATIONS.map((location) => location.name);

    await client
        .insert(locationTable)
        .values(
            DEFAULT_STOCK_LOCATIONS.map((location) => ({
                businessId,
                name: location.name,
                stock: location.stock,
                reorderPoint: location.reorderPoint,
            })),
        )
        .onConflictDoNothing({
            target: [locationTable.businessId, locationTable.name],
        });

    const locations = await client
        .select()
        .from(locationTable)
        .where(and(
            eq(locationTable.businessId, businessId),
            inArray(locationTable.name, locationNames),
        ));

    if (locations.length !== DEFAULT_STOCK_LOCATIONS.length) {
        throw new Error("Could not create default stock locations.");
    }

    return locations;
}

export async function createVariantInventoryRowsQuery(
    client: DbClient,
    data: {
        businessId: string;
        variantId: string;
        mainStock?: number;
    },
) {
    const inventory = buildVariantInventory(data.mainStock ?? 0);
    await ensureVariantBelongsToBusiness(client, data.variantId, data.businessId);
    const locations = await ensureDefaultLocationsQuery(client, data.businessId);

    return client
        .insert(variantInventoryTable)
        .values(
            locations.map((location) => {
                const inventoryLocation = inventory.locations.find(
                    (item) => item.name === location.name,
                );
                const stock = inventoryLocation?.stock ?? 0;

                return {
                    businessId: data.businessId,
                    variantId: data.variantId,
                    locationId: location.id,
                    totalStock: stock,
                    reorderPoint: inventoryLocation?.reorderPoint ?? inventory.reorderPoint,
                    lastRestocked: new Date(inventory.lastRestocked),
                    status: stock === 0 ? "reorder" as const : inventory.status,
                };
            }),
        )
        .onConflictDoNothing({
            target: [
                variantInventoryTable.variantId,
                variantInventoryTable.locationId,
            ],
        })
        .returning();
}

async function getInventoryRowByLocationName(
    client: DbClient,
    data: {
        businessId: string;
        variantId: string;
        locationName: string;
    },
) {
    const [row] = await client
        .select({
            id: variantInventoryTable.id,
            locationId: variantInventoryTable.locationId,
            totalStock: variantInventoryTable.totalStock,
            reorderPoint: variantInventoryTable.reorderPoint,
        })
        .from(variantInventoryTable)
        .innerJoin(locationTable, eq(variantInventoryTable.locationId, locationTable.id))
        .where(and(
            eq(variantInventoryTable.businessId, data.businessId),
            eq(variantInventoryTable.variantId, data.variantId),
            eq(locationTable.businessId, data.businessId),
            eq(locationTable.name, data.locationName),
        ));

    return row;
}

export async function adjustVariantInventoryQuery(data: {
    businessId: string;
    variantId: string;
    locationName: string;
    quantity: number;
    reason: "restock" | "damaged_goods" | "theft_shrinkage" | "return" | "physical_count_audit" | "correction";
    notes?: string;
    adjustedBy?: string | null;
}) {
    return db.transaction(async (tx) => {
        await ensureVariantBelongsToBusiness(tx, data.variantId, data.businessId);
        await ensureDefaultLocationsQuery(tx, data.businessId);
        const row = await getInventoryRowByLocationName(tx, data);

        if (!row) {
            await createVariantInventoryRowsQuery(tx, {
                businessId: data.businessId,
                variantId: data.variantId,
            });
        }

        const inventoryRow = row ?? await getInventoryRowByLocationName(tx, data);

        if (!inventoryRow) {
            throw new Error("Inventory location was not found for this variant.");
        }

        const nextQuantity = inventoryRow.totalStock + data.quantity;
        const quantityChanged = data.quantity;

        const [updated] = await tx
            .update(variantInventoryTable)
            .set({
                totalStock: nextQuantity,
                lastRestocked: new Date(),
                status: getInventoryStatus(nextQuantity, inventoryRow.reorderPoint),
            })
            .where(and(
                eq(variantInventoryTable.id, inventoryRow.id),
                eq(variantInventoryTable.businessId, data.businessId),
            ))
            .returning();

        await tx
            .insert(stockAdjustmentLogsTable)
            .values({
                businessId: data.businessId,
                variantId: data.variantId,
                locationId: inventoryRow.locationId,
                locationName: data.locationName,
                previousQuantity: inventoryRow.totalStock,
                newQuantity: nextQuantity,
                quantityChanged,
                reason: data.reason,
                notes: data.notes || null,
                adjustedBy: data.adjustedBy ?? null,
            });

        return updated;
    });
}

export async function transferVariantInventoryQuery(data: {
    businessId: string;
    variantId: string;
    fromLocationName: string;
    toLocationName: string;
    quantity: number;
}) {
    return db.transaction(async (tx) => {
        await ensureVariantBelongsToBusiness(tx, data.variantId, data.businessId);
        await ensureDefaultLocationsQuery(tx, data.businessId);
        await createVariantInventoryRowsQuery(tx, {
            businessId: data.businessId,
            variantId: data.variantId,
        });

        const fromRow = await getInventoryRowByLocationName(tx, {
            businessId: data.businessId,
            variantId: data.variantId,
            locationName: data.fromLocationName,
        });
        const toRow = await getInventoryRowByLocationName(tx, {
            businessId: data.businessId,
            variantId: data.variantId,
            locationName: data.toLocationName,
        });

        if (!fromRow || !toRow) {
            throw new Error("Inventory location was not found for this variant.");
        }

        if (fromRow.totalStock < data.quantity) {
            throw new Error(`Insufficient stock at ${data.fromLocationName}. Available: ${fromRow.totalStock}`);
        }

        const nextFromStock = fromRow.totalStock - data.quantity;
        const nextToStock = toRow.totalStock + data.quantity;

        const [fromUpdated] = await tx
            .update(variantInventoryTable)
            .set({
                totalStock: nextFromStock,
                status: getInventoryStatus(nextFromStock, fromRow.reorderPoint),
            })
            .where(and(
                eq(variantInventoryTable.id, fromRow.id),
                eq(variantInventoryTable.businessId, data.businessId),
            ))
            .returning();

        const [toUpdated] = await tx
            .update(variantInventoryTable)
            .set({
                totalStock: nextToStock,
                lastRestocked: new Date(),
                status: getInventoryStatus(nextToStock, toRow.reorderPoint),
            })
            .where(and(
                eq(variantInventoryTable.id, toRow.id),
                eq(variantInventoryTable.businessId, data.businessId),
            ))
            .returning();

        return {
            from: fromUpdated,
            to: toUpdated,
        };
    });
}

async function createPoNumber(client: DbClient, businessId: string) {
    const today = new Date();
    const stamp = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("");
    const [row] = await client
        .select({ count: sql<number>`count(*)` })
        .from(purchaseOrdersTable)
        .where(eq(purchaseOrdersTable.businessId, businessId));
    const count = Number(row?.count ?? 0) + 1;

    return `PO-${stamp}-${String(count).padStart(4, "0")}`;
}

function getDigitCode(length: number) {
    return String(crypto.randomInt(0, 10 ** length)).padStart(length, "0");
}

function getLetterCode(length: number) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length }, () => alphabet[crypto.randomInt(0, alphabet.length)]).join("");
}

async function getUniqueExpenseNo(client: DbClient, businessId: string) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
        const expenseNo = `EXP-${getLetterCode(5)}`;
        const [existing] = await client
            .select({ id: expenseTable.id })
            .from(expenseTable)
            .where(and(
                eq(expenseTable.businessId, businessId),
                eq(expenseTable.expenseNo, expenseNo),
            ));

        if (!existing) return expenseNo;
    }

    return `EXP-${getLetterCode(5)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

async function getUniquePurchaseTransactionId(client: DbClient, businessId: string) {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const tnxId = `TXN-${getDigitCode(4)}-P`;
        const [existing] = await client
            .select({ id: transactionTable.id })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.tnxId, tnxId),
            ));

        if (!existing) return tnxId;
    }

    return `TXN-${getDigitCode(4)}-P-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

export async function createPurchaseOrderQuery(data: {
    businessId: string;
    variantId: string;
    supplierName: string;
    quantity: number;
    notes?: string;
    createdBy?: string | null;
}) {
    const created = await db.transaction(async (tx) => {
        await ensureVariantBelongsToBusiness(tx, data.variantId, data.businessId);

        const [variant] = await tx
            .select({
                id: variantsTable.id,
                sku: variantsTable.sku,
                color: variantsTable.color,
                size: variantsTable.size,
                buyPrice: variantsTable.buyPrice,
                productName: productsTable.name,
            })
            .from(variantsTable)
            .innerJoin(productsTable, eq(variantsTable.productId, productsTable.id))
            .where(and(
                eq(variantsTable.id, data.variantId),
                eq(variantsTable.businessId, data.businessId),
            ));

        if (!variant) {
            throw new Error("Variant not found for this business.");
        }

        const poNumber = await createPoNumber(tx, data.businessId);
        const [purchaseOrder] = await tx
            .insert(purchaseOrdersTable)
            .values({
                businessId: data.businessId,
                poNumber,
                supplierName: data.supplierName,
                status: "draft",
                notes: data.notes || null,
                createdBy: data.createdBy ?? null,
            })
            .returning();

        const [item] = await tx
            .insert(purchaseOrderItemsTable)
            .values({
                businessId: data.businessId,
                purchaseOrderId: purchaseOrder.id,
                variantId: variant.id,
                sku: variant.sku,
                productName: variant.productName,
                color: variant.color,
                size: variant.size,
                quantity: data.quantity,
                unitCost: variant.buyPrice,
            })
            .returning();

        return {
            ...purchaseOrder,
            createdByName: "Current staff",
            items: [item],
        };
    });

    await db
        .update(variantInventoryTable)
        .set({
            status: "incoming",
        })
        .where(and(
            eq(variantInventoryTable.businessId, data.businessId),
            eq(variantInventoryTable.variantId, data.variantId),
        ))
        .catch(() => undefined);

    return created;
}

export async function getPurchaseOrdersQuery(businessId: string) {
    const [purchaseOrders, items, users] = await Promise.all([
        db
            .select()
            .from(purchaseOrdersTable)
            .where(eq(purchaseOrdersTable.businessId, businessId))
            .orderBy(desc(purchaseOrdersTable.createdAt)),
        db
            .select()
            .from(purchaseOrderItemsTable)
            .where(eq(purchaseOrderItemsTable.businessId, businessId)),
        db
            .select({
                id: usersTable.id,
                name: usersTable.name,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
                email: usersTable.email,
            })
            .from(usersTable)
            .where(eq(usersTable.businessId, businessId)),
    ]);

    return purchaseOrders.map((purchaseOrder) => {
        const user = users.find((item) => item.id === purchaseOrder.createdBy);
        const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

        return {
            ...purchaseOrder,
            createdByName: userName || user?.name || user?.email || "Unknown staff",
            items: items.filter((item) => item.purchaseOrderId === purchaseOrder.id),
        };
    });
}

export async function receivePurchaseOrderQuery(data: {
    businessId: string;
    id: string;
    receivedBy?: string | null;
}) {
    return db.transaction(async (tx) => {
        const [purchaseOrder] = await tx
            .select()
            .from(purchaseOrdersTable)
            .where(and(
                eq(purchaseOrdersTable.id, data.id),
                eq(purchaseOrdersTable.businessId, data.businessId),
            ));

        if (!purchaseOrder) {
            throw new Error("Purchase order not found for this business.");
        }

        if (purchaseOrder.status === "received") {
            throw new Error("This purchase order has already been received.");
        }

        if (purchaseOrder.expenseId) {
            throw new Error("This purchase order already has a linked expense.");
        }

        const items = await tx
            .select()
            .from(purchaseOrderItemsTable)
            .where(and(
                eq(purchaseOrderItemsTable.purchaseOrderId, data.id),
                eq(purchaseOrderItemsTable.businessId, data.businessId),
            ));

        if (items.length === 0) {
            throw new Error("Purchase order has no items to receive.");
        }

        await ensureDefaultLocationsQuery(tx, data.businessId);
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
        const now = new Date();

        const [transaction] = await tx
            .insert(transactionTable)
            .values({
                businessId: data.businessId,
                paymentId: null,
                tnxId: await getUniquePurchaseTransactionId(tx, data.businessId),
                amount: -Math.abs(totalAmount),
                tnxType: "expense",
                status: "success",
                paymentMethod: "cash",
                provider: "Purchase Order",
                reference: purchaseOrder.poNumber,
                transactedAt: now,
                notes: `Inventory purchase received from ${purchaseOrder.supplierName} via ${purchaseOrder.poNumber}.`,
            })
            .returning();

        const [expense] = await tx
            .insert(expenseTable)
            .values({
                businessId: data.businessId,
                expenseNo: await getUniqueExpenseNo(tx, data.businessId),
                transactionId: transaction.id,
                category: "inventory_purchase",
                vendorName: purchaseOrder.supplierName,
                amount: totalAmount,
                status: "approved",
                approvedBy: data.receivedBy ?? null,
                approvedAt: now,
                notes: `Generated from received purchase order ${purchaseOrder.poNumber}.`,
            })
            .returning();

        await tx
            .insert(expenseItemTable)
            .values(
                items.map((item) => ({
                    businessId: data.businessId,
                    expenseId: expense.id,
                    name: `${item.productName} ${item.color} ${item.size} (${item.sku})`,
                    quantity: item.quantity,
                    unitCost: item.unitCost,
                    total: item.quantity * item.unitCost,
                })),
            );

        for (const item of items) {
            await createVariantInventoryRowsQuery(tx, {
                businessId: data.businessId,
                variantId: item.variantId,
            });

            const row = await getInventoryRowByLocationName(tx, {
                businessId: data.businessId,
                variantId: item.variantId,
                locationName: "Main Store",
            });

            if (!row) {
                throw new Error("Inventory location was not found for this variant.");
            }

            const nextQuantity = row.totalStock + item.quantity;
            await tx
                .update(variantInventoryTable)
                .set({
                    totalStock: nextQuantity,
                    lastRestocked: now,
                    status: getInventoryStatus(nextQuantity, row.reorderPoint),
                })
                .where(and(
                    eq(variantInventoryTable.id, row.id),
                    eq(variantInventoryTable.businessId, data.businessId),
                ));

            await tx
                .insert(stockAdjustmentLogsTable)
                .values({
                    businessId: data.businessId,
                    variantId: item.variantId,
                    locationId: row.locationId,
                    locationName: "Main Store",
                    previousQuantity: row.totalStock,
                    newQuantity: nextQuantity,
                    quantityChanged: item.quantity,
                    reason: "restock",
                    notes: `Received purchase order ${purchaseOrder.poNumber}.`,
                    adjustedBy: data.receivedBy ?? null,
                    adjustedAt: now,
                });
        }

        await tx
            .update(purchaseOrdersTable)
            .set({
                status: "received",
                expenseId: expense.id,
            })
            .where(and(
                eq(purchaseOrdersTable.id, data.id),
                eq(purchaseOrdersTable.businessId, data.businessId),
            ));

        return {
            purchaseOrderId: data.id,
            expenseId: expense.id,
            transactionId: transaction.id,
        };
    });
}

export async function getStockAdjustmentLogsQuery(data: {
    businessId: string;
    variantId?: string;
}) {
    const rows = await db
        .select({
            id: stockAdjustmentLogsTable.id,
            variantId: stockAdjustmentLogsTable.variantId,
            locationName: stockAdjustmentLogsTable.locationName,
            previousQuantity: stockAdjustmentLogsTable.previousQuantity,
            newQuantity: stockAdjustmentLogsTable.newQuantity,
            quantityChanged: stockAdjustmentLogsTable.quantityChanged,
            reason: stockAdjustmentLogsTable.reason,
            notes: stockAdjustmentLogsTable.notes,
            adjustedAt: stockAdjustmentLogsTable.adjustedAt,
            userName: usersTable.name,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            userEmail: usersTable.email,
            sku: variantsTable.sku,
            color: variantsTable.color,
            size: variantsTable.size,
            productName: productsTable.name,
        })
        .from(stockAdjustmentLogsTable)
        .innerJoin(variantsTable, eq(stockAdjustmentLogsTable.variantId, variantsTable.id))
        .innerJoin(productsTable, eq(variantsTable.productId, productsTable.id))
        .leftJoin(usersTable, eq(stockAdjustmentLogsTable.adjustedBy, usersTable.id))
        .where(and(
            eq(stockAdjustmentLogsTable.businessId, data.businessId),
            data.variantId ? eq(stockAdjustmentLogsTable.variantId, data.variantId) : undefined,
        ))
        .orderBy(desc(stockAdjustmentLogsTable.adjustedAt));

    return rows.map((row) => {
        const staffName = [row.firstName, row.lastName].filter(Boolean).join(" ");

        return {
            id: row.id,
            variantId: row.variantId,
            sku: row.sku,
            productName: row.productName,
            color: row.color,
            size: row.size,
            locationName: row.locationName,
            previousQuantity: row.previousQuantity,
            newQuantity: row.newQuantity,
            quantityChanged: row.quantityChanged,
            reason: row.reason,
            notes: row.notes,
            adjustedAt: row.adjustedAt,
            staffName: staffName || row.userName || row.userEmail || "Unknown staff",
        };
    });
}
