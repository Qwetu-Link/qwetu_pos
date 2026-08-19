import type { DashboardActivity, DashboardBar } from "./dashboard";

export type DashboardRoleKey = "owner" | "manager" | "cashier" | "accountant" | "inventory";

export interface DashboardCollectionPoint {
  month: string;
  value: number;
}

export interface DashboardPaymentHealthItem {
  label: "Active" | "Overdue" | "Completed";
  value: number;
}

export interface DashboardSummary {
  revenueToday: number;
  revenueMonth: number;
  ordersToday: number;
  openOrders: number;
  awaitingPayment: number;
  activeCustomers: number;
  newCustomersMonth: number;
  collectionsDue: number;
  activePlans: number;
  receiptsToday: number;
  receiptsTodayCount: number;
  expensesMonth: number;
  pendingExpenses: number;
  stockValue: number;
  products: number;
  variants: number;
  lowStock: number;
  criticalStock: number;
  completedSalesToday: number;
  installmentsToday: number;
  collectedThisMonth: number;
  reportsReady: number;
  pendingReconciliation: number;
  activities: DashboardActivity[];
  paymentBars: DashboardBar[];
  stockBars: DashboardBar[];
  orderBars: DashboardBar[];
  collectionTrend: DashboardCollectionPoint[];
  paymentHealth: DashboardPaymentHealthItem[];
}
