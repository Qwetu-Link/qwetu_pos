import { integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { productsTable } from "./products";
import { businessTable } from "./business";

export const inventoryStatusEnum = pgEnum("status", ["healthy", "low", "critical", "reorder"]);

// Storage Locations Table
export const locationTable = pgTable("locations", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 255 }).notNull().unique(),
    stock: integer("stock").default(0).notNull(),
    reorderPoint: integer("reorder_point").default(0).notNull(),
});


// Variants  records
export const variantInventoryTable = pgTable("variant_inventory", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    variantId: uuid("variant_id")
        .notNull()
        .references(() => variantsTable.id, {
            onDelete: "cascade",
        }),
    locationId: uuid("location_id").notNull().references(() => locationTable.id, { onDelete: 'cascade' }),
    totalStock: integer("total_stock").default(0).notNull(),
    reorderPoint: integer("reorder_point").default(0).notNull(),
    lastRestocked: timestamp("last_restocked"),
    status: inventoryStatusEnum().default("healthy").notNull(),
},
    (table) => ({
        uniqueVariantLocation: uniqueIndex("variant_location_unique").on(
            table.variantId,
            table.locationId
        ),
    }));

// Product Variants Table
export const variantsTable = pgTable("variants", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    sku: varchar("sku").notNull().unique(),
    color: varchar("color").notNull(),
    size: varchar("size").notNull(),
    buyPrice: integer("buy_price").default(0).notNull(),
    sellPrice: integer("sell_price").default(0).notNull(),
    productId: uuid("product_id").notNull().references(() => productsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    uniqueVariant: uniqueIndex("unique_variant").on(table.productId, table.color, table.size),
    uniqueSku: uniqueIndex("unique_sku").on(table.sku, table.businessId),
}));