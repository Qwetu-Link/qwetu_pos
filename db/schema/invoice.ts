import { orderTable } from "./orders";
import { businessTable } from "./business";
import { int, mysqlEnum, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";

const invoiceStatusValues = [
    "draft",
    "issued",
    "partially_paid",
    "paid",
    "overdue",
    "cancelled",
] as const;

export const invoiceTable = mysqlTable("invoices", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    orderId: varchar("order_id", { length: 36 })
        .notNull()
        .references(() => orderTable.id, {
            onDelete: "restrict",
        })
        .unique(),
    invoiceNumber: varchar("invoice_number", {
        length: 50,
    }).notNull().unique(),
    subtotal: int("subtotal").notNull(),
    discount: int("discount").default(0).notNull(),
    tax: int("tax").default(0).notNull(),
    total: int("total").notNull(),
    balance: int("balance").notNull(),
    installments: int("installments").default(0).notNull(),
    installmentAmount: int("installment_amount").default(0).notNull(),
    status: mysqlEnum("status", invoiceStatusValues)
        .default("issued")
        .notNull(),
    frequency: varchar("frequency", { length: 50 }),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueInvoice: uniqueIndex("business_invoice_idx")
        .on(table.businessId, table.invoiceNumber)
}));
