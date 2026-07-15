import { CategoryFormValues } from "@/validators/category";
import type { Category, CategoryStats } from "@/types/categories";

// ---- ID generation ----

export function generateCategoryId(): string {
  return globalThis.crypto?.randomUUID?.() ?? Date.now().toString();
}

// ---- Stats ----

export function computeCategoryStats(categories: Category[]): CategoryStats {
  const total = categories.length;
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.productCount ?? 0),
    0
  );
  const avgProductsPerCategory =
    total > 0 ? Math.round((totalProducts / total) * 10) / 10 : 0;
  return { total, totalProducts, avgProductsPerCategory };
}

// ---- CRUD helpers (pure — operate on a copy) ----

export function addCategory(
  categories: Category[],
  values: CategoryFormValues
): Category[] {
  const newCat: Category = {
    id: generateCategoryId(),
    name: values.name.trim(),
    description: values.description.trim(),
    icon: values.icon.trim() || "fas fa-tag",
    productCount: 0,
  };
  return [newCat, ...categories];
}

export function updateCategory(
  categories: Category[],
  id: string,
  values: CategoryFormValues
): Category[] {
  return categories.map((c) =>
    c.id === id
      ? {
          ...c,
          name: values.name.trim(),
          description: values.description.trim(),
          icon: values.icon.trim() || "fas fa-tag",
        }
      : c
  );
}

export function deleteCategory(
  categories: Category[],
  id: string
): Category[] {
  return categories.filter((c) => c.id !== id);
}

// ---- Filter ----

export function filterCategories(
  categories: Category[],
  search: string
): Category[] {
  const term = search.toLowerCase().trim();
  if (!term) return categories;
  return categories.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      (c.description ?? "").toLowerCase().includes(term)
  );
}
