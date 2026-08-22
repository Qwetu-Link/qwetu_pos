import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { transactionTable } from "@/db/schema/payments";
import { subscriptionTable } from "@/db/schema/subscription";
import { usersTable } from "@/db/schema/users";
import type { KPIData } from "@/types/super-admin/types";
import { and, count, desc, eq, gt, gte, lt, sql } from "drizzle-orm";

type RevenueTab = "daily" | "weekly" | "monthly" | "yearly";

type RevenuePoint = {
  name: string;
  value: number;
  target: number;
};

type GrowthPoint = {
  name: string;
  registrations: number;
  active: number;
  churn: number;
  renewals: number;
};

type DistributionPoint = {
  name: string;
  value: number;
};

type ActivityPoint = {
  id: string;
  type: string;
  title: string;
  description: string;
  actor: string;
  date: string;
};

export type SuperAdminDashboardData = {
  kpis: KPIData[];
  revenueData: Record<RevenueTab, RevenuePoint[]>;
  businessGrowthData: GrowthPoint[];
  subscriptionDistributionData: DistributionPoint[];
  activityFeed: ActivityPoint[];
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return startOfDay(addDays(date, mondayOffset));
}

function addWeeks(date: Date, weeks: number) {
  return addDays(date, weeks * 7);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function addYears(date: Date, years: number) {
  return new Date(date.getFullYear() + years, 0, 1);
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function getChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

async function getScalar<T extends Record<string, unknown>>(query: Promise<T[]>, key: keyof T) {
  const [row] = await query;
  return toNumber(row?.[key]);
}

async function sumRevenue(start: Date, end?: Date) {
  return getScalar(
    db
      .select({ total: sql<number>`coalesce(sum(${transactionTable.amount}), 0)` })
      .from(transactionTable)
      .where(and(
        eq(transactionTable.status, "success"),
        gt(transactionTable.amount, 0),
        gte(transactionTable.transactedAt, start),
        ...(end ? [lt(transactionTable.transactedAt, end)] : []),
      )),
    "total",
  );
}

async function countBusinesses(start?: Date, end?: Date, status?: "active" | "trial" | "suspended" | "expired") {
  return getScalar(
    db
      .select({ total: count() })
      .from(businessTable)
      .where(and(
        ...(start ? [gte(businessTable.createdAt, start)] : []),
        ...(end ? [lt(businessTable.createdAt, end)] : []),
        ...(status ? [eq(businessTable.status, status)] : []),
      )),
    "total",
  );
}

function emptyRevenuePoint(name: string): RevenuePoint {
  return { name, value: 0, target: 0 };
}

async function buildRevenueData(now: Date): Promise<Record<RevenueTab, RevenuePoint[]>> {
  const dailyStarts = Array.from({ length: 7 }, (_, index) => addDays(startOfDay(now), index - 6));
  const weeklyStarts = Array.from({ length: 6 }, (_, index) => addWeeks(startOfWeek(now), index - 5));
  const monthlyStarts = Array.from({ length: 7 }, (_, index) => addMonths(startOfMonth(now), index - 6));
  const yearlyStarts = Array.from({ length: 5 }, (_, index) => addYears(startOfYear(now), index - 4));

  const daily = await Promise.all(dailyStarts.map(async (start) => ({
    name: start.toLocaleDateString("en-US", { weekday: "short" }),
    value: await sumRevenue(start, addDays(start, 1)),
    target: 0,
  })));
  const weekly = await Promise.all(weeklyStarts.map(async (start, index) => ({
    name: `W${index + 1}`,
    value: await sumRevenue(start, addWeeks(start, 1)),
    target: 0,
  })));
  const monthly = await Promise.all(monthlyStarts.map(async (start) => ({
    name: start.toLocaleDateString("en-US", { month: "short" }),
    value: await sumRevenue(start, addMonths(start, 1)),
    target: 0,
  })));
  const yearly = await Promise.all(yearlyStarts.map(async (start) => ({
    name: String(start.getFullYear()),
    value: await sumRevenue(start, addYears(start, 1)),
    target: 0,
  })));

  return {
    daily: withTargets(daily.length ? daily : [emptyRevenuePoint("Today")]),
    weekly: withTargets(weekly.length ? weekly : [emptyRevenuePoint("W1")]),
    monthly: withTargets(monthly.length ? monthly : [emptyRevenuePoint("Month")]),
    yearly: withTargets(yearly.length ? yearly : [emptyRevenuePoint("Year")]),
  };
}

function withTargets(points: RevenuePoint[]) {
  return points.map((point) => ({
    ...point,
    target: Math.round(point.value * 1.1),
  }));
}

async function buildBusinessGrowthData(now: Date): Promise<GrowthPoint[]> {
  const starts = Array.from({ length: 7 }, (_, index) => addMonths(startOfMonth(now), index - 6));

  return Promise.all(starts.map(async (start) => {
    const end = addMonths(start, 1);
    const [registrations, active, churn, renewals] = await Promise.all([
      countBusinesses(start, end),
      countBusinesses(start, end, "active"),
      getScalar(
        db.select({ total: count() })
          .from(businessTable)
          .where(and(
            gte(businessTable.updatedAt, start),
            lt(businessTable.updatedAt, end),
            eq(businessTable.status, "suspended"),
          )),
        "total",
      ),
      getScalar(
        db.select({ total: count() })
          .from(subscriptionTable)
          .where(and(gte(subscriptionTable.updatedAt, start), lt(subscriptionTable.updatedAt, end))),
        "total",
      ),
    ]);

    return {
      name: start.toLocaleDateString("en-US", { month: "short" }),
      registrations,
      active,
      churn,
      renewals,
    };
  }));
}

async function buildSubscriptionDistributionData(): Promise<DistributionPoint[]> {
  const rows = await db
    .select({
      plan: businessTable.plan,
      total: count(),
    })
    .from(businessTable)
    .groupBy(businessTable.plan);

  const totals = new Map(rows.map((row) => [row.plan, toNumber(row.total)]));
  return [
    { name: "Trial", value: totals.get("trial") ?? 0 },
    { name: "Starter", value: totals.get("starter") ?? 0 },
    { name: "Professional", value: totals.get("professional") ?? 0 },
    { name: "Enterprise", value: totals.get("enterprise") ?? 0 },
  ];
}

async function buildActivityFeed(): Promise<ActivityPoint[]> {
  const [businesses, transactions] = await Promise.all([
    db
      .select({
        id: businessTable.id,
        businessName: businessTable.businessName,
        status: businessTable.status,
        createdAt: businessTable.createdAt,
        updatedAt: businessTable.updatedAt,
      })
      .from(businessTable)
      .orderBy(desc(businessTable.updatedAt))
      .limit(5),
    db
      .select({
        id: transactionTable.id,
        tnxId: transactionTable.tnxId,
        amount: transactionTable.amount,
        status: transactionTable.status,
        method: transactionTable.paymentMethod,
        date: transactionTable.transactedAt,
      })
      .from(transactionTable)
      .orderBy(desc(transactionTable.transactedAt))
      .limit(5),
  ]);

  return [
    ...businesses.map((business) => ({
      id: `business-${business.id}`,
      type: business.status === "suspended" ? "suspended" : "registration",
      title: business.status === "suspended" ? "Business suspended" : "Business registered",
      description: business.businessName,
      actor: "System",
      date: (business.updatedAt ?? business.createdAt).toISOString(),
    })),
    ...transactions.map((transaction) => ({
      id: `transaction-${transaction.id}`,
      type: "payment",
      title: transaction.status === "success" ? "Payment received" : "Payment updated",
      description: `KES ${transaction.amount.toLocaleString()} via ${transaction.method}`,
      actor: transaction.tnxId,
      date: transaction.date.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
}

export async function getSuperAdminDashboardData(): Promise<SuperAdminDashboardData> {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const previousMonthStart = addMonths(currentMonthStart, -1);
  const currentYearStart = startOfYear(now);
  const previousYearStart = addYears(currentYearStart, -1);

  const [
    totalBusinesses,
    activeBusinesses,
    trialBusinesses,
    currentMonthRevenue,
    previousMonthRevenue,
    currentYearRevenue,
    previousYearRevenue,
    totalUsers,
    previousMonthBusinesses,
    previousActiveBusinesses,
    previousTrialBusinesses,
    previousUsers,
    revenueData,
    businessGrowthData,
    subscriptionDistributionData,
    activityFeed,
  ] = await Promise.all([
    countBusinesses(),
    countBusinesses(undefined, undefined, "active"),
    countBusinesses(undefined, undefined, "trial"),
    sumRevenue(currentMonthStart),
    sumRevenue(previousMonthStart, currentMonthStart),
    sumRevenue(currentYearStart),
    sumRevenue(previousYearStart, currentYearStart),
    getScalar(db.select({ total: count() }).from(usersTable), "total"),
    countBusinesses(undefined, currentMonthStart),
    getScalar(db.select({ total: count() }).from(businessTable).where(and(eq(businessTable.status, "active"), lt(businessTable.createdAt, currentMonthStart))), "total"),
    getScalar(db.select({ total: count() }).from(businessTable).where(and(eq(businessTable.status, "trial"), lt(businessTable.createdAt, currentMonthStart))), "total"),
    getScalar(db.select({ total: count() }).from(usersTable).where(lt(usersTable.createdAt, currentMonthStart)), "total"),
    buildRevenueData(now),
    buildBusinessGrowthData(now),
    buildSubscriptionDistributionData(),
    buildActivityFeed(),
  ]);

  return {
    kpis: [
      { label: "Total Businesses", value: totalBusinesses, format: "number", growth: getChange(totalBusinesses, previousMonthBusinesses), previousValue: previousMonthBusinesses, sparkline: revenueData.monthly.map((_, index) => Math.max(totalBusinesses - (6 - index), 0)), icon: "Building2", color: "text-blue-500" },
      { label: "Active Businesses", value: activeBusinesses, format: "number", growth: getChange(activeBusinesses, previousActiveBusinesses), previousValue: previousActiveBusinesses, sparkline: businessGrowthData.map((point) => point.active), icon: "CheckCircle2", color: "text-green-500" },
      { label: "Trial Businesses", value: trialBusinesses, format: "number", growth: getChange(trialBusinesses, previousTrialBusinesses), previousValue: previousTrialBusinesses, sparkline: businessGrowthData.map((point) => point.registrations), icon: "Clock", color: "text-amber-500" },
      { label: "Monthly Revenue", value: currentMonthRevenue, format: "currency", growth: getChange(currentMonthRevenue, previousMonthRevenue), previousValue: previousMonthRevenue, sparkline: revenueData.monthly.map((point) => point.value), icon: "DollarSign", color: "text-green-600" },
      { label: "Annual Revenue", value: currentYearRevenue, format: "currency", growth: getChange(currentYearRevenue, previousYearRevenue), previousValue: previousYearRevenue, sparkline: revenueData.yearly.map((point) => point.value), icon: "TrendingUp", color: "text-emerald-600" },
      { label: "Total Users", value: totalUsers, format: "number", growth: getChange(totalUsers, previousUsers), previousValue: previousUsers, sparkline: businessGrowthData.map((point) => point.registrations + point.active), icon: "Users", color: "text-purple-500" },
    ],
    revenueData,
    businessGrowthData,
    subscriptionDistributionData,
    activityFeed,
  };
}
