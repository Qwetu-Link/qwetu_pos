import type { Metadata } from "next";
import DashboardPageClient from "@/features/dashboard/components/DashboardPageClient";

export const metadata: Metadata = {
  title: "Dashboard | QwetuLinks Clothing POS",
  description:
    "Role-based overview for sales, stock, customers, and apparel store performance.",
  generator: "Outside Of Time",
  icons: {
    icon: [
      {
        url: "/web-app-manifest-192x192.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/web-app-manifest-192x192.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
