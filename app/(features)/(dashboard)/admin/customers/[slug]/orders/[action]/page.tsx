import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ManualAddOrderPage from "@/features/orders/components/manualAddOrderPage";

type CustomerOrderActionParams = Promise<{
  slug: string;
  action: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: CustomerOrderActionParams;
}): Promise<Metadata> {
  const { slug, action } = await params;

  if (action !== "add") {
    return {
      title: "Customer Order | QwetuLinks Clothing POS",
    };
  }

  const customerId = decodeURIComponent(slug);

  return {
    title: `New Order - ${customerId} | QwetuLinks Clothing POS`,
    description: "Create a manual order for a selected customer.",
  };
}

export default async function CustomerOrderActionPage({
  params,
}: {
  params: CustomerOrderActionParams;
}) {
  const { slug, action } = await params;

  if (action !== "add") {
    notFound();
  }

  return <ManualAddOrderPage customerId={decodeURIComponent(slug)} />;
}
