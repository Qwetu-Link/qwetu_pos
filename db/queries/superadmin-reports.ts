import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { invoiceTable } from "@/db/schema/invoice";
import { orderTable } from "@/db/schema/orders";
import { transactionTable } from "@/db/schema/payments";
import { usersTable } from "@/db/schema/users";
import { and, count, desc, eq, gt, gte, isNotNull, lt, ne, sql } from "drizzle-orm";

export type SuperAdminReportCard = {
  id: string;
  title: string;
  detail: string;
  status: "Ready" | "Review";
  value: string;
};

export type SuperAdminReportMetric = {
  title: string;
  value: string;
  detail: string;
  tone?: "slate" | "emerald" | "amber" | "blue" | "red";
};

export type SuperAdminRevenueTrendPoint = {
  month: string;
  amount: number;
  height: number;
};

export type SuperAdminTenantReportRow = {
  businessId: string;
  businessName: string;
  email: string;
  phone: string;
  status: string;
  owners: number;
  revenue: number;
  invoiced: number;
  outstanding: number;
  orders: number;
  transactions: number;
  createdAt: Date;
};

export type SuperAdminReportCenterData = {
  generatedAt: Date;
  periodLabel: string;
  metrics: SuperAdminReportMetric[];
  reports: SuperAdminReportCard[];
  revenueTrend: SuperAdminRevenueTrendPoint[];
  tenants: SuperAdminTenantReportRow[];
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

function formatKes(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
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

async function getScalar<T extends Record<string, unknown>>(query: Promise<T[]>, key: keyof T) {
  const [row] = await query;
  return toNumber(row?.[key]);
}

export async function getSuperAdminReportCenterData(): Promise<SuperAdminReportCenterData> {
  const generatedAt = new Date();
  const currentMonthStart = startOfMonth(generatedAt);
  const previousMonthStart = addMonths(currentMonthStart, -1);
  const trendStart = addMonths(currentMonthStart, -6);
  const trendMonths = Array.from({ length: 7 }, (_, index) => {
    const date = addMonths(trendStart, index);
    return {
      key: getMonthKey(date),
      label: getMonthLabel(date),
    };
  });

  const [
    businesses,
    totalRevenue,
    currentRevenue,
    previousRevenue,
    totalBusinesses,
    activeBusinesses,
    currentTenantAdds,
    previousTenantAdds,
    overdueInvoices,
    openBalances,
    ownerRows,
    invoiceRows,
    orderRows,
    transactionRows,
    trendRows,
  ] = await Promise.all([
    db
      .select({
        id: businessTable.id,
        businessName: businessTable.businessName,
        email: businessTable.email,
        phone: businessTable.phone,
        isActive: businessTable.isActive,
        createdAt: businessTable.createdAt,
      })
      .from(businessTable)
      .orderBy(desc(businessTable.createdAt)),
    getScalar(
      db
        .select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
        .from(transactionTable)
        .where(and(eq(transactionTable.status, "success"), gt(transactionTable.amount, 0))),
      "total",
    ),
    getScalar(
      db
        .select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
        .from(transactionTable)
        .where(and(
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
          eq(transactionTable.status, "success"),
          gt(transactionTable.amount, 0),
          gte(transactionTable.transactedAt, previousMonthStart),
          lt(transactionTable.transactedAt, currentMonthStart),
        )),
      "total",
    ),
    getScalar(db.select({ total: count() }).from(businessTable), "total"),
    getScalar(
      db.select({ total: count() }).from(businessTable).where(eq(businessTable.isActive, true)),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(businessTable)
        .where(gte(businessTable.createdAt, currentMonthStart)),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(businessTable)
        .where(and(
          gte(businessTable.createdAt, previousMonthStart),
          lt(businessTable.createdAt, currentMonthStart),
        )),
      "total",
    ),
    getScalar(
      db
        .select({ total: count() })
        .from(invoiceTable)
        .where(and(
          gt(invoiceTable.balance, 0),
          lt(invoiceTable.dueDate, generatedAt),
          ne(invoiceTable.status, "cancelled"),
        )),
      "total",
    ),
    getScalar(
      db
        .select({ total: sql<number>`coalesce(sum(${invoiceTable.balance}), 0)` })
        .from(invoiceTable)
        .where(ne(invoiceTable.status, "cancelled")),
      "total",
    ),
    db
      .select({
        businessId: usersTable.businessId,
        owners: count(),
      })
      .from(usersTable)
      .where(isNotNull(usersTable.businessId))
      .groupBy(usersTable.businessId),
    db
      .select({
        businessId: invoiceTable.businessId,
        invoiced: sql<number>`coalesce(sum(${invoiceTable.total}), 0)`,
        outstanding: sql<number>`coalesce(sum(${invoiceTable.balance}), 0)`,
      })
      .from(invoiceTable)
      .where(ne(invoiceTable.status, "cancelled"))
      .groupBy(invoiceTable.businessId),
    db
      .select({
        businessId: orderTable.businessId,
        orders: count(),
      })
      .from(orderTable)
      .groupBy(orderTable.businessId),
    db
      .select({
        businessId: transactionTable.businessId,
        revenue: sql<number>`coalesce(sum(${transactionTable.amount}), 0)`,
        transactions: count(),
      })
      .from(transactionTable)
      .where(and(eq(transactionTable.status, "success"), gt(transactionTable.amount, 0)))
      .groupBy(transactionTable.businessId),
    db
      .select({
        month: sql<string>`date_format(${transactionTable.transactedAt}, '%Y-%m')`,
        amount: sql<number>`coalesce(sum(${transactionTable.amount}), 0)`,
      })
      .from(transactionTable)
      .where(and(
        eq(transactionTable.status, "success"),
        gt(transactionTable.amount, 0),
        gte(transactionTable.transactedAt, trendStart),
      ))
      .groupBy(sql`date_format(${transactionTable.transactedAt}, '%Y-%m')`),
  ]);

  const ownerMap = new Map(ownerRows.map((row) => [row.businessId, toNumber(row.owners)]));
  const invoiceMap = new Map(invoiceRows.map((row) => [
    row.businessId,
    {
      invoiced: toNumber(row.invoiced),
      outstanding: toNumber(row.outstanding),
    },
  ]));
  const orderMap = new Map(orderRows.map((row) => [row.businessId, toNumber(row.orders)]));
  const transactionMap = new Map(transactionRows.map((row) => [
    row.businessId,
    {
      revenue: toNumber(row.revenue),
      transactions: toNumber(row.transactions),
    },
  ]));

  const tenants: SuperAdminTenantReportRow[] = businesses.map((business) => {
    const invoice = invoiceMap.get(business.id);
    const transaction = transactionMap.get(business.id);

    return {
      businessId: business.id,
      businessName: business.businessName,
      email: business.email,
      phone: business.phone,
      status: business.isActive ? "Active" : "Inactive",
      owners: ownerMap.get(business.id) ?? 0,
      revenue: transaction?.revenue ?? 0,
      invoiced: invoice?.invoiced ?? 0,
      outstanding: invoice?.outstanding ?? 0,
      orders: orderMap.get(business.id) ?? 0,
      transactions: transaction?.transactions ?? 0,
      createdAt: business.createdAt,
    };
  });

  const trendAmounts = new Map(trendRows.map((row) => [row.month, toNumber(row.amount)]));
  const maxTrendAmount = Math.max(...trendMonths.map((month) => trendAmounts.get(month.key) ?? 0), 1);
  const revenueTrend = trendMonths.map((month) => {
    const amount = trendAmounts.get(month.key) ?? 0;
    return {
      month: month.label,
      amount,
      height: Math.max(8, Math.round((amount / maxTrendAmount) * 100)),
    };
  });

  const tenantsWithoutOwners = tenants.filter((tenant) => tenant.owners === 0).length;
  const inactiveBusinesses = totalBusinesses - activeBusinesses;
  const riskAlerts = overdueInvoices + inactiveBusinesses + tenantsWithoutOwners;
  const tenantGrowth = getChange(currentTenantAdds, previousTenantAdds);
  const revenueGrowth = getChange(currentRevenue, previousRevenue);
  const usageHealth = totalBusinesses ? (activeBusinesses / totalBusinesses) * 100 : 0;

  return {
    generatedAt,
    periodLabel: "Last 7 months",
    metrics: [
      {
        title: "Platform revenue",
        value: formatKes(totalRevenue),
        detail: `${formatPercent(revenueGrowth)} this month`,
        tone: "emerald",
      },
      {
        title: "Tenant growth",
        value: formatPercent(tenantGrowth),
        detail: `${currentTenantAdds} new this month`,
        tone: "blue",
      },
      {
        title: "Active businesses",
        value: String(activeBusinesses),
        detail: `${totalBusinesses} total workspaces`,
        tone: "emerald",
      },
      {
        title: "Risk alerts",
        value: String(riskAlerts),
        detail: `${overdueInvoices} overdue, ${inactiveBusinesses} inactive`,
        tone: riskAlerts > 0 ? "amber" : "emerald",
      },
    ],
    reports: [
      {
        id: "revenue-summary",
        title: "Revenue summary",
        detail: `${formatKes(openBalances)} remains outstanding across non-cancelled invoices.`,
        status: "Ready",
        value: formatKes(totalRevenue),
      },
      {
        id: "tenant-growth",
        title: "Tenant growth",
        detail: "New businesses, active workspaces, and owner assignment coverage.",
        status: "Ready",
        value: formatPercent(tenantGrowth),
      },
      {
        id: "risk-review",
        title: "Risk review",
        detail: "Inactive tenants, overdue invoices, and tenants missing owner records.",
        status: riskAlerts > 0 ? "Review" : "Ready",
        value: `${riskAlerts} alerts`,
      },
      {
        id: "usage-health",
        title: "Usage health",
        detail: "Active tenant ratio across all registered workspaces.",
        status: usageHealth >= 80 ? "Ready" : "Review",
        value: `${Math.round(usageHealth)}%`,
      },
    ],
    revenueTrend,
    tenants,
  };
}

