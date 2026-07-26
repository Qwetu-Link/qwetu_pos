import type { Metadata } from "next";
import EditExpensePage from "../../../_components/EditExpensePage";

export const metadata: Metadata = {
  title: "Edit Expense | QwetuLinks Clothing POS",
  description: "Edit a business expense.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditExpensePage expenseId={id} />;
}
