import type { Metadata } from "next";
import InvoicesPage from './_components/invoices_page'

export const metadata: Metadata = {
  title: "Invoices | QwetuLinks Clothing POS",
  description: "Invoice workspace for apparel orders and billing records.",
};

export default function InvoicePage() {
  return <InvoicesPage/>
}
