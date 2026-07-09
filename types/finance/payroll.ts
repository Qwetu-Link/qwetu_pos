import type { FinanceIcon } from "./common";

export type PayrollStatus = "paid" | "scheduled" | "failed";
export type PayrollTab = "employees" | "history" | "schedule";

export interface PayrollEmployee {
  id: string;
  name: string;
  department: string;
  role: string;
  salary: number;
  advances: number;
  deductions: number;
  netPay: number;
  bank: string;
  payDate: string;
  status: PayrollStatus;
}

export interface PayRun {
  id: string;
  period: string;
  employees: number;
  gross: number;
  deductions: number;
  net: number;
  status: PayrollStatus;
  date: string;
}

export interface PayrollTrendPoint {
  month: string;
  payroll: number;
}

export interface PayrollDepartmentBreakdown {
  name: string;
  count: number;
  share: number;
}

export interface PayrollScheduleItem {
  label: string;
  date: string;
  amount: number;
  status: PayrollStatus;
}

export interface PayrollComplianceItem {
  label: string;
  due: string;
  tag: string;
}

export interface PayrollMetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: FinanceIcon;
}
