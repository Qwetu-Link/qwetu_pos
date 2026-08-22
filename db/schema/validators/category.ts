import z from "zod";

export const categorySchema = z.object({
    name: z.string().trim().min(1, "Category name is required"),
    description: z.string().trim(),
    icon: z.string().trim().min(1),
});

export const editCategorySchema = z.object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1, "Category name is required"),
    description: z.string().trim(),
    icon: z.string().trim().min(1),
});

export const categoryIdSchema = z.object({
    id: z.string().trim().min(1),
})

export type CategoryFormValues = z.infer<typeof categorySchema>;