// ============================================================
// QwetuLinks Product Catalog — Type Definitions
// ============================================================

export type InventoryStatus = "healthy" | "low" | "critical" | "reorder";

export interface StockLocation {
  name: "Main Store" | "Warehouse A" | "Outlet";
  stock: number;
  reorderPoint: number;
}

export interface VariantInventory {
  totalStock: number;
  reorderPoint: number;
  status: InventoryStatus;
  lastRestocked: string; // ISO date string YYYY-MM-DD
  locations: StockLocation[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  size: string;
  buyPrice: number;
  sellPrice: number;
  inventory: VariantInventory;
}

export type InventoryItem = ProductVariant & {
  productId: string;
  productName: string;
};

export type ProductCategory =
  | "Men's Clothing"
  | "Women's Clothing"
  | "Accessories"
  | "Footwear"
  | "Kids Wear"
  | "Outerwear";

export interface Product {
  id: string;         // e.g. "PRD-0001"
  name: string;
  categoryId?: string | null;
  category: string;
  brand: string;
  description?: string;
  imageUrl?: string;
  imageData?: string; // base64 data URL for locally uploaded images
  images?: string[];
  variants: ProductVariant[];
}

// ---- Form / UI helpers ----

export interface ProductFormValues {
  name: string;
  categoryId: string;
  brand: string;
  description: string;
  imagesData: string[];
}

export type ProductSaveValues = ProductFormValues & {
  variants: ProductVariant[];
};

// ---- Catalog stats ----

export interface CatalogStats {
  totalProducts: number;
  inventoryValue: number;
  avgPrice: number;
  lowStockCount: number;
}

// ---- Filter state ----

export interface CatalogFilters {
  search: string;
  category: string;
}
