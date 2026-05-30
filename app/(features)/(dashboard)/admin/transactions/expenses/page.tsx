import type { Metadata } from "next";
import ExpensesPage from "../_components/ExpensesPage";

export const metadata: Metadata = {
  title: "Expenses | QwetuLinks Clothing POS",
  description: "Record and review clothing store expenses, vendors, and approval status.",
};

export default function Page() {
  return <ExpensesPage />;
}
