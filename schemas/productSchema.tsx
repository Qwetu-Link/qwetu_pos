import { CATEGORIES } from "@/utils/select";
import z from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  category: z.enum(CATEGORIES),
  brand: z.string().trim().min(1, "Supplier / brand is required"),
  description: z.string().trim(),
});

export type ProductDetailsFormValues = z.infer<typeof productSchema>;