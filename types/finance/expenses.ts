import type { ExpenseStatus } from "@/types/admin/transactions";

export type FinanceExpenseStatus = ExpenseStatus;

export interface FinanceExpenseCategoryTotals {
  [category: string]: number;
}
