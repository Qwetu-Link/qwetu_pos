"use client";

import { useState, useMemo, useCallback } from "react";
import CatalogStatsCards from "./CatalogStatsCards";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import DeleteModal from "./DeleteModal";
import Pagination from "./Pagination";
import { CatalogFilters, Product, ProductCategory } from "@/types/catalog";
import { dummyProducts } from "@/data/products";
import { computeCatalogStats, exportProductsToCSV, generateProductId } from "@/lib/catalog-utils";
import { LucideDownload, Package, PlusIcon, Search, Tag } from "lucide-react";

const CATEGORIES: ProductCategory[] = [
  "Men's Clothing",
  "Women's Clothing",
  "Accessories",
  "Footwear",
  "Kids Wear",
  "Outerwear",
];

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [filters, setFilters] = useState<CatalogFilters>({
    search: "",
    category: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Modal state
  const [editTarget, setEditTarget] = useState<Product | null | "new">(null); // null = closed, "new" = add, Product = edit
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Filtered products
  const filtered = useMemo(() => {
    let list = [...products];
    const s = filters.search.toLowerCase();
    if (s) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s)
      );
    }
    if (filters.category !== "all") {
      list = list.filter((p) => p.category === filters.category);
    }
    return list;
  }, [products, filters]);

  // Paginated slice
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  const stats = useMemo(() => computeCatalogStats(products), [products]);

  // Handlers
  const handleFilterChange = useCallback((partial: Partial<CatalogFilters>) => {
    setFilters((f) => ({ ...f, ...partial }));
    setCurrentPage(1);
  }, []);

  const handleSaveProduct = useCallback(
    (data: Omit<Product, "id">, existingId?: string) => {
      setProducts((prev) => {
        if (existingId) {
          return prev.map((p) =>
            p.id === existingId ? { ...p, ...data, id: existingId } : p
          );
        } else {
          const newId = generateProductId(prev);
          return [{ id: newId, ...data }, ...prev];
        }
      });
      setEditTarget(null);
    },
    []
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget]);

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-600 flex items-center gap-2">
            <Tag size={24} className="text-emerald-600" /> Product Catalog
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your inventory, products, and pricing
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditTarget("new")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 font-medium"
          >
            <PlusIcon size={16} /> Add Product
          </button>
          <button
            onClick={() => exportProductsToCSV(products)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 font-medium text-gray-700"
          >
            <LucideDownload size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <CatalogStatsCards stats={stats} />

      {/* ---- Search & Filter ---- */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Search by product name, category, or supplier..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-black"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) =>
              handleFilterChange({ category: e.target.value as ProductCategory | "all" })
            }
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none text-black"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ---- Products Grid ---- */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border">
          <p className="text-5xl mb-3">
            <Package size={48} className="mx-auto text-gray-300" />
          </p>
          <p className="text-lg font-medium text-gray-500">No products found</p>
          <p className="text-sm mt-1">
            {filters.search || filters.category !== "all"
              ? "Try adjusting your filters"
              : 'Click "Add Product" to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(id) => {
                const p = products.find((x) => x.id === id) ?? null;
                setEditTarget(p);
              }}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
            />
          ))}
        </div>
      )}

      {/* ---- Pagination ---- */}
      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          perPage={perPage}
          onPageChange={setCurrentPage}
          onPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
        />
      )}

      {/* ---- Product Modal ---- */}
      {editTarget !== null && (
        <ProductModal
          product={editTarget === "new" ? null : editTarget}
          onSave={handleSaveProduct}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* ---- Delete Modal ---- */}
      {deleteTarget && (
        <DeleteModal
          productName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
