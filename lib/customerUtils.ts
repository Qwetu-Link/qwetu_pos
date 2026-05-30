import type { Customer, CustomerStats, LineItem, RiskLevel } from "../types/customer";

export { DEMO_CUSTOMERS, DEMO_ORDERS, DEMO_VARIANTS } from "@/data/customers";

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function getPaymentScoreFromRisk(risk: RiskLevel): number {
  return risk === "low" ? 85 : risk === "medium" ? 65 : 45;
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
