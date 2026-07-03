import ProductCategories from "@/features/category/ProductCategories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | QwetuLinks Clothing POS",
  description: "Manage apparel categories for the clothing catalog.",
};

export default function CategoryPage() {
  return <ProductCategories />;
}
