import { paymentStatusValues, paymentTypeValues } from "./payments";
import { customerTable } from "./customers";
import { productsTable } from "./products";
import { variantsTable } from "./variants";
import { locationTable } from "./variants";
import { businessTable } from "./business";
import { int, mysqlEnum, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";

const orderStatusValues = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const orderItemTable = mysqlTable("order_items", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    variantId: varchar("variant_id", { length: 36 }).notNull().references(() => variantsTable.id, {
        onDelete: "restrict", // Prevent deleting products with existing order items
    }),
    sku: varchar("sku", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    orderId: varchar("order_id", { length: 36 })
        .notNull()
        .references(() => orderTable.id, {
            onDelete: "cascade", // Delete order items when the associated order is deleted
        }),
    productId: varchar("product_id", { length: 36 })
        .notNull()
        .references(() => productsTable.id, {
            onDelete: "restrict", // Prevent deleting products with existing order items
        }),
    locationId: varchar("location_id", { length: 36 }).references(() => locationTable.id, {
        onDelete: "set null",
    }),
    quantity: int("quantity").notNull(),
    price: int("price").notNull(),
    originalPrice: int("original_price"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueOrderItem: uniqueIndex
        ("unique_order_item_idx").on(table.orderId, table.variantId)
}));


// Orders Table
export const orderTable = mysqlTable("orders", {
    id: varchar("id",{length:36}).$defaultFn(()=>randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    customerId: varchar("customer_id", { length: 36 })
        .notNull()
        .references(() => customerTable.id, {
            onDelete: "restrict", // Prevent deleting customers with existing orders
        }),
    orderNo: varchar("order_no", { length: 100 }),
    total: int("total").notNull(),
    depositPaid: int("deposit_paid").default(0).notNull(), // deposit or amount paid by the customer
    paymentStatus: mysqlEnum("payment_status", paymentStatusValues).default("unpaid").notNull(),
    paymentType: mysqlEnum("payment_type", paymentTypeValues).default("full").notNull(),
    installmentPlan: varchar("installment_plan", { length: 255 }),
    installmentStartDate: timestamp("installment_start_date"),
    status: mysqlEnum("status", orderStatusValues).default("pending").notNull(),
    startDate: timestamp("start_date"),
    shippingAddress: varchar("shipping_address", { length: 500 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueOrder: uniqueIndex("unique_order_customer_idx").on(table.customerId, table.id)
}));
