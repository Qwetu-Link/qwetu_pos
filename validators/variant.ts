import z from "zod";

const moneySchema = z.number().int().min(0, "Price cannot be negative");

export const variantSchema = z.object({
    color: z.string().trim().min(1, "Color is required"),
    size: z.string().trim().min(1, "Size is required"),
    buyPrice: moneySchema,
    sellPrice: moneySchema,
    mainStock: z.number().int().min(0, "Stock cannot be negative"),
});

export const variantCreateSchema = z.object({
    productId: z.string().trim().uuid("Invalid product"),
    sku: z.string().trim().min(1, "SKU is required"),
    color: z.string().trim().min(1, "Color is required"),
    size: z.string().trim().min(1, "Size is required"),
    buyPrice: moneySchema,
    sellPrice: moneySchema,
    mainStock: z.number().int().min(0, "Stock cannot be negative").optional(),
});

export const variantEditSchema = variantCreateSchema
    .omit({
        productId: true,
    })
    .extend({
        id: z.string().trim().uuid("Invalid variant"),
        reorderPoint: z.number().int().min(0, "Reorder point cannot be negative").optional(),
    });

export const variantIdSchema = z.object({
    id: z.string().trim().uuid("Invalid variant"),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
export type VariantCreateValues = z.infer<typeof variantCreateSchema>;
