import type { Metadata } from "next";
import ProductVariantsPage from "@/features/variants/components/VariantsPage";

export const metadata: Metadata = {
  title: "Product Variants | QwetuLinks Clothing POS",
  description: "Manage apparel variants by color, size, price, and reorder point.",
};

export default function VariantPage() {
  return <ProductVariantsPage />;
}
