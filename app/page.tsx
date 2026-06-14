import type { Metadata } from "next";
import OverviewPage from "./(features)/_home/overviewpage";

export const metadata: Metadata = {
  title: "QwetuLinks Clothing POS",
  description:
    "Clothing store POS for apparel sales, inventory, customers, and Lipa Mdogo collections.",
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

export default function Home() {
  return (
    <main>
      <OverviewPage />
    </main>
  );
}
