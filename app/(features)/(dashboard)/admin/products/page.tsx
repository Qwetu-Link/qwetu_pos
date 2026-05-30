
import type { Metadata } from "next";
import ProductCatalog from "./_components/ProductCatalog";

export const metadata: Metadata = {
  title: "Product Catalog | QwetuLinks Clothing POS",
  description: "Manage apparel products, clothing categories, images, variants, and pricing.",
};

export default function ProductPage() {
  return <ProductCatalog />;
}
