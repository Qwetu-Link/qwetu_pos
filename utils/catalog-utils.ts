import type { VariantCreateValues, VariantFormValues } from "@/validators/variant";
import type {
  Product,
  ProductVariant,
  CatalogStats,
  StockLocation,
  VariantInventory,
} from "@/types/catalog";
import { formatCurrency } from "@/utils/formatters";

type VariantCreateInput = Omit<VariantCreateValues, "productId">;
type VariantOptionInput = Pick<ProductVariant, "color" | "size">;
type VariantPriceInput = Pick<ProductVariant, "color" | "size" | "buyPrice" | "sellPrice"> & {
  sku?: string;
  inventory?: VariantInventory;
  mainStock?: number;
};

const DEFAULT_REORDER_POINT = 10;

export const DEFAULT_STOCK_LOCATIONS: StockLocation[] = [
  { name: "Main Store", stock: 0, reorderPoint: 5 },
  { name: "Warehouse A", stock: 0, reorderPoint: 5 },
  { name: "Outlet", stock: 0, reorderPoint: 5 },
];

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

export function normalizeVariantOption(value: string): string {
  return value.trim().toLowerCase();
}

export function getVariantOptionKey(variant: VariantOptionInput): string {
  return `${normalizeVariantOption(variant.color)}::${normalizeVariantOption(variant.size)}`;
}

export function hasVariantOption(
  variants: VariantOptionInput[],
  candidate: VariantOptionInput
): boolean {
  const candidateKey = getVariantOptionKey(candidate);
  return variants.some((variant) => getVariantOptionKey(variant) === candidateKey);
}

export function ensureUniqueSku(sku: string, usedSkus: Iterable<string>): string {
  const normalizedUsedSkus = new Set(
    Array.from(usedSkus, (usedSku) => usedSku.trim().toUpperCase())
  );
  const baseSku = sku.trim().toUpperCase();

  if (!normalizedUsedSkus.has(baseSku)) {
    return baseSku;
  }

  let suffix = 2;
  let nextSku = `${baseSku}-${suffix}`;

  while (normalizedUsedSkus.has(nextSku)) {
    suffix += 1;
    nextSku = `${baseSku}-${suffix}`;
  }

  return nextSku;
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

export function buildVariantInventory(
  mainStock: number,
  reorderPoint = DEFAULT_REORDER_POINT
): VariantInventory {
  return computeInventoryStatus({
    totalStock: mainStock,
    reorderPoint,
    status: "healthy",
    lastRestocked: new Date().toISOString().slice(0, 10),
    locations: DEFAULT_STOCK_LOCATIONS.map((location) => ({
      ...location,
      stock: location.name === "Main Store" ? mainStock : 0,
    })),
  });
}

// ---- Build a new variant object from form values ----

export function buildVariant(
  productName: string,
  values: VariantFormValues,
  existingVariants: Pick<ProductVariant, "sku">[] = []
): ProductVariant {
  const { color, size, buyPrice, sellPrice, mainStock } = values;
  const sku = ensureUniqueSku(
    autoGenerateSku(productName, color, size),
    existingVariants.map((variant) => variant.sku)
  );

  return {
    id: `draft-${sku.toLowerCase()}`,
    sku,
    color,
    size,
    buyPrice,
    sellPrice,
    inventory: buildVariantInventory(mainStock),
  };
}

export function buildVariantCreateInput(
  productName: string,
  variant: VariantPriceInput,
  existingSkus: Iterable<string> = []
): VariantCreateInput {
  return {
    sku: ensureUniqueSku(
      variant.sku || autoGenerateSku(productName, variant.color, variant.size),
      existingSkus
    ),
    color: variant.color,
    size: variant.size,
    buyPrice: variant.buyPrice,
    sellPrice: variant.sellPrice,
    mainStock: variant.mainStock ?? variant.inventory?.totalStock ?? 0,
  };
}

export function buildVariantCreateInputs(
  productName: string,
  variants: VariantPriceInput[]
): VariantCreateInput[] {
  const usedSkus = new Set<string>();

  return variants.map((variant) => {
    const input = buildVariantCreateInput(productName, variant, usedSkus);
    usedSkus.add(input.sku);
    return input;
  });
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
  const imageUrl = product.imageUrl?.trim();
  if (
    imageUrl &&
    (imageUrl.startsWith("http") ||
      imageUrl.startsWith("data:image") ||
      imageUrl.startsWith("/"))
  ) {
    return imageUrl;
  }
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
