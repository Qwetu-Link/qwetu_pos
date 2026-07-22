"use client";

import { useCallback, useMemo, useState } from "react";
import CatalogStatsCards from "./CatalogStatsCards";
import ProductCard from "./ProductCard";
import ProductModal from "../forms/ProductModal";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import type { CatalogFilters, Product, ProductSaveValues } from "@/types/catalog";
import { computeCatalogStats, exportProductsToCSV } from "@/utils/catalog-utils";
import { LucideDownload, Loader2, Package, PlusIcon, Search, Tag } from "lucide-react";
import DeleteModal from "@/components/common/DeleteModal";
import {
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
  useUploadProductImage,
} from "@/hooks/useProduct";
import { useGetCategories } from "@/hooks/useCategory";
import { toast } from "sonner";
import Link from "next/link";

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
  const updateProduct = useUpdateProduct();
  const uploadProductImage = useUploadProductImage();
  const deleteProduct = useDeleteProduct();
  const [filters, setFilters] = useState<CatalogFilters>({
    search: "",
    category: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
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
  const isSaving = updateProduct.isPending || uploadProductImage.isPending;
  const isDeleting = deleteProduct.isPending;

  const handleFilterChange = useCallback((partial: Partial<CatalogFilters>) => {
    setFilters((current) => ({ ...current, ...partial }));
    setCurrentPage(1);
  }, []);

  async function handleSaveProduct(values: ProductSaveValues, existingId?: string) {
    try {
      if (!existingId) {
        return;
      }

      await updateProduct.mutateAsync({
        id: existingId,
        name: values.name,
        categoryId: values.categoryId,
        brand: values.brand,
        description: values.description,
      });

      await Promise.all(
        values.imagesData.map((imageData) =>
          uploadProductImage.mutateAsync({
            productId: existingId,
            imageData,
          }),
        ),
      );

      toast.success("Product updated successfully.", {
        style: productToastStyles.updated,
      });
      setEditTarget(null);
    } catch {
      // Mutation state exposes the error message in the page alert.
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    try {
      await deleteProduct.mutateAsync({ id: deleteTarget.id });
      toast.success("Product deleted successfully.", {
        style: productToastStyles.deleted,
      });
      setDeleteTarget(null);
    } catch {
      // Mutation state exposes the error message in the page alert.
    }
  }

  const mutationError =
    updateProduct.error?.message ||
    uploadProductImage.error?.message ||
    deleteProduct.error?.message;

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black flex items-center gap-2">
            <Tag size={24} className="text-emerald-600" /> Product Catalog
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your inventory, products, and pricing
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/add"
            aria-disabled={isLoadingCategories}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 font-medium aria-disabled:pointer-events-none aria-disabled:opacity-60"
          >
            <PlusIcon size={16} /> Add Product
          </Link>
          <button
            onClick={() => exportProductsToCSV(products)}
            disabled={products.length === 0}
            className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(event) => handleFilterChange({ search: event.target.value })}
              placeholder="Search by product name, category, or supplier..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
            />
          </div>
          <select
            value={filters.category}
            onChange={(event) => handleFilterChange({ category: event.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none text-black"
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
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
          <Loader2 className="mr-2 animate-spin text-emerald-600" size={18} />
          Loading products...
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(id) => {
                const selectedProduct = products.find((item) => item.id === id) ?? null;
                setEditTarget(selectedProduct);
              }}
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

      {editTarget !== null && (
        <ProductModal
          product={editTarget}
          categories={categories}
          isSaving={isSaving}
          onSave={(values, existingId) => {
            void handleSaveProduct(values, existingId);
          }}
          onClose={() => {
            if (!isSaving) setEditTarget(null);
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
