import type { Metadata } from "next";
import ManualAddOrderPage from "@/features/orders/components/manualAddOrderPage";

export const metadata: Metadata = {
  title: "Manual Add Order | QwetuLinks Clothing POS",
  description: "Create a customer order manually from available stock.",
};

export default function AddOrderPage() {
  return <ManualAddOrderPage />;
}
