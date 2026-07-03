import {
    integer,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { orderTable } from "./orders";

export const invoiceStatusEnum = pgEnum("invoice_status", [
    "draft",
    "issued",
    "partially_paid",
    "paid",
    "overdue",
    "cancelled",
]);

export const invoiceTable = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orderTable.id, {
            onDelete: "restrict",
        })
        .unique(),
    invoiceNumber: varchar("invoice_number", {
        length: 50,
    }).notNull().unique(),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").default(0).notNull(),
    tax: integer("tax").default(0).notNull(),
    total: integer("total").notNull(),
    balance: integer("balance").notNull(),
    installments: integer("installments").default(0).notNull(),
    installmentAmount: integer("installment_amount").default(0).notNull(),
    status: invoiceStatusEnum("status")
        .default("issued")
        .notNull(),
    frequency: varchar("frequency", { length: 50 }),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});