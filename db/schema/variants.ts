import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { productsTable } from "./products";
import { businessTable } from "./business";
import { usersTable } from "./users";

export const inventoryStatusEnum = pgEnum("inventory_status", ["healthy", "low", "critical", "reorder", "incoming"]);
export const stockAdjustmentReasonEnum = pgEnum("stock_adjustment_reason", [
    "restock",
    "damaged_goods",
    "theft_shrinkage",
    "return",
    "physical_count_audit",
    "correction",
]);
export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", [
    "draft",
    "ordered",
    "received",
    "cancelled",
]);

// Storage Locations Table
export const locationTable = pgTable("locations", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 255 }).notNull(),
    stock: integer("stock").default(0).notNull(),
    reorderPoint: integer("reorder_point").default(0).notNull(),
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
    status: inventoryStatusEnum("status").default("healthy").notNull(),
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
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueVariant: uniqueIndex("unique_variant").on(table.productId, table.color, table.size),
    uniqueSku: uniqueIndex("unique_sku").on(table.sku, table.businessId),
}));

export const purchaseOrdersTable = pgTable("purchase_orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    poNumber: varchar("po_number", { length: 40 }).notNull().unique(),
    supplierName: varchar("supplier_name", { length: 255 }).notNull(),
    status: purchaseOrderStatusEnum("status").default("draft").notNull(),
    expenseId: uuid("expense_id"),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => usersTable.id, { onDelete: "set null" }),
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

export const purchaseOrderItemsTable = pgTable("purchase_order_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    purchaseOrderId: uuid("purchase_order_id")
        .notNull()
        .references(() => purchaseOrdersTable.id, {
            onDelete: "cascade",
        }),
    variantId: uuid("variant_id")
        .notNull()
        .references(() => variantsTable.id, {
            onDelete: "cascade",
        }),
    sku: varchar("sku", { length: 255 }).notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    color: varchar("color", { length: 255 }).notNull(),
    size: varchar("size", { length: 255 }).notNull(),
    quantity: integer("quantity").notNull(),
    unitCost: integer("unit_cost").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const stockAdjustmentLogsTable = pgTable("stock_adjustment_logs", {
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
    locationId: uuid("location_id").references(() => locationTable.id, { onDelete: "set null" }),
    locationName: varchar("location_name", { length: 255 }).notNull(),
    previousQuantity: integer("previous_quantity").notNull(),
    newQuantity: integer("new_quantity").notNull(),
    quantityChanged: integer("quantity_changed").notNull(),
    reason: stockAdjustmentReasonEnum("reason").notNull(),
    notes: text("notes"),
    adjustedBy: uuid("adjusted_by").references(() => usersTable.id, { onDelete: "set null" }),
    adjustedAt: timestamp("adjusted_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
