import type { InventoryItem } from "@/types/inventory";

export const DEMO_INVENTORY: InventoryItem[] = [
  {
    variantId: "demo-snk-run-blk-42",
    sku: "SNK-RUN-BLK-42",
    productName: "Running Sneakers Pro",
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
    variantId: "demo-jkt-dnm-blu-m",
    sku: "JKT-DNM-BLU-M",
    productName: "Premium Denim Jacket",
    color: "Blue",
    size: "One Size",
    inventory: {
      reorderPoint: 10,
      lastRestocked: "2026-05-24T00:00:00.000Z",
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
    variantId: "demo-drs-flr-red-s",
    sku: "DRS-FLR-RED-S",
    productName: "Floral Wrap Dress",
    color: "Red",
    size: "S",
    inventory: {
      reorderPoint: 8,
      lastRestocked: "2026-05-17T00:00:00.000Z",
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
    variantId: "demo-trn-cam-m",
    sku: "TRN-CAM-M",
    productName: "Wool Trench Coat",
    color: "Camel",
    size: "M",
    inventory: {
      reorderPoint: 6,
      lastRestocked: "2026-05-27T00:00:00.000Z",
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
    variantId: "demo-blz-wht-l",
    sku: "BLZ-WHT-L",
    productName: "Tailored Blazer",
    color: "White",
    size: "L",
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
    variantId: "demo-blt-lth-blk",
    sku: "BLT-LTH-BLK",
    productName: "Leather Belt",
    color: "Black",
    size: "Universal",
    inventory: {
      reorderPoint: 5,
      lastRestocked: "2026-05-09T00:00:00.000Z",
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
