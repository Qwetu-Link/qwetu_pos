export type FinanceEntityStatus = "paid" | "scheduled" | "failed";

export interface FinanceEntity {
  id: string;
  name: string;
  type: string;
  country: string;
  currency: string;
  employees: number;
  revenue: number;
  status: FinanceEntityStatus;
}

export interface BranchRevenueChartPoint {
  shortName: string;
  revenueKES: number;
}
