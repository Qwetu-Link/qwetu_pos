// ============================================================
// QwetuLinks Product Categories — Type Definitions
// ============================================================

export interface Category {
  id: number;
  name: string;
  description: string;
  /** Font Awesome class string e.g. "fas fa-tshirt" */
  icon: string;
  /** Number of products assigned to this category */
  productCount: number;
}

// ---- Form values ----

export interface CategoryFormValues {
  name: string;
  description: string;
  icon: string;
}

// ---- Stats ----

export interface CategoryStats {
  total: number;
  totalProducts: number;
  avgProductsPerCategory: number;
}
