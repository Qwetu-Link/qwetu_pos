import type { Metadata } from "next";
import ReportsPage from "./_components/ReportsPage";

export const metadata: Metadata = {
  title: "Reports | QwetuLinks Clothing POS",
  description: "Generate clothing store sales, inventory, customer, and collection reports.",
};

export default function ReportPage() {
  return <ReportsPage />;
}
