
import ProductCatalog from "@/features/products/ProductCatalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Catalog | QwetuLinks Clothing POS",
  description: "Manage apparel products, clothing categories, images, variants, and pricing.",
};

export default function ProductPage() {
  return <ProductCatalog />;
}
