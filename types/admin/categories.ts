// ============================================================
// QwetuLinks Product Categories — Type Definitions
// ============================================================

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  productCount?: number;
}

// ---- Stats ----

export interface CategoryStats {
  total: number;
  totalProducts: number;
  avgProductsPerCategory: number;
}
