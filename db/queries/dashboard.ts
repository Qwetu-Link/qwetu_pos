import { db } from "@/db";
import { customerTable } from "@/db/schema/customers";
import { invoiceTable } from "@/db/schema/invoice";
import { orderTable } from "@/db/schema/orders";
import { expenseTable, transactionTable } from "@/db/schema/payments";
import { productsTable } from "@/db/schema/products";
import { variantInventoryTable, variantsTable } from "@/db/schema/variants";
import type { DashboardActivity, DashboardBar, DashboardTone } from "@/types/dashboard";
import type { DashboardSummary } from "@/types/dashboard-live";
import { and, count, desc, eq, gt, gte, inArray, lte, ne, or, sql } from "drizzle-orm";

type PaymentMethod = typeof transactionTable.$inferSelect.paymentMethod;

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toNumber(value: unknown) {
    if (typeof value === "number") return value;
    if (typeof value === "bigint") return Number(value);
    if (typeof value === "string") return Number(value) || 0;
    return 0;
}

function clampPercent(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function getRelativeTime(date: Date) {
    const diff = Date.now() - date.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatMethod(method: PaymentMethod) {
    if (method === "mpesa") return "M-Pesa";
    if (method === "airtel_money") return "Airtel";
    if (method === "bank") return "Bank";
    if (method === "card") return "Card";
    return "Cash";
}

function getTransactionTone(status: typeof transactionTable.$inferSelect.status): DashboardTone {
    if (status === "success") return "emerald";
    if (status === "pending") return "amber";
    if (status === "failed" || status === "reversed") return "red";
    return "slate";
}

function buildBars(
    values: { label: string; value: number; caption: string }[],
    fallback: DashboardBar[],
): DashboardBar[] {
    const max = Math.max(...values.map((item) => item.value), 0);
    if (max <= 0) return fallback;

    return values.map((item) => ({
        label: item.label,
        value: clampPercent((item.value / max) * 100),
        caption: item.caption,
    }));
}

async function getScalar<T extends Record<string, unknown>>(query: Promise<T[]>, key: keyof T) {
    const [row] = await query;
    return toNumber(row?.[key]);
}

export async function getDashboardSummaryQuery(businessId: string): Promise<DashboardSummary> {
    const now = new Date();
    const today = startOfDay(now);
    const month = startOfMonth(now);

    const [
        revenueToday,
        revenueMonth,
        ordersToday,
        openOrders,
        awaitingPayment,
        activeCustomers,
        newCustomersMonth,
        collectionsDue,
        activePlans,
        receiptsToday,
        receiptsTodayCount,
        expensesMonth,
        pendingExpenses,
        stockValue,
        products,
        variants,
        lowStock,
        criticalStock,
        completedSalesToday,
        installmentsToday,
        paymentRows,
        stockRows,
        orderRows,
        activityRows,
    ] = await Promise.all([
        getScalar(db.select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, today),
            )), "total"),
        getScalar(db.select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, month),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(orderTable)
            .where(and(eq(orderTable.businessId, businessId), gte(orderTable.createdAt, today))), "total"),
        getScalar(db.select({ total: count() })
            .from(orderTable)
            .where(and(
                eq(orderTable.businessId, businessId),
                inArray(orderTable.status, ["pending", "processing", "shipped"]),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(orderTable)
            .where(and(
                eq(orderTable.businessId, businessId),
                ne(orderTable.paymentStatus, "paid"),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(customerTable)
            .where(eq(customerTable.businessId, businessId)), "total"),
        getScalar(db.select({ total: count() })
            .from(customerTable)
            .where(and(eq(customerTable.businessId, businessId), gte(customerTable.createdAt, month))), "total"),
        getScalar(db.select({ total: sql<number>`coalesce(sum(${invoiceTable.balance}), 0)` })
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.businessId, businessId),
                gt(invoiceTable.balance, 0),
                ne(invoiceTable.status, "cancelled"),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.businessId, businessId),
                gt(invoiceTable.installments, 0),
                gt(invoiceTable.balance, 0),
                ne(invoiceTable.status, "cancelled"),
            )), "total"),
        getScalar(db.select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, today),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, today),
            )), "total"),
        getScalar(db.select({ total: sql<number>`abs(coalesce(sum(${expenseTable.amount}), 0))` })
            .from(expenseTable)
            .where(and(eq(expenseTable.businessId, businessId), gte(expenseTable.createdAt, month))), "total"),
        getScalar(db.select({ total: count() })
            .from(expenseTable)
            .where(and(eq(expenseTable.businessId, businessId), eq(expenseTable.status, "pending"))), "total"),
        getScalar(db.select({ total: sql<number>`coalesce(sum(${variantInventoryTable.totalStock} * ${variantsTable.sellPrice}), 0)` })
            .from(variantInventoryTable)
            .innerJoin(variantsTable, eq(variantsTable.id, variantInventoryTable.variantId))
            .where(eq(variantInventoryTable.businessId, businessId)), "total"),
        getScalar(db.select({ total: count() })
            .from(productsTable)
            .where(eq(productsTable.businessId, businessId)), "total"),
        getScalar(db.select({ total: count() })
            .from(variantsTable)
            .where(eq(variantsTable.businessId, businessId)), "total"),
        getScalar(db.select({ total: count() })
            .from(variantInventoryTable)
            .where(and(
                eq(variantInventoryTable.businessId, businessId),
                or(
                    inArray(variantInventoryTable.status, ["low", "critical", "reorder"]),
                    lte(variantInventoryTable.totalStock, variantInventoryTable.reorderPoint),
                ),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(variantInventoryTable)
            .where(and(
                eq(variantInventoryTable.businessId, businessId),
                or(
                    eq(variantInventoryTable.status, "critical"),
                    lte(variantInventoryTable.totalStock, 0),
                ),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(orderTable)
            .where(and(
                eq(orderTable.businessId, businessId),
                eq(orderTable.paymentStatus, "paid"),
                gte(orderTable.createdAt, today),
            )), "total"),
        getScalar(db.select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                inArray(transactionTable.tnxType, ["installment", "deposit", "payment"]),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, today),
            )), "total"),
        db.select({
            method: transactionTable.paymentMethod,
            total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)`,
        })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, month),
            ))
            .groupBy(transactionTable.paymentMethod),
        db.select({
            status: variantInventoryTable.status,
            total: count(),
        })
            .from(variantInventoryTable)
            .where(eq(variantInventoryTable.businessId, businessId))
            .groupBy(variantInventoryTable.status),
        db.select({
            status: orderTable.status,
            total: count(),
        })
            .from(orderTable)
            .where(eq(orderTable.businessId, businessId))
            .groupBy(orderTable.status),
        db.select()
            .from(transactionTable)
            .where(eq(transactionTable.businessId, businessId))
            .orderBy(desc(transactionTable.transactedAt))
            .limit(5),
    ]);

    const paymentBars = buildBars(
        paymentRows.map((row) => ({
            label: formatMethod(row.method),
            value: toNumber(row.total),
            caption: "Collected this month",
        })),
        [{ label: "Receipts", value: 0, caption: "No collections yet" }],
    );
    const stockBars = buildBars(
        stockRows.map((row) => ({
            label: row.status.charAt(0).toUpperCase() + row.status.slice(1),
            value: toNumber(row.total),
            caption: "Inventory records",
        })),
        [{ label: "Stock", value: 0, caption: "No stock records yet" }],
    );
    const orderBars = buildBars(
        orderRows.map((row) => ({
            label: row.status.charAt(0).toUpperCase() + row.status.slice(1),
            value: toNumber(row.total),
            caption: "Order queue",
        })),
        [{ label: "Orders", value: 0, caption: "No orders yet" }],
    );
    const activities: DashboardActivity[] = activityRows.map((transaction) => ({
        title: `${transaction.tnxType.charAt(0).toUpperCase() + transaction.tnxType.slice(1)} ${transaction.tnxId}`,
        detail: `${formatMethod(transaction.paymentMethod)} ${transaction.status} transaction for KES ${Math.abs(transaction.amount).toLocaleString()}.`,
        time: getRelativeTime(transaction.transactedAt),
        tone: getTransactionTone(transaction.status),
    }));

    return {
        revenueToday,
        revenueMonth,
        ordersToday,
        openOrders,
        awaitingPayment,
        activeCustomers,
        newCustomersMonth,
        collectionsDue,
        activePlans,
        receiptsToday,
        receiptsTodayCount,
        expensesMonth,
        pendingExpenses,
        stockValue,
        products,
        variants,
        lowStock,
        criticalStock,
        completedSalesToday,
        installmentsToday,
        reportsReady: receiptsTodayCount > 0 || revenueMonth > 0 ? 1 : 0,
        pendingReconciliation: pendingExpenses + awaitingPayment,
        activities,
        paymentBars,
        stockBars,
        orderBars,
    };
}
