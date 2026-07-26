import type { Metadata } from "next";
import ExpenseDetailPage from "../../_components/ExpenseDetailPage";

export const metadata: Metadata = {
  title: "Expense Details | QwetuLinks Clothing POS",
  description: "View expense details and update approval status.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExpenseDetailPage expenseId={id} />;
}
