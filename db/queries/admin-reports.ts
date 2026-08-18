import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { customerTable } from "@/db/schema/customers";
import { invoiceTable } from "@/db/schema/invoice";
import { orderItemTable, orderTable } from "@/db/schema/orders";
import { expenseTable, transactionTable } from "@/db/schema/payments";
import { productsTable } from "@/db/schema/products";
import { variantInventoryTable, variantsTable } from "@/db/schema/variants";
import { and, count, desc, eq, gt, gte, inArray, lt, lte, ne, or, sql } from "drizzle-orm";

export type AdminReportMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "emerald" | "blue" | "amber" | "red" | "slate";
};

export type AdminReportCard = {
  id: string;
  title: string;
  description: string;
  value: string;
  status: "Ready" | "Review";
};

export type AdminRevenuePoint = {
  month: string;
  revenue: number;
  expenses: number;
  height: number;
};

export type AdminTopProductRow = {
  name: string;
  sku: string;
  quantity: number;
  revenue: number;
};

export type AdminInventoryRow = {
  product: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  reorderPoint: number;
  status: string;
};

export type AdminCustomerSegmentRow = {
  segment: string;
  customers: number;
  totalSpent: number;
};

export type AdminTransactionRow = {
  tnxId: string;
  type: string;
  method: string;
  status: string;
  amount: number;
  transactedAt: Date;
};

