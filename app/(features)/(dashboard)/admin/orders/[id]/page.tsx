import type { Metadata } from "next";
import OrderDetailsPage from "../_components/orderDetailsPage";

export const metadata: Metadata = {
  title: "Order Details | QwetuLinks Clothing POS",
  description: "Review apparel order details, payment status, line items, and installments.",
};

export default function DetailsPage() {
  return <OrderDetailsPage />;
}
