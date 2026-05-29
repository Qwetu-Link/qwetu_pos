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

export const transactions: Transaction[] = [
  {
    id: "TXN-1001",
    date: "2026-05-29",
    customer: "Sarah Mwangi",
    customerPhone: "+254 712 345 678",
    type: "sale",
    method: "M-Pesa",
    reference: "QAX123KL",
    amount: 12450,
    status: "completed",
  },
  {
    id: "TXN-1002",
    date: "2026-05-29",
    customer: "John Kamau",
    customerPhone: "+254 723 456 789",
    type: "installment",
    method: "M-Pesa",
    reference: "RDA001AB",
    amount: 989,
    status: "completed",
  },
  {
    id: "TXN-1003",
    date: "2026-05-28",
    customer: "Grace Njeri",
    customerPhone: "+254 734 567 890",
    type: "sale",
    method: "Airtel Money",
    reference: "AMA100GH",
    amount: 18900,
    status: "pending",
  },
  {
    id: "TXN-1004",
    date: "2026-05-28",
    customer: "Mary Wanjiku",
    customerPhone: "+254 745 678 901",
    type: "refund",
    method: "Card",
    reference: "RF-4421",
    amount: -1200,
    status: "completed",
  },
  {
    id: "TXN-1005",
    date: "2026-05-27",
    customer: "Peter Omondi",
    customerPhone: "+254 756 789 012",
    type: "sale",
    method: "Cash",
    reference: "CSH-2094",
    amount: 6500,
    status: "completed",
  },
  {
    id: "TXN-1006",
    date: "2026-05-27",
    customer: "James Otieno",
    customerPhone: "+254 767 890 123",
    type: "installment",
    method: "Bank Transfer",
    reference: "BNK-8377",
    amount: 1875,
    status: "failed",
  },
];

export const expenses: Expense[] = [
  {
    id: "EXP-501",
    date: "2026-05-29",
    category: "Stock purchase",
    vendor: "Nairobi Electronics",
    method: "Bank Transfer",
    amount: 86000,
    status: "approved",
    note: "Samsung accessories restock",
  },
  {
    id: "EXP-502",
    date: "2026-05-28",
    category: "Logistics",
    vendor: "Rider Dispatch",
    method: "M-Pesa",
    amount: 4200,
    status: "approved",
    note: "Customer deliveries",
  },
  {
    id: "EXP-503",
    date: "2026-05-27",
    category: "Utilities",
    vendor: "Kenya Power",
    method: "M-Pesa",
    amount: 11800,
    status: "pending",
    note: "Monthly electricity token",
  },
  {
    id: "EXP-504",
    date: "2026-05-26",
    category: "Marketing",
    vendor: "Meta Ads",
    method: "Card",
    amount: 15000,
    status: "approved",
    note: "May phone promotion campaign",
  },
  {
    id: "EXP-505",
    date: "2026-05-25",
    category: "Repairs",
    vendor: "TechFix Ltd",
    method: "Cash",
    amount: 7300,
    status: "rejected",
    note: "Duplicate repair claim",
  },
];

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
