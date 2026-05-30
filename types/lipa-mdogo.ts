export type PlanStatus = "active" | "overdue" | "completed";

export interface PlanProduct {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Receipt {
  id: string;
  planId: string;
  amount: number;
  date: string;
  method: string;
  ref: string;
  note: string;
}

export interface PaymentPlan {
  id: string;
  invoiceNo: string;
  customer: string;
  orderId: string;
  phone: string;
  email: string;
  paymentMethod: string;
  products: PlanProduct[];
  totalAmount: number;
  installments: number;
  installmentAmount: number;
  startDate: string;
  frequency: string;
}

