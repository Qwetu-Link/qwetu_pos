import type { InventoryItem, InventoryStats } from "@/types/inventory";

export function recalcTotalStock(item: InventoryItem): InventoryItem {
  if (!item.inventory?.locations) return item;

  const total = item.inventory.locations.reduce(
    (sum, loc) => sum + (loc.stock || 0),
    0
  );
  const reorder = item.inventory.reorderPoint || 5;

  item.inventory.totalStock = total;

  if (total === 0) item.inventory.status = "reorder";
  else if (total <= 3) item.inventory.status = "critical";
  else if (total <= reorder * 0.6) item.inventory.status = "low";
  else item.inventory.status = "healthy";

  return item;
}

export function computeStats(items: InventoryItem[]): InventoryStats {
  return {
    healthy: items.filter((i) => i.inventory.status === "healthy").length,
    low: items.filter((i) => i.inventory.status === "low").length,
    critical: items.filter((i) => i.inventory.status === "critical").length,
    reorder: items.filter((i) => i.inventory.status === "reorder").length,
  };
}

export function filterItems(
  items: InventoryItem[],
  searchTerm: string,
  location: string
): InventoryItem[] {
  let filtered = [...items];

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.productName.toLowerCase().includes(term) ||
        i.sku.toLowerCase().includes(term)
    );
  }

  if (location !== "all") {
    filtered = filtered.filter((item) =>
      item.inventory.locations.some((loc) => loc.name === location)
    );
  }

  return filtered;
}

export const DEMO_INVENTORY: InventoryItem[] = [
  {
    sku: "WH-ULTRA-X1",
    productName: "UltraBoost Running Shoe",
    color: "Black/Neon",
    size: "US 9",
    inventory: {
      reorderPoint: 12,
      lastRestocked: new Date().toISOString(),
      totalStock: 73,
      status: "healthy",
      locations: [
        { name: "Main Store", stock: 24, reorderPoint: 8 },
        { name: "Warehouse A", stock: 42, reorderPoint: 15 },
        { name: "Outlet", stock: 7, reorderPoint: 5 },
      ],
    },
  },
  {
    sku: "BT-HYBRID-02",
    productName: "Noise Cancelling Headphones",
    color: "Silver",
    size: "One Size",
    inventory: {
      reorderPoint: 10,
      lastRestocked: new Date(Date.now() - 86400000 * 5).toISOString(),
      totalStock: 23,
      status: "low",
      locations: [
        { name: "Main Store", stock: 3, reorderPoint: 5 },
        { name: "Warehouse A", stock: 18, reorderPoint: 10 },
        { name: "Outlet", stock: 2, reorderPoint: 4 },
      ],
    },
  },
  {
    sku: "TAB-PRO-11",
    productName: "Quantum Tablet",
    color: "Space Gray",
    size: "128GB",
    inventory: {
      reorderPoint: 8,
      lastRestocked: new Date(Date.now() - 86400000 * 12).toISOString(),
      totalStock: 3,
      status: "critical",
      locations: [
        { name: "Main Store", stock: 0, reorderPoint: 3 },
        { name: "Warehouse A", stock: 2, reorderPoint: 8 },
        { name: "Outlet", stock: 1, reorderPoint: 2 },
      ],
    },
  },
  {
    sku: "MON-EDGE-27",
    productName: "4K Edge Monitor",
    color: "Black",
    size: "27 inch",
    inventory: {
      reorderPoint: 6,
      lastRestocked: new Date(Date.now() - 86400000 * 2).toISOString(),
      totalStock: 28,
      status: "healthy",
      locations: [
        { name: "Main Store", stock: 9, reorderPoint: 4 },
        { name: "Warehouse A", stock: 15, reorderPoint: 6 },
        { name: "Outlet", stock: 4, reorderPoint: 3 },
      ],
    },
  },
  {
    sku: "KBD-MECH-RGB",
    productName: "Mechanical Gaming Keyboard",
    color: "White/RGB",
    size: "TKL",
    inventory: {
      reorderPoint: 10,
      lastRestocked: new Date().toISOString(),
      totalStock: 41,
      status: "healthy",
      locations: [
        { name: "Main Store", stock: 14, reorderPoint: 6 },
        { name: "Warehouse A", stock: 22, reorderPoint: 10 },
        { name: "Outlet", stock: 5, reorderPoint: 4 },
      ],
    },
  },
  {
    sku: "CAM-LENS-50",
    productName: "Pro 50mm Camera Lens",
    color: "Black",
    size: "Universal",
    inventory: {
      reorderPoint: 5,
      lastRestocked: new Date(Date.now() - 86400000 * 20).toISOString(),
      totalStock: 0,
      status: "reorder",
      locations: [
        { name: "Main Store", stock: 0, reorderPoint: 2 },
        { name: "Warehouse A", stock: 0, reorderPoint: 3 },
        { name: "Outlet", stock: 0, reorderPoint: 1 },
      ],
    },
  },
];
