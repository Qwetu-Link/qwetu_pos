import type { FinanceIcon } from "./common";

export type BranchMoneyStatus = "Checked" | "Needs review" | "Waiting";

export interface BranchMoneySummary {
  branch: string;
  sales: string;
  cash: string;
  mpesa: string;
  status: BranchMoneyStatus;
}

export interface FinanceTask {
  label: string;
  detail: string;
  href: string;
  icon: FinanceIcon;
}

export interface FinanceKpi {
  label: string;
  value: string;
  change: string;
  icon: FinanceIcon;
  iconBg: string;
}

export interface PaymentMixSlice {
  name: string;
  value: number;
  color: string;
}

export interface RevenueTrendPoint {
  day: string;
  revenue: number;
  target: number;
}

export interface ProfitTrendPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
