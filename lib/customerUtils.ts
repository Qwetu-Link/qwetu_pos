import type { Customer, CustomerStats, RiskLevel, Order, LineItem } from "../types/customer";

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function getPaymentScoreFromRisk(risk: RiskLevel): number {
  return risk === "low" ? 85 : risk === "medium" ? 65 : 45;
}

export function generateCustomerId(customers: Customer[]): string {
  const lastNum = Math.max(...customers.map((c) => parseInt(c.id.split("-")[1] ?? "0")), 0);
  return `CUST-${String(lastNum + 1).padStart(3, "0")}`;
}

export function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  do {
    suffix = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  } while (!/[A-Z]/.test(suffix) || !/[0-9]/.test(suffix));
  return `ORD-${suffix}`;
}

export function getLoyaltyStatus(totalSpent: number): string {
  if (totalSpent > 100_000) return "Platinum";
  if (totalSpent > 50_000) return "Gold";
  return "Silver";
}

export function getLoyaltyProgress(totalSpent: number): number {
  return Math.min(100, (totalSpent / 150_000) * 100);
}

export function computeStats(customers: Customer[]): CustomerStats {
  const total = customers.length;
  const vipCount = customers.filter((c) => c.segment === "VIP").length;
  const activePlans = customers.reduce((sum, c) => sum + c.activeInstallments, 0);
  const avgSpend = total
    ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / total)
    : 0;
  return { total, vipCount, activePlans, avgSpend };
}

export function filterCustomers(customers: Customer[], search: string): Customer[] {
  const term = search.toLowerCase().trim();
  if (!term) return customers;
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term)
  );
}

export function computeOrderTotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.qty * item.price, 0);
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001", name: "Sarah Mwangi", email: "sarah.mwangi@email.com",
    phone: "+254 712 345 678", totalOrders: 24, totalSpent: 125400,
    activeInstallments: 2, paymentScore: 95, riskLevel: "low", segment: "VIP",
    joinedDate: "2025-06-15", lastPurchase: "2026-04-09",
    address: "123 Kimathi Street, Nairobi",
  },
  {
    id: "CUST-002", name: "John Kamau", email: "john.kamau@email.com",
    phone: "+254 723 456 789", totalOrders: 12, totalSpent: 67800,
    activeInstallments: 1, paymentScore: 72, riskLevel: "medium", segment: "Regular",
    joinedDate: "2025-08-22", lastPurchase: "2026-04-08",
    address: "45 Moi Avenue, Mombasa",
  },
  {
    id: "CUST-003", name: "Grace Njeri", email: "grace.njeri@email.com",
    phone: "+254 734 567 890", totalOrders: 8, totalSpent: 42500,
    activeInstallments: 3, paymentScore: 88, riskLevel: "low", segment: "Regular",
    joinedDate: "2025-10-11", lastPurchase: "2026-04-08",
    address: "78 Ngong Road, Nairobi",
  },
  {
    id: "CUST-004", name: "Peter Omondi", email: "peter.omondi@email.com",
    phone: "+254 745 678 901", totalOrders: 5, totalSpent: 28900,
    activeInstallments: 1, paymentScore: 55, riskLevel: "high", segment: "New",
    joinedDate: "2025-12-03", lastPurchase: "2026-04-07",
    address: "12 Kenyatta Avenue, Kisumu",
  },
  {
    id: "CUST-005", name: "Mary Wanjiku", email: "mary.wanjiku@email.com",
    phone: "+254 756 789 012", totalOrders: 18, totalSpent: 89300,
    activeInstallments: 2, paymentScore: 92, riskLevel: "low", segment: "VIP",
    joinedDate: "2025-05-20", lastPurchase: "2026-04-07",
    address: "99 Thika Road, Kiambu",
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: "ORD-A1B2C3", customerId: "CUST-001", customer: "Sarah Mwangi",
    email: "sarah.mwangi@email.com", phone: "+254 712 345 678",
    items: 3, total: 18500, amountPaid: 18500, remainingAmount: 0,
    paymentStatus: "paid", paymentType: "full", status: "delivered",
    createdAt: "2026-04-09T10:00:00Z", shippingAddress: "123 Kimathi Street, Nairobi",
    lineItems: [
      { variantId: "v1", productId: "p1", sku: "WH-BLK-42", name: "Runner Pro - Black (42)", qty: 1, price: 5500, originalPrice: 5500 },
      { variantId: "v2", productId: "p2", sku: "CT-WHT-L", name: "Classic Tee - White (L)", qty: 2, price: 900, originalPrice: 900 },
    ],
  },
  {
    id: "ORD-D4E5F6", customerId: "CUST-001", customer: "Sarah Mwangi",
    email: "sarah.mwangi@email.com", phone: "+254 712 345 678",
    items: 2, total: 12000, amountPaid: 4000, remainingAmount: 8000,
    paymentStatus: "partial", paymentType: "installment", installmentPlan: "3 months",
    status: "processing", createdAt: "2026-03-15T08:30:00Z",
    shippingAddress: "123 Kimathi Street, Nairobi",
    lineItems: [
      { variantId: "v3", productId: "p3", sku: "MON-BLK-27", name: "4K Edge Monitor - Black (27\")", qty: 1, price: 12000, originalPrice: 14000 },
    ],
  },
  {
    id: "ORD-G7H8I9", customerId: "CUST-002", customer: "John Kamau",
    email: "john.kamau@email.com", phone: "+254 723 456 789",
    items: 1, total: 5500, amountPaid: 5500, remainingAmount: 0,
    paymentStatus: "paid", paymentType: "full", status: "shipped",
    createdAt: "2026-04-08T14:00:00Z", shippingAddress: "45 Moi Avenue, Mombasa",
    lineItems: [
      { variantId: "v1", productId: "p1", sku: "WH-WHT-43", name: "Runner Pro - White (43)", qty: 1, price: 5500, originalPrice: 5500 },
    ],
  },
];

export const DEMO_VARIANTS = [
  { variantId: "v1", productId: "p1", sku: "WH-BLK-42", name: "Runner Pro - Black (42)", sellPrice: 5500 },
  { variantId: "v2", productId: "p2", sku: "CT-WHT-L",  name: "Classic Tee - White (L)", sellPrice: 900  },
  { variantId: "v3", productId: "p3", sku: "MON-BLK-27",name: "4K Edge Monitor - Black (27\")", sellPrice: 14000 },
  { variantId: "v4", productId: "p2", sku: "CT-BLK-M",  name: "Classic Tee - Black (M)", sellPrice: 900  },
  { variantId: "v5", productId: "p4", sku: "KBD-WHT-TKL",name: "Mechanical Keyboard - White/RGB (TKL)", sellPrice: 4200 },
];
