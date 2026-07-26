import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCategoriesQuery } from "@/db/queries/category";
import { getProductDetailsQuery } from "@/db/queries/product";
import EditProductPage from "@/features/products/EditProductPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Product | QwetuLinks Clothing POS",
  description: "Edit product details, variants, pricing, and images.",
};

export default async function EditProductRoute({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.businessId) {
    redirect("/login");
  }

  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductDetailsQuery({
      id,
      businessId: session.user.businessId,
    }),
    getCategoriesQuery(session.user.businessId),
  ]);

  if (!product) {
    notFound();
  }

  return <EditProductPage product={product} categories={categories} />;
}
