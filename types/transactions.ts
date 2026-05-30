export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionType = "sale" | "refund" | "installment" | "expense";
export type ExpenseStatus = "approved" | "pending" | "rejected";

export interface Transaction {
  id: string;
  date: string;
  customer: string;
  customerPhone: string;
  type: TransactionType;
  method: string;
  reference: string;
  amount: number;
  status: TransactionStatus;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  vendor: string;
  method: string;
  amount: number;
  status: ExpenseStatus;
  note: string;
}

