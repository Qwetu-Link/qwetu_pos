import type { Metadata } from "next";
import OverviewPage from "./(features)/_home/overviewpage";

export const metadata: Metadata = {
  title: "QwetuLinks Clothing POS",
  description: "Clothing store POS for apparel sales, inventory, customers, and Lipa Mdogo collections.",
};

export default function Home() {
  return (
    <main>
      <OverviewPage />
    </main>
  );
}
