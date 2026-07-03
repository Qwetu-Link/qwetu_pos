// ============================================================
// QwetuLinks Product Categories — Type Definitions
// ============================================================

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

// ---- Stats ----

export interface CategoryStats {
  total: number;
  totalProducts: number;
  avgProductsPerCategory: number;
}
