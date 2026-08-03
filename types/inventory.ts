export type InventoryStatus = "healthy" | "low" | "critical" | "reorder" | "incoming";
export type StockAdjustmentReason =
  | "restock"
  | "damaged_goods"
  | "theft_shrinkage"
  | "return"
  | "physical_count_audit"
  | "correction";
export type PurchaseOrderStatus = "draft" | "ordered" | "received" | "cancelled";

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
  variantId: string;
  sku: string;
  productName: string;
  supplierName?: string;
  color: string;
  size: string;
  inventory: InventoryData;
}

export interface InventoryStats {
  healthy: number;
  low: number;
  critical: number;
  reorder: number;
  incoming: number;
}
export type LocationName = "Main Store" | "Warehouse A" | "Outlet";

export interface StockAdjustmentLog {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  color: string;
  size: string;
  locationName: string;
  previousQuantity: number;
  newQuantity: number;
  quantityChanged: number;
  reason: StockAdjustmentReason;
  notes?: string | null;
  adjustedAt: Date;
  staffName: string;
}

export interface PurchaseOrderItem {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  expenseId?: string | null;
  notes?: string | null;
  createdAt: Date;
  createdByName: string;
  items: PurchaseOrderItem[];
}
