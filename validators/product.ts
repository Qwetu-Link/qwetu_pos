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
    imageAttachments: z.array(z.object({
        imageData: z.string().trim().startsWith("data:image/"),
        variantId: z.string().trim().optional().nullable(),
    })).optional(),
    variants: z.array(
        variantCreateSchema.omit({
            productId: true,
        }).extend({
            clientId: z.string().trim().optional(),
            sku: z.string().trim().min(1, "SKU is required").optional(),
        }),
    ).optional(),
});

export const productEditSchema = productCreateSchema.extend({
    id: z.string().trim().uuid("Invalid product"),
    imageAssignments: z.array(z.object({
        imageUrl: z.string().trim().min(1),
        variantId: z.string().trim().uuid("Invalid variant").optional().nullable(),
    })).optional(),
});

export const productIdSchema = z.object({
    id: z.string().trim().uuid("Invalid product"),
});

export const productImageUploadSchema = z.object({
    productId: z.string().trim().uuid("Invalid product"),
    imageData: z.string().trim().startsWith("data:image/"),
    variantId: z.string().trim().uuid("Invalid variant").optional().nullable(),
});

export const productImageReplaceSchema = z.object({
    productId: z.string().trim().uuid("Invalid product"),
    imagesData: z.array(z.string().trim().startsWith("data:image/")).min(1),
    imageAttachments: z.array(z.object({
        imageData: z.string().trim().startsWith("data:image/"),
        variantId: z.string().trim().uuid("Invalid variant").optional().nullable(),
    })).optional(),
});

export const productImageRemoveSchema = z.object({
    productId: z.string().trim().uuid("Invalid product"),
    imageUrls: z.array(z.string().trim().min(1)).min(1),
});

export type ProductDetailsFormValues = z.infer<typeof productSchema>;
export type ProductCreateValues = z.infer<typeof productCreateSchema>;
