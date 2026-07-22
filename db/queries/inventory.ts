import { db } from "@/db";
import { locationTable, variantInventoryTable } from "@/db/schema/variants";
import {
    buildVariantInventory,
    DEFAULT_STOCK_LOCATIONS,
} from "@/utils/catalog-utils";
import { and, inArray, eq } from "drizzle-orm";

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | DbTransaction;

function getInventoryStatus(stock: number, reorderPoint: number) {
    if (stock === 0) return "reorder" as const;
    if (stock <= 3) return "critical" as const;
    if (stock <= reorderPoint * 0.6) return "low" as const;
    return "healthy" as const;
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
}) {
    return db.transaction(async (tx) => {
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

        const [updated] = await tx
            .update(variantInventoryTable)
            .set({
                totalStock: data.quantity,
                lastRestocked: new Date(),
                status: getInventoryStatus(data.quantity, inventoryRow.reorderPoint),
            })
            .where(and(
                eq(variantInventoryTable.id, inventoryRow.id),
                eq(variantInventoryTable.businessId, data.businessId),
            ))
            .returning();

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
