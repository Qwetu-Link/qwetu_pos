import {
    integer,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { invoiceTable } from "./invoice";

export const paymentTypeEnum = pgEnum("payment_type", ["full", "installment"]);
export const paymentStatusEnum = pgEnum("payment_status", ["paid", "partial", "unpaid"]);
export const paymentMethodEnum = pgEnum("payment_method", [
    "cash",
    "mpesa",
    "bank",
]);

export const paymentTable = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),

    invoiceId: uuid("invoice_id")
        .notNull()
        .references(() => invoiceTable.id, {
            onDelete: "cascade",
        }),
    amount: integer("amount").notNull(),
    paymentMethod: paymentMethodEnum("payment_method")
        .notNull(),
    reference: varchar("reference", {
        length: 255,
    }),
    receivedBy: uuid("received_by"),
    paidAt: timestamp("paid_at")
        .defaultNow()
        .notNull(),
    notes: varchar("notes", {
        length: 500,
    }),
});