export type AdminReportCenterData = {
  generatedAt: Date;
  periodLabel: string;
  business: {
    id: string;
    name: string;
    email: string;
    phone: string;
    currency: string;
  };
  metrics: AdminReportMetric[];
  reportCards: AdminReportCard[];
  revenueTrend: AdminRevenuePoint[];
  topProducts: AdminTopProductRow[];
  inventory: AdminInventoryRow[];
  customerSegments: AdminCustomerSegmentRow[];
  transactions: AdminTransactionRow[];
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

function formatMoney(value: number, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.round(value)}%`;
}

function getChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function paymentMethodLabel(method: typeof transactionTable.$inferSelect.paymentMethod) {
  if (method === "mpesa") return "M-Pesa";
  if (method === "airtel_money") return "Airtel Money";
  if (method === "bank") return "Bank";
  if (method === "card") return "Card";
  return "Cash";
}

async function getScalar<T extends Record<string, unknown>>(query: Promise<T[]>, key: keyof T) {
  const [row] = await query;
  return toNumber(row?.[key]);
}

export async function getAdminReportCenterData(businessId: string): Promise<AdminReportCenterData> {
  const generatedAt = new Date();
  const currentMonthStart = startOfMonth(generatedAt);
  const previousMonthStart = addMonths(currentMonthStart, -1);
  const trendStart = addMonths(currentMonthStart, -5);
  const trendMonths = Array.from({ length: 6 }, (_, index) => {
    const date = addMonths(trendStart, index);
    return {
      key: getMonthKey(date),
      label: getMonthLabel(date),
    };
  });

  const [
    business,
    currentRevenue,
    previousRevenue,
    currentOrders,
    previousOrders,
    outstanding,
    overdueInvoices,
    activeCustomers,
    newCustomers,
    stockAlerts,
    expensesMonth,
    revenueTrendRows,
    expenseTrendRows,
    topProductRows,
    inventoryRows,
    segmentRows,
    transactionRows,
  ] = await Promise.all([
    db
      .select({
        id: businessTable.id,
        name: businessTable.businessName,
        email: businessTable.email,
        phone: businessTable.phone,
        currency: businessTable.currency,
      })
      .from(businessTable)
      .where(eq(businessTable.id, businessId))
      .limit(1),
    getScalar(
      db
        .select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
        .from(transactionTable)
        .where(and(
          eq(transactionTable.businessId, businessId),
          eq(transactionTable.status, "success"),
          gt(transactionTable.amount, 0),
          gte(transactionTable.transactedAt, currentMonthStart),
        )),
      "total",
    ),
    getScalar(
      db
        .select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
        .from(transactionTable)
        .where(and(
          eq(transactionTable.businessId, businessId),
          eq(transactionTable.status, "success"),
          gt(transactionTable.amount, 0),
          gte(transactionTable.transactedAt, previousMonthStart),
          lt(transactionTable.transactedAt, currentMonthStart),
        )),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(orderTable)
        .where(and(eq(orderTable.businessId, businessId), gte(orderTable.createdAt, currentMonthStart))),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(orderTable)
        .where(and(
          eq(orderTable.businessId, businessId),
          gte(orderTable.createdAt, previousMonthStart),
          lt(orderTable.createdAt, currentMonthStart),
        )),
      "total",
    ),
    getScalar(
      db
        .select({ total: sql<number>`coalesce(sum(${invoiceTable.balance}), 0)` })
        .from(invoiceTable)
        .where(and(eq(invoiceTable.businessId, businessId), ne(invoiceTable.status, "cancelled"))),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(invoiceTable)
        .where(and(
          eq(invoiceTable.businessId, businessId),
          gt(invoiceTable.balance, 0),
          lt(invoiceTable.dueDate, generatedAt),
          ne(invoiceTable.status, "cancelled"),
        )),
      "total",
    ),
    getScalar(
      db.select({ total: count() }).from(customerTable).where(eq(customerTable.businessId, businessId)),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(customerTable)
        .where(and(eq(customerTable.businessId, businessId), gte(customerTable.createdAt, currentMonthStart))),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(variantInventoryTable)
        .where(and(
          eq(variantInventoryTable.businessId, businessId),
          or(
            inArray(variantInventoryTable.status, ["low", "critical", "reorder"]),
            lte(variantInventoryTable.totalStock, variantInventoryTable.reorderPoint),
          ),
        )),
      "total",
    ),
    getScalar(
      db
        .select({ total: sql<number>`abs(coalesce(sum(${expenseTable.amount}), 0))` })
        .from(expenseTable)
        .where(and(eq(expenseTable.businessId, businessId), gte(expenseTable.createdAt, currentMonthStart))),
      "total",
    ),
    db
      .select({
        month: sql<string>`date_format(${transactionTable.transactedAt}, '%Y-%m')`,
        total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)`,
      })
      .from(transactionTable)
      .where(and(
        eq(transactionTable.businessId, businessId),
        eq(transactionTable.status, "success"),
        gt(transactionTable.amount, 0),
        gte(transactionTable.transactedAt, trendStart),
      ))
      .groupBy(sql`date_format(${transactionTable.transactedAt}, '%Y-%m')`),
    db
      .select({
        month: sql<string>`date_format(${expenseTable.createdAt}, '%Y-%m')`,
        total: sql<number>`abs(coalesce(sum(${expenseTable.amount}), 0))`,
      })
      .from(expenseTable)
      .where(and(eq(expenseTable.businessId, businessId), gte(expenseTable.createdAt, trendStart)))
      .groupBy(sql`date_format(${expenseTable.createdAt}, '%Y-%m')`),
    db
      .select({
        name: orderItemTable.name,
        sku: orderItemTable.sku,
        quantity: sql<number>`coalesce(sum(${orderItemTable.quantity}), 0)`,
        revenue: sql<number>`coalesce(sum(${orderItemTable.quantity} * ${orderItemTable.price}), 0)`,
      })
      .from(orderItemTable)
      .innerJoin(orderTable, eq(orderTable.id, orderItemTable.orderId))
      .where(and(eq(orderItemTable.businessId, businessId), gte(orderItemTable.createdAt, trendStart)))
      .groupBy(orderItemTable.name, orderItemTable.sku)
      .orderBy(desc(sql`coalesce(sum(${orderItemTable.quantity} * ${orderItemTable.price}), 0)`))
      .limit(8),
    db
      .select({
        product: productsTable.name,
        sku: variantsTable.sku,
        color: variantsTable.color,
        size: variantsTable.size,
        stock: variantInventoryTable.totalStock,
        reorderPoint: variantInventoryTable.reorderPoint,
        status: variantInventoryTable.status,
      })
      .from(variantInventoryTable)
      .innerJoin(variantsTable, eq(variantsTable.id, variantInventoryTable.variantId))
      .innerJoin(productsTable, eq(productsTable.id, variantsTable.productId))
      .where(and(
        eq(variantInventoryTable.businessId, businessId),
        or(
          inArray(variantInventoryTable.status, ["low", "critical", "reorder"]),
          lte(variantInventoryTable.totalStock, variantInventoryTable.reorderPoint),
        ),
      ))
      .orderBy(variantInventoryTable.totalStock)
      .limit(12),
    db
      .select({
        segment: customerTable.segment,
        customers: count(),
        totalSpent: sql<number>`coalesce(sum(${customerTable.totalSpent}), 0)`,
      })
      .from(customerTable)
      .where(eq(customerTable.businessId, businessId))
      .groupBy(customerTable.segment),
    db
      .select({
        tnxId: transactionTable.tnxId,
        type: transactionTable.tnxType,
        method: transactionTable.paymentMethod,
        status: transactionTable.status,
        amount: transactionTable.amount,
        transactedAt: transactionTable.transactedAt,
      })
      .from(transactionTable)
      .where(eq(transactionTable.businessId, businessId))
      .orderBy(desc(transactionTable.transactedAt))
      .limit(12),
  ]);

  const businessRow = business[0] ?? {
    id: businessId,
    name: "Current business",
    email: "",
    phone: "",
    currency: "KES",
  };
  const currency = businessRow.currency ?? "KES";
  const revenueChange = getChange(currentRevenue, previousRevenue);
  const orderChange = getChange(currentOrders, previousOrders);
  const revenueByMonth = new Map(revenueTrendRows.map((row) => [row.month, toNumber(row.total)]));
  const expensesByMonth = new Map(expenseTrendRows.map((row) => [row.month, toNumber(row.total)]));
  const maxTrend = Math.max(
    ...trendMonths.flatMap((month) => [revenueByMonth.get(month.key) ?? 0, expensesByMonth.get(month.key) ?? 0]),
    1,
  );

  const revenueTrend = trendMonths.map((month) => {
    const revenue = revenueByMonth.get(month.key) ?? 0;
    const expenses = expensesByMonth.get(month.key) ?? 0;
    return {
      month: month.label,
      revenue,
      expenses,
      height: Math.max(8, Math.round((revenue / maxTrend) * 100)),
    };
  });

  return {
    generatedAt,
    periodLabel: "Last 6 months",
    business: {
      id: businessRow.id,
      name: businessRow.name,
      email: businessRow.email,
      phone: businessRow.phone,
      currency,
    },
    metrics: [
      {
        label: "Revenue this month",
        value: formatMoney(currentRevenue, currency),
        detail: `${formatPercent(revenueChange)} vs previous month`,
        tone: revenueChange >= 0 ? "emerald" : "red",
      },
      {
        label: "Orders this month",
        value: String(currentOrders),
        detail: `${formatPercent(orderChange)} vs previous month`,
        tone: orderChange >= 0 ? "blue" : "amber",
      },
      {
        label: "Outstanding balance",
        value: formatMoney(outstanding, currency),
        detail: `${overdueInvoices} overdue invoice${overdueInvoices === 1 ? "" : "s"}`,
        tone: overdueInvoices > 0 ? "amber" : "emerald",
      },
      {
        label: "Inventory alerts",
        value: String(stockAlerts),
        detail: "Low, critical, or reorder stock",
        tone: stockAlerts > 0 ? "red" : "emerald",
      },
    ],
    reportCards: [
      {
        id: "sales",
        title: "Sales report",
        description: `${formatMoney(expensesMonth, currency)} in expenses this month, with revenue and product movement alongside it.`,
        value: formatMoney(currentRevenue, currency),
        status: "Ready",
      },
      {
        id: "collections",
        title: "Collections report",
        description: "Invoice balances, overdue invoices, and tenant payment collection performance.",
        value: formatMoney(outstanding, currency),
        status: overdueInvoices > 0 ? "Review" : "Ready",
      },
      {
        id: "inventory",
        title: "Inventory report",
        description: "Low stock, critical stock, reorder alerts, and product movement indicators.",
        value: `${stockAlerts} alerts`,
        status: stockAlerts > 0 ? "Review" : "Ready",
      },
      {
        id: "customers",
        title: "Customer report",
        description: `${newCustomers} new customer${newCustomers === 1 ? "" : "s"} joined this month, with segment value breakdown.`,
        value: `${activeCustomers} customers`,
        status: "Ready",
      },
    ],
    revenueTrend,
    topProducts: topProductRows.map((row) => ({
      name: row.name,
      sku: row.sku,
      quantity: toNumber(row.quantity),
      revenue: toNumber(row.revenue),
    })),
    inventory: inventoryRows.map((row) => ({
      product: row.product,
      sku: row.sku,
      color: row.color,
      size: row.size,
      stock: row.stock,
      reorderPoint: row.reorderPoint,
      status: row.status,
    })),
    customerSegments: segmentRows.map((row) => ({
      segment: row.segment,
      customers: toNumber(row.customers),
      totalSpent: toNumber(row.totalSpent),
    })),
    transactions: transactionRows.map((row) => ({
      tnxId: row.tnxId,
      type: row.type,
      method: paymentMethodLabel(row.method),
      status: row.status,
      amount: row.amount,
      transactedAt: row.transactedAt,
    })),
  };
}

