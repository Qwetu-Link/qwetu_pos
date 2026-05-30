import type { Metadata } from "next";
import TransactionsPage from "./_components/TransactionsPage";

export const metadata: Metadata = {
  title: "Transactions | QwetuLinks Clothing POS",
  description: "Review clothing store sales, refunds, expenses, and installment payments.",
};

export default function TransactionPage() {
  return <TransactionsPage />;
}
