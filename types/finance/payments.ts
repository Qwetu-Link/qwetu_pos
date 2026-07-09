import type { FinanceIcon } from "./common";

export type PaymentStatus = "Settled" | "Pending" | "Failed";
export type PaymentMethod = "M-Pesa" | "Cash" | "Bank" | "Card" | "Wallet";

export interface PaymentRecord {
  id: string;
  date: string;
  customer: string;
  invoice: string;
  method: PaymentMethod;
  channel: string;
  amount: number;
  fee: number;
  status: PaymentStatus;
  reference: string;
}

export interface PaymentMethodSummary {
  label: string;
  value: number;
  count: number;
  icon: FinanceIcon;
}
