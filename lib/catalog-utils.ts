import type {
  Product,
  ProductVariant,
  CatalogStats,
  VariantInventory,
  NewVariantFormValues,
} from "@/types/catalog";
import { formatCurrency } from "@/lib/formatters";

// ---- ID generators ----

export function generateProductId(products: Product[]): string {
  if (products.length === 0) return "PRD-0001";
  const maxNum = products.reduce((max, p) => {
    const num = parseInt(p.id.replace(/\D/g, "")) || 0;
    return Math.max(max, num);
  }, 0);
  return `PRD-${String(maxNum + 1).padStart(4, "0")}`;
}

export function generateVariantId(): string {
  return `var_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// ---- SKU auto-generation ----

export function autoGenerateSku(
  productName: string,
  color: string,
  size: string
): string {
  let prefix = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  if (prefix.length < 2) prefix = "PRD";
  const col = (color || "DEF").substring(0, 3).toUpperCase();
  const sz = String(size || "").toUpperCase().replace(/\s/g, "");
  return `${prefix}-${col}-${sz}`;
}

// ---- Currency formatting ----

export { formatCurrency };

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`;
  return `KES ${amount}`;
}

// ---- Stats ----

export function computeCatalogStats(products: Product[]): CatalogStats {
  const variants = products.flatMap((p) => p.variants);
  const totalProducts = products.length;
  const inventoryValue = variants.reduce(
    (sum, v) => sum + v.sellPrice * v.inventory.totalStock,
    0
  );
  const avgPrice = variants.length
    ? variants.reduce((sum, v) => sum + v.sellPrice, 0) / variants.length
    : 0;
  const lowStockCount = variants.filter(
    (v) => v.inventory.totalStock <= 10
  ).length;
  return { totalProducts, inventoryValue, avgPrice, lowStockCount };
}

// ---- Inventory status ----

export function computeInventoryStatus(
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

// ---- Build a new variant object from form values ----

export function buildVariant(
  productName: string,
  values: NewVariantFormValues
): ProductVariant {
  const { color, size, buyPrice, sellPrice, mainStock } = values;
  return {
    id: generateVariantId(),
    sku: autoGenerateSku(productName, color, size),
    color,
    size,
    buyPrice,
    sellPrice,
    inventory: computeInventoryStatus({
      totalStock: mainStock,
      reorderPoint: 10,
      status: "healthy",
      lastRestocked: new Date().toISOString().slice(0, 10),
      locations: [
        { name: "Main Store", stock: mainStock, reorderPoint: 5 },
        { name: "Warehouse A", stock: 0, reorderPoint: 5 },
        { name: "Outlet", stock: 0, reorderPoint: 5 },
      ],
    }),
  };
}

// ---- Product total stock helper ----

export function getProductTotalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.inventory.totalStock, 0);
}

// ---- Unique sizes for a product ----

export function getProductUniqueSizes(product: Product): string[] {
  return [...new Set(product.variants.map((v) => v.size))];
}

// ---- Image source ----

export function getProductImageSrc(product: Product): string {
  if (product.imageData?.startsWith("data:image")) return product.imageData;
  if (product.imageUrl?.trim()) return product.imageUrl;
  return `https://via.placeholder.com/400x400?text=${encodeURIComponent(
    product.name.charAt(0)
  )}`;
}

// ---- CSV Export ----

export function exportProductsToCSV(products: Product[]): void {
  const headers = [
    "Product ID",
    "Product Name",
    "Category",
    "Brand",
    "Variant ID",
    "SKU",
    "Color",
    "Size",
    "Buy Price (KES)",
    "Sell Price (KES)",
    "Total Stock",
    "Status",
    "Reorder Point",
    "Last Restocked",
    "Description",
  ];

  const rows = products.flatMap((product) =>
    product.variants.map((v) => [
      product.id,
      product.name,
      product.category,
      product.brand,
      v.id,
      v.sku,
      v.color,
      v.size,
      v.buyPrice,
      v.sellPrice,
      v.inventory.totalStock,
      v.inventory.status,
      v.inventory.reorderPoint,
      v.inventory.lastRestocked,
      product.description ?? "",
    ])
  );

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "qwetulinks_inventory_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
