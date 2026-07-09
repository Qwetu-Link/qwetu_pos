import type { ExpenseStatus } from "@/types/transactions";

export type FinanceExpenseStatus = ExpenseStatus;

export interface FinanceExpenseCategoryTotals {
  [category: string]: number;
}
