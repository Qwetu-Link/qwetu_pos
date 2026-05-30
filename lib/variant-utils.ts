import type {
  InventoryStatus,
  Product,
  InventoryItem,
  VariantInventory,
} from "@/types/catalog";

export function getStatus(
  totalStock: number,
  reorderPoint: number
): InventoryStatus {
  if (totalStock === 0) return "reorder";
  if (totalStock <= 5) return "critical";
  if (totalStock <= reorderPoint * 0.5) return "critical";
  if (totalStock < reorderPoint) return "low";
  return "healthy";
}

export function computeVariantInventory(
  inv: VariantInventory
): VariantInventory {
  const total = inv.locations.reduce((sum, loc) => sum + loc.stock, 0);

  return {
    ...inv,
    totalStock: total,
    status:
      total === 0
        ? "reorder"
        : total <= 5
        ? "critical"
        : total <= inv.reorderPoint
        ? "low"
        : "healthy",
  };
}

export function computeStats(items: InventoryItem[]) {
  let activeVariants = 0;
  let deadVariants = 0;
  let totalRevenue = 0;
  let totalCost = 0;

  items.forEach((item) => {
    const stock = item.inventory?.totalStock ?? 0;

    if (stock > 0) activeVariants++;
    else deadVariants++;

    totalRevenue += stock * item.sellPrice;
    totalCost += stock * item.buyPrice;
  });

  const grossProfitMargin =
    totalRevenue > 0
      ? Number((((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(2))
      : 0;

  return {
    totalVariants: items.length,
    activeVariants,
    deadVariants,
    grossProfitMargin,
  };
}

export function flattenVariants(products: Product[]): InventoryItem[] {
  return products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productId: product.id,
      productName: product.name,
    }))
  );
}
