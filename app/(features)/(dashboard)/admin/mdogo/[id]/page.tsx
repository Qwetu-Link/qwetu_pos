import type { Metadata } from "next";
import LipaMdogoDetailPage from "../_components/LipaMdogoDetailPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `${decodeURIComponent(id)} | Lipa Mdogo Details | QwetuLinks Clothing POS`,
    description: "View apparel installment schedule, receipts, and remaining customer balance.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <LipaMdogoDetailPage planId={decodeURIComponent(id)} />;
}
