import { ProductCategory } from "@/types/catalog";

// Product
export const CATEGORIES = [
  "Men's Clothing",
  "Women's Clothing",
  "Accessories",
  "Footwear",
  "Kids Wear",
  "Outerwear",
] as const satisfies readonly ProductCategory[];


// Variants Select
export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
export const FOOTWEAR_SIZES = Array.from({ length: 13 }, (_, i) => String(i + 36));