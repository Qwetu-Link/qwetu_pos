import z from "zod";
import { variantCreateSchema } from "./variant";

const optionalUuid = z
    .string()
    .trim()
    .uuid("Invalid category")
    .optional()
    .nullable();

export const productSchema = z.object({
    name: z.string().trim().min(1, "Product name is required"),
    categoryId: z.string().trim().min(1, "Category is required"),
    brand: z.string().trim().min(1, "Supplier / brand is required"),
    description: z.string().trim(),
});

export const productCreateSchema = z.object({
    name: z.string().trim().min(1, "Product name is required"),
    categoryId: optionalUuid,
    brand: z.string().trim().min(1, "Supplier / brand is required"),
    description: z.string().trim().optional(),
    imageData: z.string().trim().startsWith("data:image/").optional(),
    imagesData: z.array(z.string().trim().startsWith("data:image/")).optional(),
    variants: z.array(
        variantCreateSchema.omit({
            productId: true,
        }).extend({
            sku: z.string().trim().min(1, "SKU is required").optional(),
        }),
    ).optional(),
});

export const productEditSchema = productCreateSchema.extend({
    id: z.string().trim().uuid("Invalid product"),
});

export const productIdSchema = z.object({
    id: z.string().trim().uuid("Invalid product"),
});

export const productImageUploadSchema = z.object({
    productId: z.string().trim().uuid("Invalid product"),
    imageData: z.string().trim().startsWith("data:image/"),
});

export type ProductDetailsFormValues = z.infer<typeof productSchema>;
export type ProductCreateValues = z.infer<typeof productCreateSchema>;
