import { integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { paymentStatusEnum, paymentTypeEnum } from "./payments";
import { customerTable } from "./customers";
import { productsTable } from "./products";
import { variantsTable } from "./variants";

export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"]);

export const orderItemTable = pgTable("order_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id").notNull().references(() => variantsTable.id, {
        onDelete: "restrict", // Prevent deleting products with existing order items
    }),
    sku: varchar("sku", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orderTable.id, {
            onDelete: "cascade", // Delete order items when the associated order is deleted
        }),
    productId: uuid("product_id")
        .notNull()
        .references(() => productsTable.id, {
            onDelete: "restrict", // Prevent deleting products with existing order items
        }),
    quantity: integer("quantity").notNull(),
    price: integer("price").notNull(),
}, (table) => ({
    uniqueOrderItem: uniqueIndex
        ("unique_order_item").on(table.orderId, table.variantId)
}));


// Orders Table
export const orderTable = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id")
        .notNull()
        .references(() => customerTable.id, {
            onDelete: "restrict", // Prevent deleting customers with existing orders
        }),
    total: integer("total").notNull(),
    depositPaid: integer("deposit_paid").default(0).notNull(), // deposit or amount paid by the customer
    paymentStatus: paymentStatusEnum("payment_status").default("unpaid").notNull(),
    paymentType: paymentTypeEnum("payment_type").default("full").notNull(),
    installmentPlan: varchar("installment_plan", { length: 255 }),
    installmentStartDate: timestamp("installment_start_date"),
    status: orderStatusEnum("status").default("pending").notNull(),
    startDate: timestamp("start_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    shippingAddress: varchar("shipping_address", { length: 500 }).notNull(),
},(table) => ({
    uniqueOrder: uniqueIndex("unique_order").on(table.customerId, table.createdAt)
}));