export type InventoryStatus = "healthy" | "low" | "critical" | "reorder";

export type InventoryLocation = {
  name: string;
  stock: number;
};

export type Inventory = {
  reorderPoint: number;
  totalStock: number;
  lastRestocked?: string;
  locations: InventoryLocation[];
  status?: InventoryStatus;
};

export type ProductVariant = {
  sku: string;
  color?: string;
  size?: string;
  buyPrice: number;
  sellPrice: number;
  inventory: Inventory;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  variants: ProductVariant[];
};

export type InventoryItem = ProductVariant & {
  productId: string;
  productName: string;
};