import type { Metadata } from "next";
import LipaMdogoPage from "./_components/LipaMdogoPage";

export const metadata: Metadata = {
  title: "Lipa Mdogo | QwetuLinks Clothing POS",
  description: "Track apparel installment plans, expected collections, overdue balances, and reminders.",
};

export default function Page() {
  return <LipaMdogoPage />;
}
