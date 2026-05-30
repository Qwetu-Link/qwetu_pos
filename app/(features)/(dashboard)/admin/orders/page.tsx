import type { Metadata } from "next";
import OrdersPage from "./_components/ordersPage";

export const metadata: Metadata = {
  title: "Orders | QwetuLinks Clothing POS",
  description: "Track apparel orders, fulfillment, and installment payment status.",
};

export default function OrderPage() {
  return <OrdersPage />;
}
