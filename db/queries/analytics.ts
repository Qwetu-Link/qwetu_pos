import { db } from "@/db";
import { categoryTable } from "@/db/schema/category";
import { customerTable } from "@/db/schema/customers";
import { invoiceTable } from "@/db/schema/invoice";
import { orderItemTable, orderTable } from "@/db/schema/orders";
import { transactionTable } from "@/db/schema/payments";
import { productsTable } from "@/db/schema/products";
import type { AnalyticsPeriod, AnalyticsSummary, PlanDurationMetric } from "@/types/analytics";
import type {
    CategoryMetric,
    CollectionMetric,
    PaymentMethodMetric,
    RevenueMonth,
    SegmentMetric,
} from "@/types/settings";
import { and, count, desc, eq, gt, gte, isNull, lt, ne, or, sql } from "drizzle-orm";

const categoryColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#14b8a6"];
const periodMonths: Record<AnalyticsPeriod, number> = {
    last_3_months: 3,
    last_6_months: 6,
    last_12_months: 12,
};

function toNumber(value: unknown) {
    if (typeof value === "number") return value;
    if (typeof value === "bigint") return Number(value);
    if (typeof value === "string") return Number(value) || 0;
    return 0;
}

function addMonths(date: Date, months: number) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date: Date) {
    return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

function getMonthSlots(start: Date, length: number) {
    return Array.from({ length }, (_, index) => {
        const date = addMonths(start, index);
        return {
            key: getMonthKey(date),
            label: getMonthLabel(date),
        };
    });
}

function getMethodLabel(method: typeof transactionTable.$inferSelect.paymentMethod) {
    if (method === "mpesa") return "M-Pesa";
    if (method === "airtel_money") return "Airtel Money";
    if (method === "bank") return "Bank Transfer";
    if (method === "card") return "Card";
    return "Cash";
}

async function getScalar<T extends Record<string, unknown>>(query: Promise<T[]>, key: keyof T) {
    const [row] = await query;
    return toNumber(row?.[key]);
}

function buildRevenueTrend(
    months: { key: string; label: string }[],
    rows: { month: string; type: typeof transactionTable.$inferSelect.tnxType; total: unknown }[],
): RevenueMonth[] {
    const grouped = new Map<string, RevenueMonth>();
    months.forEach((month) => {
        grouped.set(month.key, {
            month: month.label,
            fullPayments: 0,
            installments: 0,
        });
    });

    rows.forEach((row) => {
        const current = grouped.get(row.month);
        if (!current) return;

        if (["installment", "deposit", "payment"].includes(row.type)) {
            current.installments += toNumber(row.total);
            return;
        }

        current.fullPayments += toNumber(row.total);
    });

    return [...grouped.values()];
}

function buildCollectionTrend(
    months: { key: string; label: string }[],
    rows: {
        dueDate: Date | null;
        createdAt: Date;
        total: number;
        balance: number;
    }[],
): CollectionMetric[] {
    const grouped = new Map<string, CollectionMetric>();
    months.forEach((month) => {
        grouped.set(month.key, {
            month: month.label,
            expected: 0,
            collected: 0,
        });
    });

    rows.forEach((row) => {
        const current = grouped.get(getMonthKey(row.dueDate ?? row.createdAt));
        if (!current) return;
        current.expected += row.total;
        current.collected += row.total - row.balance;
    });

    return [...grouped.values()];
}

function getPlanDurations(rows: { installments: number; total: unknown }[]): PlanDurationMetric[] {
    const totalPlans = rows.reduce((sum, row) => sum + toNumber(row.total), 0);
    if (!totalPlans) return [];

    return rows.map((row) => ({
        months: row.installments || 1,
        percentage: Math.round((toNumber(row.total) / totalPlans) * 100),
    }));
}

export async function getAnalyticsSummaryQuery(
    businessId: string,
    period: AnalyticsPeriod = "last_6_months",
): Promise<AnalyticsSummary> {
    const currentEnd = new Date();
    const monthCount = periodMonths[period];
    const currentStart = addMonths(startOfMonth(currentEnd), -(monthCount - 1));
    const previousStart = addMonths(currentStart, -monthCount);
    const months = getMonthSlots(currentStart, monthCount);

    const [
        totalRevenue,
        previousRevenue,
        totalOrders,
        previousOrders,
        activeCustomers,
        previousCustomers,
        revenueRows,
        categoryRows,
        segmentRows,
        paymentRows,
        planRows,
        overduePlans,
        activePlans,
        failedPlans,
        newCustomers,
        orderCustomers,
        collectionRows,
    ] = await Promise.all([
        getScalar(db.select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, currentStart),
            )), "total"),
        getScalar(db.select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, previousStart),
                lt(transactionTable.transactedAt, currentStart),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(orderTable)
            .where(and(
                eq(orderTable.businessId, businessId),
                gte(orderTable.createdAt, currentStart),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(orderTable)
            .where(and(
                eq(orderTable.businessId, businessId),
                gte(orderTable.createdAt, previousStart),
                lt(orderTable.createdAt, currentStart),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(customerTable)
            .where(eq(customerTable.businessId, businessId)), "total"),
        getScalar(db.select({ total: count() })
            .from(customerTable)
            .where(and(
                eq(customerTable.businessId, businessId),
                lt(customerTable.createdAt, currentStart),
            )), "total"),
        db.select({
            month: sql<string>`date_format(${transactionTable.transactedAt}, '%Y-%m')`,
            type: transactionTable.tnxType,
            total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)`,
        })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, currentStart),
            ))
            .groupBy(sql`date_format(${transactionTable.transactedAt}, '%Y-%m')`, transactionTable.tnxType),
        db.select({
            name: categoryTable.name,
            value: sql<number>`coalesce(sum(${orderItemTable.quantity} * ${orderItemTable.price}), 0)`,
        })
            .from(orderItemTable)
            .innerJoin(orderTable, eq(orderTable.id, orderItemTable.orderId))
            .innerJoin(productsTable, eq(productsTable.id, orderItemTable.productId))
            .innerJoin(categoryTable, eq(categoryTable.id, productsTable.categoryId))
            .where(and(
                eq(orderItemTable.businessId, businessId),
                gte(orderItemTable.createdAt, currentStart),
            ))
            .groupBy(categoryTable.name)
            .orderBy(desc(sql`coalesce(sum(${orderItemTable.quantity} * ${orderItemTable.price}), 0)`))
            .limit(6),
        db.select({
            segment: customerTable.segment,
            customers: count(),
            revenue: sql<number>`coalesce(sum(${orderTable.total}), 0)`,
        })
            .from(customerTable)
            .leftJoin(orderTable, and(
                eq(orderTable.customerId, customerTable.id),
                gte(orderTable.createdAt, currentStart),
            ))
            .where(eq(customerTable.businessId, businessId))
            .groupBy(customerTable.segment),
        db.select({
            method: transactionTable.paymentMethod,
            transactions: count(),
            amount: sql<number>`coalesce(sum(${transactionTable.amount}), 0)`,
        })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.status, "success"),
                gt(transactionTable.amount, 0),
                gte(transactionTable.transactedAt, currentStart),
            ))
            .groupBy(transactionTable.paymentMethod),
        db.select({
            installments: invoiceTable.installments,
            total: count(),
        })
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.businessId, businessId),
                gt(invoiceTable.installments, 0),
                ne(invoiceTable.status, "cancelled"),
            ))
            .groupBy(invoiceTable.installments)
            .orderBy(invoiceTable.installments),
        getScalar(db.select({ total: count() })
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.businessId, businessId),
                gt(invoiceTable.balance, 0),
                lt(invoiceTable.dueDate, currentEnd),
                ne(invoiceTable.status, "cancelled"),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.businessId, businessId),
                gt(invoiceTable.installments, 0),
                ne(invoiceTable.status, "cancelled"),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.businessId, businessId),
                eq(invoiceTable.status, "overdue"),
            )), "total"),
        getScalar(db.select({ total: count() })
            .from(customerTable)
            .where(and(
                eq(customerTable.businessId, businessId),
                gte(customerTable.createdAt, currentStart),
            )), "total"),
        db.select({ customerId: orderTable.customerId })
            .from(orderTable)
            .where(and(
                eq(orderTable.businessId, businessId),
                gte(orderTable.createdAt, currentStart),
            )),
        db.select({
            dueDate: invoiceTable.dueDate,
            createdAt: invoiceTable.createdAt,
            total: invoiceTable.total,
            balance: invoiceTable.balance,
        })
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.businessId, businessId),
                or(
                    gte(invoiceTable.dueDate, currentStart),
                    and(isNull(invoiceTable.dueDate), gte(invoiceTable.createdAt, currentStart)),
                ),
                ne(invoiceTable.status, "cancelled"),
            )),
    ]);

    const revenueTrend = buildRevenueTrend(months, revenueRows);
    const installmentRevenue = revenueTrend.reduce((sum, item) => sum + item.installments, 0);
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const previousAvgOrderValue = previousOrders ? previousRevenue / previousOrders : 0;
    const customerOrderCounts = new Map<string, number>();
    orderCustomers.forEach((row) => {
        customerOrderCounts.set(row.customerId, (customerOrderCounts.get(row.customerId) ?? 0) + 1);
    });
    const returningCustomers = [...customerOrderCounts.values()].filter((orders) => orders > 1).length;
    const retentionRate = activeCustomers ? (returningCustomers / activeCustomers) * 100 : 0;
    const customerLtv = activeCustomers ? totalRevenue / activeCustomers : 0;

    const categorySales: CategoryMetric[] = categoryRows.map((row, index) => ({
        name: row.name,
        value: toNumber(row.value),
        color: categoryColors[index % categoryColors.length],
    }));
    const customerSegments: SegmentMetric[] = segmentRows.map((row) => ({
        segment: row.segment,
        customers: toNumber(row.customers),
        revenue: toNumber(row.revenue),
    }));
    const paymentMethods: PaymentMethodMetric[] = paymentRows.map((row) => ({
        method: getMethodLabel(row.method),
        transactions: toNumber(row.transactions),
        amount: toNumber(row.amount),
    }));
    const defaultRate = activePlans ? (failedPlans / activePlans) * 100 : 0;

    return {
        totalRevenue,
        previousRevenue,
        totalOrders,
        previousOrders,
        activeCustomers,
        previousCustomers,
        avgOrderValue,
        previousAvgOrderValue,
        installmentRevenue,
        overduePlans,
        defaultRate,
        newCustomers,
        returningCustomers,
        retentionRate,
        customerLtv,
        revenueTrend,
        categorySales,
        customerSegments,
        paymentMethods,
        planDurations: getPlanDurations(planRows),
        collectionTrend: buildCollectionTrend(months, collectionRows),
    };
}

