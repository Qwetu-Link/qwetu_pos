export type RiskLevel = "low" | "medium" | "high";
export type Segment = "New" | "Regular" | "VIP";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentType = "full" | "installment";
export type PaymentStatus = "paid" | "partial" | "unpaid";
export type OrderLocationName = "Main Store" | "Warehouse A" | "Outlet";

export interface Customer {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  activeInstallments: number;
  paymentScore: number;
  riskLevel: RiskLevel;
  segment: Segment;
  joinedDate: string;
  lastPurchase: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  segment: Segment;
  riskLevel: RiskLevel;
  address: string;
}

export interface LineItem {
  variantId: string;
  productId: string;
  sku: string;
  name: string;
  qty: number;
  price: number;
  originalPrice: number;
  locationName?: OrderLocationName;
}

export interface OrderInvoice {
  id: string;
  invoiceNumber: string;
  total: number;
  balance: number;
  installments: number;
  installmentAmount: number;
  status: "draft" | "issued" | "partially_paid" | "paid" | "overdue" | "cancelled";
  frequency: string;
  startDate: string;
  dueDate: string;
  receipts?: OrderPaymentReceipt[];
}

export interface OrderPaymentReceipt {
  id: string;
  amount: number;
  date: string;
  method: string;
  ref: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerId: string;
  customer: string;
  email: string;
  phone: string;
  items: number;
  total: number;
  amountPaid: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  installmentPlan?: string;
  installmentStartDate?: string;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  lineItems: LineItem[];
  invoice?: OrderInvoice;
}

export interface OrderFormData {
  paymentType: PaymentType;
  amountPaid: number;
  installmentPlan?: string;
  startDate?: string;
  status: OrderStatus;
}

export interface CustomerStats {
  total: number;
  vipCount: number;
  activePlans: number;
  avgSpend: number;
}
