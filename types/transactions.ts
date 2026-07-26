export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionType =
  | "sale"
  | "refund"
  | "installment"
  | "payment"
  | "deposit"
  | "withdrawal"
  | "expense"
  | "purchase"
  | "purchase_return"
  | "discount"
  | "adjustment";
export type ExpenseStatus = "approved" | "pending" | "rejected";

export interface Transaction {
  id: string;
  date: string;
  customerId: string;
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
  expenseNo: string;
  date: string;
  category: string;
  vendor: string;
  method: string;
  amount: number;
  status: ExpenseStatus;
  note: string;
  items: ExpenseItem[];
}

export interface ExpenseItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  total: number;
}
