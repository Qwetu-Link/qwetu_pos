import {
    boolean,
    index,
    int,
    mysqlEnum,
    mysqlTable,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { businessTable } from "./business";
import { randomUUID } from "crypto";

export const paymentTypeValues = ["full", "installment"] as const;
export const paymentStatusValues = ["paid", "partial", "unpaid"] as const;
const paymentMethodValues = [
    "cash",
    "mpesa",
    "airtel_money",
    "bank",
    "card",
] as const;
const paymentReceiptStatusValues = [
    "pending",
    "completed",
    "failed",
    "reversed",
] as const;

const mpesaChannelValues = [
    "paybill",
    "till",
    "send_money",
] as const;

const bankChannelValues = [
    "transfer",
    "cheque",
    "deposit",
    "rtgs",
    "eft",
] as const;

const tnxTypeValues = [
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
] as const;

const transactionStatusValues = [
    "pending",
    "success",
    "failed",
    "reversed",
] as const;

const expenseStatusValues = [
    "approved",
    "pending",
    "rejected",
] as const;

// Categorize what the money was spent on
const expenseCategoryValues = [
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
 ] as const;

export const paymentTable = mysqlTable("payments", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    invoiceId: varchar("invoice_id", { length: 36 }).notNull(),
    amount: int("amount").notNull(),
    status: mysqlEnum("status", paymentReceiptStatusValues)
        .default("completed")
        .notNull(),
    receivedBy: varchar("received_by", { length: 36 }),
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

export const transactionTable = mysqlTable("transactions", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    paymentId: varchar("payment_id", { length: 36 })
        .references(() => paymentTable.id, {
            onDelete: "cascade",
        }),
    tnxId: varchar("tnx_id", { length: 50 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("KES").notNull(),
    amount: int("amount").notNull(),
    tnxType: mysqlEnum("tnx_type", tnxTypeValues).notNull(),
    status: mysqlEnum("status", transactionStatusValues)
        .default("success")
        .notNull(),
    paymentMethod: mysqlEnum("payment_method", paymentMethodValues).notNull(),
    provider: varchar("provider", { length: 100 }),
    reference: varchar("reference", { length: 255 }),

    mpesaChannel: mysqlEnum("mpesa_channel", mpesaChannelValues),
    mpesaReceiptNumber: varchar("mpesa_receipt_number", { length: 20 }),
    mpesaPhoneNumber: varchar("mpesa_phone_number", { length: 15 }),
    mpesaPaybillOrTill: varchar("mpesa_paybill_or_till", { length: 20 }),
    merchantRequestID: varchar("merchant_request_id", { length: 50 }),
    checkoutRequestID: varchar("checkout_request_id", { length: 50 }),

    bankChannel: mysqlEnum("bank_channel", bankChannelValues),
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


export const expenseTable = mysqlTable("expenses", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, { onDelete: "cascade" }),
    expenseNo: varchar("expense_no", { length: 20 }).notNull(),

    // 1:1 link back to the ledger entry (transactionTable row must have
    // tnxTpye = "expense")
    transactionId: varchar("transaction_id", { length: 36 })
        .notNull()
        .references(() => transactionTable.id, { onDelete: "cascade" }),
    category: mysqlEnum("category", expenseCategoryValues).notNull(),
    vendorName: varchar("vendor_name", { length: 150 }),
    vendorContact: varchar("vendor_contact", { length: 50 }),

    amount: int("amount").notNull(), // mirrors transaction.amount for convenience/reporting
    status: mysqlEnum("status", expenseStatusValues).default("pending").notNull(),
    receiptUrl: varchar("receipt_url", { length: 500 }), // uploaded receipt/invoice image or PDF
    isRecurring: boolean("is_recurring").default(false),

    approvedBy: varchar("approved_by", { length: 36 }), // user id of whoever approved/authorized the spend
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

export const expenseItemTable = mysqlTable("expense_items", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, { onDelete: "cascade" }),
    expenseId: varchar("expense_id", { length: 36 })
        .notNull()
        .references(() => expenseTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    quantity: int("quantity").default(1).notNull(),
    unitCost: int("unit_cost").notNull(),
    total: int("total").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    expenseIdx: index("expense_items_expense_idx").on(table.expenseId),
}));
