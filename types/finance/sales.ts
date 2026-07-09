import type { FinanceIcon } from "./common";

export type SalesStatus = "Paid" | "Pending" | "Overdue";
export type SalesPaymentMethod = "M-Pesa" | "Cash" | "Bank" | "Card" | "Wallet";

export interface SalesRecord {
  invoice: string;
  customer: string;
  products: string;
  method: SalesPaymentMethod;
  channel: string;
  amount: number;
  status: SalesStatus;
  date: string;
}

export interface SalesMethodSummary {
  label: string;
  value: number;
  count: number;
  icon: FinanceIcon;
}
