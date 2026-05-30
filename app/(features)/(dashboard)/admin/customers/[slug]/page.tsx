import type { Metadata } from "next";
import { CustomerDetailView } from "../_components/CustomerDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const customerId = decodeURIComponent(slug);

  return {
    title: `${customerId} | Customer Details | QwetuLinks Clothing POS`,
    description: "View apparel customer profile, order history, and installment details.",
  };
}

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CustomerDetailView customerId={decodeURIComponent(slug)} />;
}
