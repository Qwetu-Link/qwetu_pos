import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProductDetailsQuery } from "@/db/queries/product";
import ProductDetailsPage from "@/features/products/ProductDetailsPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Product Details | QwetuLinks Clothing POS",
  description: "View product gallery, variants, pricing, and inventory details.",
};

export default async function ProductDetailsRoute({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.businessId) {
    redirect("/login");
  }

  const { id } = await params;
  const product = await getProductDetailsQuery({
    id,
    businessId: session.user.businessId,
  });

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage product={product} />;
}
