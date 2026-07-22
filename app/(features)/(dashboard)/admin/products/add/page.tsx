import AddProductPage from "@/features/products/AddProductPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product | QwetuLinks Clothing POS",
  description: "Create a product with images, variants, and pricing.",
};

export default function AddProductRoute() {
  return <AddProductPage />;
}
