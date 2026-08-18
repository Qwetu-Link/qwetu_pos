import { defineRelations } from "drizzle-orm";
import { invoiceTable } from "@/db/schema/invoice";
import { orderTable } from "@/db/schema/orders";
import { paymentTable, transactionTable } from "@/db/schema/payments";

export const orderRelations = defineRelations(
    { orderTable, invoiceTable, paymentTable, transactionTable },
    ({ one, many, orderTable, invoiceTable, paymentTable, transactionTable }) => ({
        orderTable: {
            invoice: one.invoiceTable({
                from: orderTable.id,
                to: invoiceTable.orderId,
            }),
        },

        invoiceTable: {
            order: one.orderTable({
                from: invoiceTable.orderId,
                to: orderTable.id,
                optional: false,
            }),
            payments: many.paymentTable({
                from: invoiceTable.id,
                to: paymentTable.invoiceId,
            }),
        },

        paymentTable: {
            invoice: one.invoiceTable({
                from: paymentTable.invoiceId,
                to: invoiceTable.id,
                optional: false,
            }),
            transaction: one.transactionTable({
                from: paymentTable.id,
                to: transactionTable.paymentId,
            }),
        },

        transactionTable: {
            payment: one.paymentTable({
                from: transactionTable.paymentId,
                to: paymentTable.id,
            }),
        },
    }),
);
