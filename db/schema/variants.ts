import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { productsTable } from "./products";
import { businessTable } from "./business";
import { usersTable } from "./users";
import { randomUUID } from "crypto";

const inventoryStatusValues = ["healthy", "low", "critical", "reorder", "incoming"] as const;
const stockAdjustmentReasonValues = [
    "restock",
    "damaged_goods",
    "theft_shrinkage",
    "return",
    "physical_count_audit",
    "correction",
] as const;
const purchaseOrderStatusValues = [
    "draft",
    "ordered",
    "received",
    "cancelled",
] as const;

// Storage Locations Table
export const locationTable = mysqlTable("locations", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 255 }).notNull(),
    stock: int("stock").default(0).notNull(),
    reorderPoint: int("reorder_point").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueBusinessLocation: uniqueIndex("business_location_unique").on(
        table.businessId,
        table.name,
    ),
}));


// Variants  records
export const variantInventoryTable = mysqlTable("variant_inventory", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    variantId: varchar("variant_id", { length: 36 })
        .notNull()
        .references(() => variantsTable.id, {
            onDelete: "cascade",
        }),
    locationId: varchar("location_id", { length: 36 }).notNull().references(() => locationTable.id, { onDelete: 'cascade' }),
    totalStock: int("total_stock").default(0).notNull(),
    reorderPoint: int("reorder_point").default(0).notNull(),
    lastRestocked: timestamp("last_restocked"),
    status: mysqlEnum("status", inventoryStatusValues).default("healthy").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
},
    (table) => ({
        uniqueVariantLocation: uniqueIndex("variant_location_unique").on(
            table.variantId,
            table.locationId
        ),
    }));

// Product Variants Table
export const variantsTable = mysqlTable("variants", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    sku: varchar("sku", { length: 255 }).notNull().unique(),
    color: varchar("color", { length: 255 }).notNull(),
    size: varchar("size", { length: 255 }).notNull(),
    buyPrice: int("buy_price").default(0).notNull(),
    sellPrice: int("sell_price").default(0).notNull(),
    productId: varchar("product_id", { length: 36 }).notNull().references(() => productsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueVariant: uniqueIndex("unique_variant").on(table.productId, table.color, table.size),
    uniqueSku: uniqueIndex("unique_sku").on(table.sku, table.businessId),
}));

export const purchaseOrdersTable = mysqlTable("purchase_orders", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    poNumber: varchar("po_number", { length: 40 }).notNull().unique(),
    supplierName: varchar("supplier_name", { length: 255 }).notNull(),
    status: mysqlEnum("status", purchaseOrderStatusValues).default("draft").notNull(),
    expenseId: varchar("expense_id", { length: 36 }),
    notes: text("notes"),
    createdBy: varchar("created_by", { length: 36 }).references(() => usersTable.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueBusinessPoNumber: uniqueIndex("purchase_orders_business_po_number_unique").on(
        table.businessId,
        table.poNumber,
    ),
}));

export const purchaseOrderItemsTable = mysqlTable("purchase_order_items", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    purchaseOrderId: varchar("purchase_order_id", { length: 36 })
        .notNull()
        .references(() => purchaseOrdersTable.id, {
            onDelete: "cascade",
        }),
    variantId: varchar("variant_id", { length: 36 })
        .notNull()
        .references(() => variantsTable.id, {
            onDelete: "cascade",
        }),
    sku: varchar("sku", { length: 255 }).notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    color: varchar("color", { length: 255 }).notNull(),
    size: varchar("size", { length: 255 }).notNull(),
    quantity: int("quantity").notNull(),
    unitCost: int("unit_cost").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const stockAdjustmentLogsTable = mysqlTable("stock_adjustment_logs", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    variantId: varchar("variant_id", { length: 36 })
        .notNull()
        .references(() => variantsTable.id, {
            onDelete: "cascade",
        }),
    locationId: varchar("location_id", { length: 36 }).references(() => locationTable.id, { onDelete: "set null" }),
    locationName: varchar("location_name", { length: 255 }).notNull(),
    previousQuantity: int("previous_quantity").notNull(),
    newQuantity: int("new_quantity").notNull(),
    quantityChanged: int("quantity_changed").notNull(),
    reason: mysqlEnum("reason", stockAdjustmentReasonValues).notNull(),
    notes: text("notes"),
    adjustedBy: varchar("adjusted_by", { length: 36 }).references(() => usersTable.id, { onDelete: "set null" }),
    adjustedAt: timestamp("adjusted_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

