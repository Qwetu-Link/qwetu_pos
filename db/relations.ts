import { relations } from "drizzle-orm";
import { invoiceTable } from "@/db/schema/invoice";
import { orderTable } from "@/db/schema/orders";
import { paymentTable, transactionTable } from "@/db/schema/payments";

export const orderRelations = relations(orderTable, ({ one }) => ({
    invoice: one(invoiceTable, {
        fields: [orderTable.id],
        references: [invoiceTable.orderId],
    }),
}));

export const invoiceRelations = relations(invoiceTable, ({ one, many }) => ({
    order: one(orderTable, {
        fields: [invoiceTable.orderId],
        references: [orderTable.id],
    }),
    payments: many(paymentTable),
}));

export const paymentRelations = relations(paymentTable, ({ one }) => ({
    invoice: one(invoiceTable, {
        fields: [paymentTable.invoiceId],
        references: [invoiceTable.id],
    }),
    transaction: one(transactionTable, {
        fields: [paymentTable.id],
        references: [transactionTable.paymentId],
    }),
}));

export const transactionRelations = relations(transactionTable, ({ one }) => ({
    payment: one(paymentTable, {
        fields: [transactionTable.paymentId],
        references: [paymentTable.id],
    }),
}));
