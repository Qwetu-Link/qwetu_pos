export type RiskLevel = "low" | "medium" | "high";
export type Segment = "New" | "Regular" | "VIP";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentType = "full" | "installment";
export type PaymentStatus = "paid" | "partial" | "unpaid";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  activeInstallments: number;
  paymentScore: number;
  riskLevel: RiskLevel;
  segment: Segment;
  joinedDate: string;
  lastPurchase: string;
  address: string;
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
}

export interface Order {
  id: string;
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

export const RISK_CONFIG: Record<RiskLevel, { label: string; color: string }> = {
  low: { label: "Low Risk", color: "bg-green-100 text-green-700" },
  medium: { label: "Medium Risk", color: "bg-amber-100 text-amber-700" },
  high: { label: "High Risk", color: "bg-red-100 text-red-700" },
};

export const SEGMENT_CONFIG: Record<Segment, { color: string }> = {
  VIP: { color: "bg-purple-100 text-purple-700" },
  Regular: { color: "bg-blue-100 text-blue-700" },
  New: { color: "bg-slate-100 text-slate-700" },
};

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700" },
  shipped:   { label: "Shipped",   color: "bg-indigo-100 text-indigo-700"  },
  processing:{ label: "Processing",color: "bg-orange-100 text-orange-700"  },
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700"    },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700"        },
};
