"use client";

import { useCallback, useMemo, useState } from "react";
import CatalogStatsCards from "./CatalogStatsCards";
import ProductCard from "./ProductCard";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import type { CatalogFilters } from "@/types/admin/catalog";
import { computeCatalogStats, exportProductsToCSV } from "@/utils/catalog-utils";
import { LucideDownload, Package, PlusIcon, Search, Tag } from "lucide-react";
import DeleteModal from "@/components/common/DeleteModal";
import {
  useDeleteProduct,
  useGetProducts,
} from "@/hooks/useProduct";
import { useGetCategories } from "@/hooks/useCategory";
import { toast } from "sonner";
import Link from "next/link";
import { ProductCardsSkeleton } from "@/components/skeletons";

const productToastStyles = {
  updated: {
    background: "#dbeafe",
    border: "1px solid #93c5fd",
    color: "#1e40af",
  },
  deleted: {
    background: "#fef3c7",
    border: "1px solid #fcd34d",
    color: "#92400e",
  },
} as const;

export default function ProductCatalog() {
  const { products, isLoading, isError, error } = useGetProducts();
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const deleteProduct = useDeleteProduct();
  const [filters, setFilters] = useState<CatalogFilters>({
    search: "",
    category: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    const search = filters.search.trim().toLowerCase();

    if (search) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.brand.toLowerCase().includes(search),
      );
    }

    if (filters.category !== "all") {
      list = list.filter((product) => product.categoryId === filters.category);
    }

    return list;
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visiblePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (visiblePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, visiblePage, perPage]);

  const stats = useMemo(() => computeCatalogStats(products), [products]);
  const isDeleting = deleteProduct.isPending;

  const handleFilterChange = useCallback((partial: Partial<CatalogFilters>) => {
    setFilters((current) => ({ ...current, ...partial }));
    setCurrentPage(1);
  }, []);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    try {
      await deleteProduct.mutateAsync({ id: deleteTarget.id });
      toast.success("Product deleted successfully.", {
        style: productToastStyles.deleted,
      });
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Product was not deleted. ${error.message}`
          : "Product was not deleted. Please try again.",
      );
    }
  }

  const mutationError =
    deleteProduct.error?.message;

  return (
    <div className="space-y-4 rounded-xl bg-gray-50 p-3 sm:space-y-6 sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-black sm:text-3xl">
            <Tag size={22} className="text-emerald-600 sm:h-6 sm:w-6" /> Product Catalog
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage your inventory, products, and pricing
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Link
            href="/admin/products/add"
            aria-disabled={isLoadingCategories}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2.5 text-sm font-medium text-white transition hover:shadow-lg aria-disabled:pointer-events-none aria-disabled:opacity-60 sm:px-5"
          >
            <PlusIcon size={16} /> Add Product
          </Link>
          <button
            onClick={() => exportProductsToCSV(products)}
            disabled={products.length === 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <LucideDownload size={16} /> Export CSV
          </button>
        </div>
      </div>

      <CatalogStatsCards stats={stats} />

      {(isError || mutationError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {mutationError || error?.message || "Could not load products."}
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(event) => handleFilterChange({ search: event.target.value })}
              placeholder="Search by product name, category, or supplier..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 sm:text-base"
            />
          </div>
          <select
            value={filters.category}
            onChange={(event) => handleFilterChange({ category: event.target.value })}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-black outline-none sm:text-base"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <ProductCardsSkeleton count={12} />
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={Package}
          title={
            products.length === 0
              ? "No products added yet"
              : "No products match your filters"
          }
          description={
            products.length === 0
              ? "Add your first item to start building the catalog from the database."
              : "Try a different product name, supplier, or category to bring matching items back into view."
          }
          action={
            products.length === 0 ? (
              <Link
                href="/admin/products/add"
                aria-disabled={categories.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 aria-disabled:pointer-events-none aria-disabled:opacity-60"
              >
                <PlusIcon size={16} /> Add Product
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {paginated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
            />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination
          currentPage={visiblePage}
          totalPages={totalPages}
          total={filtered.length}
          perPage={perPage}
          onPage={setCurrentPage}
          onPerPage={(value) => {
            setPerPage(value);
            setCurrentPage(1);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          title={isDeleting ? "Deleting Product" : "Delete Product"}
          isDeleting={isDeleting}
          onConfirm={() => {
            void handleDeleteConfirm();
          }}
          onCancel={() => {
            if (!isDeleting) setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
