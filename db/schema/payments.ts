import {
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { businessTable } from "./business";
import { invoiceTable } from "./invoice";

export const paymentTypeEnum = pgEnum("payment_type", ["full", "installment"]);
export const paymentStatusEnum = pgEnum("payment_status", ["paid", "partial", "unpaid"]);
export const paymentMethodEnum = pgEnum("payment_method", [
    "cash",
    "mpesa",
    "airtel_money",
    "bank",
    "card",
]);
export const paymentReceiptStatusEnum = pgEnum("payment_receipt_status", [
    "pending",
    "completed",
    "failed",
    "reversed",
]);

export const mpesaChannelEnum = pgEnum("mpesa_channel", [
    "paybill",
    "till",
    "send_money",
]);

export const bankChannelEnum = pgEnum("bank_channel", [
    "transfer",
    "cheque",
    "deposit",
    "rtgs",
    "eft",
]);

export const tnxTypeEnum = pgEnum("tnx_type", [
    "sale",
    "refund",
    "installment",
    "payment",
    "deposit",
    "withdrawal",
    "expense",
    "purchase",
    "purchase_return",
    "discount",
    "adjustment",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
    "pending",
    "success",
    "failed",
    "reversed",
]);

export const expenseStatusEnum = pgEnum("expense_status", [
    "approved",
    "pending",
    "rejected",
]);

// Categorize what the money was spent on
export const expenseCategoryEnum = pgEnum("expense_category", [
    "rent",
    "utilities",
    "salaries",
    "transport",
    "supplies",
    "inventory_purchase",
    "marketing",
    "equipment",
    "maintenance",
    "insurance",
    "taxes",
    "loan_repayment",
    "other",
]);

export const paymentTable = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    invoiceId: uuid("invoice_id")
        .notNull()
        .references(() => invoiceTable.id, {
            onDelete: "cascade",
        }),
    amount: integer("amount").notNull(),
    status: paymentReceiptStatusEnum("status")
        .default("completed")
        .notNull(),
    receivedBy: uuid("received_by"),
    paidAt: timestamp("paid_at")
        .defaultNow()
        .notNull(),
    notes: varchar("notes", {
        length: 500,
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    invoiceIdx: index("payments_invoice_idx").on(table.invoiceId),
    businessPaidAtIdx: index("payments_business_paid_at_idx").on(table.businessId, table.paidAt),
}));

export const transactionTable = pgTable("transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    paymentId: uuid("payment_id")
        .references(() => paymentTable.id, {
            onDelete: "cascade",
        }),
    tnxId: varchar("tnx_id", { length: 50 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("KES").notNull(),
    amount: integer("amount").notNull(),
    tnxType: tnxTypeEnum("tnx_type").notNull(),
    status: transactionStatusEnum("status")
        .default("success")
        .notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    provider: varchar("provider", { length: 100 }),
    reference: varchar("reference", { length: 255 }),

    mpesaChannel: mpesaChannelEnum("mpesa_channel"),
    mpesaReceiptNumber: varchar("mpesa_receipt_number", { length: 20 }),
    mpesaPhoneNumber: varchar("mpesa_phone_number", { length: 15 }),
    mpesaPaybillOrTill: varchar("mpesa_paybill_or_till", { length: 20 }),
    merchantRequestID: varchar("merchant_request_id", { length: 50 }),
    checkoutRequestID: varchar("checkout_request_id", { length: 50 }),

    bankChannel: bankChannelEnum("bank_channel"),
    bankName: varchar("bank_name", { length: 100 }),
    bankAccountNumber: varchar("bank_account_number", { length: 50 }),
    bankBranch: varchar("bank_branch", { length: 100 }),
    bankTransactionRef: varchar("bank_transaction_ref", { length: 50 }),
    terminalId: varchar("terminal_id", { length: 50 }),
    authorizationCode: varchar("authorization_code", { length: 50 }),

    transactedAt: timestamp("transacted_at")
        .defaultNow()
        .notNull(),
    notes: varchar("notes", {
        length: 500,
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    paymentUniqueIdx: uniqueIndex("transactions_payment_unique_idx").on(table.paymentId),
    businessTnxUniqueIdx: uniqueIndex("transactions_business_tnx_unique_idx").on(table.businessId, table.tnxId),
    referenceIdx: index("transactions_reference_idx").on(table.reference),
}));


export const expenseTable = pgTable("expenses", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, { onDelete: "cascade" }),
    expenseNo: varchar("expense_no", { length: 20 }).notNull(),

    // 1:1 link back to the ledger entry (transactionTable row must have
    // tnxTpye = "expense")
    transactionId: uuid("transaction_id")
        .notNull()
        .references(() => transactionTable.id, { onDelete: "cascade" }),
    category: expenseCategoryEnum("category").notNull(),
    vendorName: varchar("vendor_name", { length: 150 }),
    vendorContact: varchar("vendor_contact", { length: 50 }),

    amount: integer("amount").notNull(), // mirrors transaction.amount for convenience/reporting
    status: expenseStatusEnum("status").default("pending").notNull(),
    receiptUrl: varchar("receipt_url", { length: 500 }), // uploaded receipt/invoice image or PDF
    isRecurring: boolean("is_recurring").default(false),

    approvedBy: uuid("approved_by"), // user id of whoever approved/authorized the spend
    approvedAt: timestamp("approved_at"),

    notes: varchar("notes", { length: 500 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    businessExpenseNoIdx: uniqueIndex("business_expense_no_idx").on(table.businessId, table.expenseNo),
}));

export const expenseItemTable = pgTable("expense_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, { onDelete: "cascade" }),
    expenseId: uuid("expense_id")
        .notNull()
        .references(() => expenseTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    unitCost: integer("unit_cost").notNull(),
    total: integer("total").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    expenseIdx: index("expense_items_expense_idx").on(table.expenseId),
}));
