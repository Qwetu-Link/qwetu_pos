import type { Metadata } from "next";
import PaymentsPage from "./_components/payments_page";

export const metadata: Metadata = {
  title: "Payments | QwetuLinks Clothing POS",
  description: "Payments workspace for clothing store collections and reconciliation.",
};

export default function PaymenPage() {
  return <PaymentsPage />;
}
