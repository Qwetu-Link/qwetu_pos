import type { Metadata } from "next";
import DashboardPageClient from "./_components/DashboardPageClient";

export const metadata: Metadata = {
  title: "Dashboard | QwetuLinks Clothing POS",
  description: "Role-based overview for sales, stock, customers, and apparel store performance.",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
