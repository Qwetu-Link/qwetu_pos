export type BudgetScope = "Branch" | "Department";

export interface BudgetAllocation {
  id: number;
  scope: BudgetScope;
  name: string;
  payrollBudget: number;
  expenseBudget: number;
  owner: string;
}

export type BudgetLine = BudgetAllocation;

export interface BudgetTrendPoint {
  month: string;
  revenue: number;
  expenses: number;
  payroll: number;
  budget: number;
}

export interface BudgetTotals {
  payroll: number;
  expenses: number;
  total?: number;
  budget?: number;
  branches: number;
  departments: number;
}

export interface BudgetFieldProps {
  label: string;
  value: string | number;
  type?: "text" | "number";
  onChange: (value: string) => void;
}
