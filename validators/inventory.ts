import z from "zod";

const locationSchema = z.enum(["Main Store", "Warehouse A", "Outlet"]);
export const stockAdjustmentReasonSchema = z.enum([
    "restock",
    "damaged_goods",
    "theft_shrinkage",
    "return",
    "physical_count_audit",
    "correction",
]);

export const adjustInventorySchema = z.object({
    variantId: z.string().trim().uuid("Invalid variant"),
    location: locationSchema,
    quantity: z.number().int().min(1, "Quantity must be greater than zero"),
    reason: stockAdjustmentReasonSchema,
    notes: z.string().trim().max(500, "Notes must be 500 characters or fewer").optional(),
});

export const transferInventorySchema = z.object({
    variantId: z.string().trim().uuid("Invalid variant"),
    from: locationSchema,
    to: locationSchema,
    quantity: z.number().int().min(1, "Quantity must be greater than zero"),
}).refine((values) => values.from !== values.to, {
    message: "Source and destination must be different.",
    path: ["to"],
});

export const inventoryVariantSchema = z.object({
    variantId: z.string().trim().uuid("Invalid variant"),
});

export const createPurchaseOrderSchema = z.object({
    variantId: z.string().trim().uuid("Invalid variant"),
    supplierName: z.string().trim().min(1, "Supplier is required").max(255),
    quantity: z.number().int().min(1, "Quantity must be greater than zero"),
    notes: z.string().trim().max(1000, "Notes must be 1000 characters or fewer").optional(),
});

export const purchaseOrderIdSchema = z.object({
    id: z.string().trim().uuid("Invalid purchase order"),
});
