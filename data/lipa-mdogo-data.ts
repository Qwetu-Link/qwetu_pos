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

export const paymentPlans: PaymentPlan[] = [
  {
    id: "PAY-001",
    invoiceNo: "INV-2026-001",
    customer: "Sarah Mwangi",
    orderId: "ORD-12847",
    phone: "+254 712 345 678",
    email: "sarah@example.com",
    paymentMethod: "M-Pesa",
    products: [
      {
        name: "Samsung Galaxy A55 (6GB/128GB)",
        quantity: 1,
        unitPrice: 10500,
        total: 10500,
      },
      {
        name: "Samsung 25W Fast Charger",
        quantity: 1,
        unitPrice: 1950,
        total: 1950,
      },
    ],
    totalAmount: 12450,
    installments: 6,
    installmentAmount: 2075,
    startDate: "2026-01-09",
    frequency: "monthly",
  },
  {
    id: "PAY-002",
    invoiceNo: "INV-2026-002",
    customer: "John Kamau",
    orderId: "ORD-12823",
    phone: "+254 723 456 789",
    email: "john@example.com",
    paymentMethod: "M-Pesa",
    products: [{ name: "HP Laptop 15-dw3xxx", quantity: 1, unitPrice: 8900, total: 8900 }],
    totalAmount: 8900,
    installments: 9,
    installmentAmount: 989,
    startDate: "2025-12-07",
    frequency: "monthly",
  },
  {
    id: "PAY-003",
    invoiceNo: "INV-2026-003",
    customer: "Grace Njeri",
    orderId: "ORD-12845",
    phone: "+254 734 567 890",
    email: "grace@example.com",
    paymentMethod: "Airtel Money",
    products: [{ name: 'LG Smart TV 43" UHD', quantity: 1, unitPrice: 18900, total: 18900 }],
    totalAmount: 18900,
    installments: 12,
    installmentAmount: 1575,
    startDate: "2026-03-08",
    frequency: "monthly",
  },
  {
    id: "PAY-004",
    invoiceNo: "INV-2026-004",
    customer: "Mary Wanjiku",
    orderId: "ORD-12843",
    phone: "+254 756 789 012",
    email: "mary@example.com",
    paymentMethod: "M-Pesa",
    products: [
      { name: "Apple iPhone 14 Pro", quantity: 1, unitPrice: 13500, total: 13500 },
      { name: "Apple 20W USB-C Adapter", quantity: 1, unitPrice: 1200, total: 1200 },
      { name: "MagSafe Clear Case", quantity: 1, unitPrice: 500, total: 500 },
    ],
    totalAmount: 15200,
    installments: 9,
    installmentAmount: 1689,
    startDate: "2026-01-07",
    frequency: "monthly",
  },
  {
    id: "PAY-005",
    invoiceNo: "INV-2026-005",
    customer: "Peter Omondi",
    orderId: "ORD-12789",
    phone: "+254 745 678 901",
    email: "peter@example.com",
    paymentMethod: "M-Pesa",
    products: [{ name: "Bruhm Chest Freezer 300L", quantity: 1, unitPrice: 6500, total: 6500 }],
    totalAmount: 6500,
    installments: 6,
    installmentAmount: 1083,
    startDate: "2025-11-20",
    frequency: "monthly",
  },
  {
    id: "PAY-006",
    invoiceNo: "INV-2026-006",
    customer: "James Otieno",
    orderId: "ORD-12890",
    phone: "+254 712 345 000",
    email: "james@example.com",
    paymentMethod: "Bank Transfer",
    products: [{ name: 'Sony 65" OLED TV', quantity: 1, unitPrice: 22500, total: 22500 }],
    totalAmount: 22500,
    installments: 12,
    installmentAmount: 1875,
    startDate: "2026-04-15",
    frequency: "monthly",
  },
];

