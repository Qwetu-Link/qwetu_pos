import type { Metadata } from "next";
import { InventoryIntelligence } from "./_components/InventoryIntelligence";

export const metadata: Metadata = {
  title: "Inventory | QwetuLinks Clothing POS",
  description: "Monitor apparel inventory, stock movement, low-stock alerts, and transfers.",
};

export default function InventoryPage() {
  return <InventoryIntelligence />;
}
