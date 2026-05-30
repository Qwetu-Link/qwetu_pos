export type InventoryStatus = "healthy" | "low" | "critical" | "reorder";

export interface InventoryLocation {
  name: string;
  stock: number;
  reorderPoint: number;
}

export interface InventoryData {
  reorderPoint: number;
  lastRestocked: string;
  totalStock: number;
  status: InventoryStatus;
  locations: InventoryLocation[];
}

export interface InventoryItem {
  sku: string;
  productName: string;
  color: string;
  size: string;
  inventory: InventoryData;
}

export interface InventoryStats {
  healthy: number;
  low: number;
  critical: number;
  reorder: number;
}
export type LocationName = "Main Store" | "Warehouse A" | "Outlet";