export const receipts: Receipt[] = [
  { id: "RCP-001", planId: "PAY-001", amount: 2075, date: "2026-01-09", method: "M-Pesa", ref: "QAX123KL", note: "1st installment" },
  { id: "RCP-002", planId: "PAY-001", amount: 2075, date: "2026-02-09", method: "M-Pesa", ref: "QBY456MN", note: "2nd installment" },
  { id: "RCP-003", planId: "PAY-001", amount: 2075, date: "2026-03-09", method: "M-Pesa", ref: "QCZ789OP", note: "3rd installment" },
  { id: "RCP-004", planId: "PAY-002", amount: 989, date: "2025-12-07", method: "M-Pesa", ref: "RDA001AB", note: "1st installment" },
  { id: "RCP-005", planId: "PAY-002", amount: 989, date: "2026-01-07", method: "M-Pesa", ref: "RDB002CD", note: "2nd installment" },
  { id: "RCP-006", planId: "PAY-002", amount: 989, date: "2026-02-07", method: "M-Pesa", ref: "RDC003EF", note: "3rd installment" },
  { id: "RCP-007", planId: "PAY-003", amount: 1575, date: "2026-03-08", method: "Airtel Money", ref: "AMA100GH", note: "1st installment" },
  { id: "RCP-008", planId: "PAY-003", amount: 1575, date: "2026-04-08", method: "Airtel Money", ref: "AMB200IJ", note: "2nd installment" },
  { id: "RCP-009", planId: "PAY-004", amount: 1689, date: "2026-01-07", method: "M-Pesa", ref: "MWA300KL", note: "1st installment" },
  { id: "RCP-010", planId: "PAY-004", amount: 1689, date: "2026-02-07", method: "M-Pesa", ref: "MWB400MN", note: "2nd installment" },
  { id: "RCP-011", planId: "PAY-004", amount: 1689, date: "2026-03-07", method: "M-Pesa", ref: "MWC500OP", note: "3rd installment" },
  { id: "RCP-012", planId: "PAY-005", amount: 1083, date: "2025-11-20", method: "M-Pesa", ref: "POA600QR", note: "1st installment" },
];

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getPlanReceipts(planId: string) {
  return receipts
    .filter((receipt) => receipt.planId === planId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPaidAmount(planId: string) {
  return getPlanReceipts(planId).reduce((sum, receipt) => sum + receipt.amount, 0);
}

export function getRemainingAmount(plan: PaymentPlan) {
  return Math.max(0, plan.totalAmount - getPaidAmount(plan.id));
}

export function getNextDueDate(plan: PaymentPlan) {
  const paidInstallments = getPlanReceipts(plan.id).length;

  if (paidInstallments >= plan.installments) {
    return null;
  }

  const dueDate = new Date(plan.startDate);
  dueDate.setMonth(dueDate.getMonth() + paidInstallments + 1);
  return dueDate.toISOString().slice(0, 10);
}

export function getPlanStatus(plan: PaymentPlan): PlanStatus {
  if (getPaidAmount(plan.id) >= plan.totalAmount) {
    return "completed";
  }

  const nextDueDate = getNextDueDate(plan);

  if (nextDueDate && new Date(nextDueDate) < new Date()) {
    return "overdue";
  }

  return "active";
}

export function getInstallmentSchedule(plan: PaymentPlan) {
  const paidCount = getPlanReceipts(plan.id).length;

  return Array.from({ length: plan.installments }, (_, index) => {
    const dueDate = new Date(plan.startDate);
    dueDate.setMonth(dueDate.getMonth() + index + 1);
    const paid = index < paidCount;
    const overdue = !paid && dueDate < new Date();

    return {
      installmentNo: index + 1,
      dueDate: dueDate.toISOString().slice(0, 10),
      amount: plan.installmentAmount,
      paidAmount: paid ? plan.installmentAmount : 0,
      balance: paid ? 0 : plan.installmentAmount,
      status: paid ? "paid" : overdue ? "overdue" : "pending",
      receipt: getPlanReceipts(plan.id)[index],
    };
  });
}
