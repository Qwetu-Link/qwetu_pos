import type { Metadata } from "next";
import BillingSetupPage from "../_components/BillingSetupPage";

export const metadata: Metadata = {
  title: "Configure Billing | QwetuLinks Clothing POS",
  description: "Configure billing contacts, invoice details, and payment preferences.",
};

export default function Page() {
  return <BillingSetupPage />;
}
