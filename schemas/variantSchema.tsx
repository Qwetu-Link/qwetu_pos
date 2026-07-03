import z from "zod";


export const variantSchema = z.object({
  color: z.string().trim().min(1, "Color is required"),
  size: z.string().trim().min(1, "Size is required"),
  buyPrice: z.number().min(0, "Buy price cannot be negative"),
  sellPrice: z.number().min(0, "Sell price cannot be negative"),
  mainStock: z.number().int().min(0, "Stock cannot be negative"),
});


export type VariantFormValues = z.infer<typeof variantSchema>;