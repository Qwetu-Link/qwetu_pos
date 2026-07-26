import { db } from "@/db";
import { customerTable } from "@/db/schema/customers";
import { invoiceTable } from "@/db/schema/invoice";
import { orderTable } from "@/db/schema/orders";
import { expenseTable, paymentTable, transactionTable } from "@/db/schema/payments";
import type { Transaction, TransactionStatus } from "@/types/transactions";
import { desc, eq } from "drizzle-orm";

type TransactionRecord = typeof transactionTable.$inferSelect;

function getReadablePaymentMethod(method: TransactionRecord["paymentMethod"]) {
    if (method === "mpesa") return "M-Pesa";
    if (method === "airtel_money") return "Airtel Money";
    if (method === "bank") return "Bank Transfer";
    if (method === "card") return "Card";
    return "Cash";
}

function getDisplayStatus(status: TransactionRecord["status"]): TransactionStatus {
    if (status === "success") return "completed";
    if (status === "reversed") return "failed";
    return status;
}

function getTransactionContact(
    transaction: TransactionRecord,
    customerPhone?: string | null,
) {
    if (transaction.paymentMethod === "mpesa") {
        return transaction.mpesaPhoneNumber || customerPhone || "";
    }

    if (transaction.paymentMethod === "bank") {
        return transaction.bankAccountNumber || customerPhone || "";
    }

    return customerPhone ?? "";
}

export async function getTransactionsQuery(businessId: string): Promise<Transaction[]> {
    const rows = await db
        .select({
            transaction: transactionTable,
            payment: paymentTable,
            invoice: invoiceTable,
            order: orderTable,
            customer: customerTable,
            expense: expenseTable,
        })
        .from(transactionTable)
        .leftJoin(paymentTable, eq(paymentTable.id, transactionTable.paymentId))
        .leftJoin(invoiceTable, eq(invoiceTable.id, paymentTable.invoiceId))
        .leftJoin(orderTable, eq(orderTable.id, invoiceTable.orderId))
        .leftJoin(customerTable, eq(customerTable.id, orderTable.customerId))
        .leftJoin(expenseTable, eq(expenseTable.transactionId, transactionTable.id))
        .where(eq(transactionTable.businessId, businessId))
        .orderBy(desc(transactionTable.transactedAt));

    return rows.map(({ transaction, customer, expense }) => ({
        id: transaction.tnxId,
        date: transaction.transactedAt.toISOString(),
        customerId: customer?.id ?? expense?.id ?? "",
        customer: customer?.name ?? expense?.vendorName ?? "Business expense",
        customerPhone: getTransactionContact(transaction, customer?.phone ?? expense?.vendorContact),
        type: transaction.tnxType,
        method: getReadablePaymentMethod(transaction.paymentMethod),
        reference: transaction.reference ?? transaction.tnxId,
        amount: transaction.amount,
        status: getDisplayStatus(transaction.status),
    }));
}
