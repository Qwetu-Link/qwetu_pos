import type { Metadata } from "next";
import AddExpensePage from "../../_components/AddExpensePage";

export const metadata: Metadata = {
  title: "Add Expense | QwetuLinks Clothing POS",
  description: "Create an itemized business expense.",
};

export default function Page() {
  return <AddExpensePage />;
}
