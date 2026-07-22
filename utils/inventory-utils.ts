import type { InventoryItem, InventoryStats } from "@/types/inventory";
import type { Product } from "@/types/catalog";

export { DEMO_INVENTORY } from "@/data/inventory";

export function mapProductsToInventoryItems(products: Product[]): InventoryItem[] {
  return products.flatMap((product) =>
    product.variants.map((variant) =>
      recalcTotalStock({
        variantId: variant.id,
        sku: variant.sku,
        productName: product.name,
        color: variant.color,
        size: variant.size,
        inventory: {
          reorderPoint: variant.inventory.reorderPoint,
          lastRestocked: variant.inventory.lastRestocked,
          totalStock: variant.inventory.totalStock,
          status: variant.inventory.status,
          locations: variant.inventory.locations.map((location) => ({
            name: location.name,
            stock: location.stock,
            reorderPoint: location.reorderPoint,
          })),
        },
      })
    )
  );
}

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
