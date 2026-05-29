import { notFound } from "next/navigation";
import LipaMdogoDetailPage from "../_components/LipaMdogoDetailPage";
import { paymentPlans } from "@/data/lipa-mdogo-data";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return paymentPlans.map((plan) => ({
    id: plan.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const plan = paymentPlans.find((item) => item.id === id);

  return {
    title: plan
      ? `${plan.invoiceNo} | Lipa Mdogo Details`
      : "Lipa Mdogo Details",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const plan = paymentPlans.find((item) => item.id === id);

  if (!plan) {
    notFound();
  }

  return <LipaMdogoDetailPage plan={plan} />;
}
