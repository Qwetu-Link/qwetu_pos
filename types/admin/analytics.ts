import type {
  CategoryMetric,
  CollectionMetric,
  PaymentMethodMetric,
  RevenueMonth,
  SegmentMetric,
} from "./settings";

export interface PlanDurationMetric {
  months: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  previousRevenue: number;
  totalOrders: number;
  previousOrders: number;
  activeCustomers: number;
  previousCustomers: number;
  avgOrderValue: number;
  previousAvgOrderValue: number;
  installmentRevenue: number;
  overduePlans: number;
  defaultRate: number;
  newCustomers: number;
  returningCustomers: number;
  retentionRate: number;
  customerLtv: number;
  revenueTrend: RevenueMonth[];
  categorySales: CategoryMetric[];
  customerSegments: SegmentMetric[];
  paymentMethods: PaymentMethodMetric[];
  planDurations: PlanDurationMetric[];
  collectionTrend: CollectionMetric[];
}

export type AnalyticsPeriod = "last_3_months" | "last_6_months" | "last_12_months";
