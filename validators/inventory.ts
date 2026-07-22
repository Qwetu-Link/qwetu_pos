import z from "zod";

const locationSchema = z.enum(["Main Store", "Warehouse A", "Outlet"]);

export const adjustInventorySchema = z.object({
    variantId: z.string().trim().uuid("Invalid variant"),
    location: locationSchema,
    quantity: z.number().int().min(0, "Stock cannot be negative"),
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
