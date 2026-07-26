import type { Metadata } from "next";
import AnalyticsEngineDetails from "@/features/analytics/components/AnalyticsEngineDetails";

export const metadata: Metadata = {
  title: "Analytics | QwetuLinks Clothing POS",
  description: "Analyze apparel sales, collections, customer segments, and category performance.",
};

export default function Page() {
  return <AnalyticsEngineDetails />;
}
