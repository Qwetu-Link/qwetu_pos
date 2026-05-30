import type { Metadata } from "next";
import ProductCategories from "./_components/ProductCategories";

export const metadata: Metadata = {
  title: "Categories | QwetuLinks Clothing POS",
  description: "Manage apparel categories for the clothing catalog.",
};

export default function CategoryPage() {
  return <ProductCategories />;
}
