import type { FinanceIcon } from "./common";

export type FinanceReportStatus = "paid" | "scheduled" | "failed";
export type FinanceReportType = "Financial" | "Management" | "Tax" | "Compliance";

export interface FinanceReport {
  id: string;
  name: string;
  type: FinanceReportType;
  generated: string;
  size: string;
  status: FinanceReportStatus;
}

export interface FinanceReportTemplate {
  icon: FinanceIcon;
  title: string;
  desc: string;
  type: FinanceReportType;
}
