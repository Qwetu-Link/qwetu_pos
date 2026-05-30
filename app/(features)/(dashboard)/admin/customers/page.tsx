import type { Metadata } from "next";
import { CustomerManagement } from "./_components/CustomerManagement";

export const metadata: Metadata = {
  title: "Customers | QwetuLinks Clothing POS",
  description: "Manage clothing store customers, segments, balances, and order history.",
};

export default function CustomerPage() {
  return <CustomerManagement />;
}
