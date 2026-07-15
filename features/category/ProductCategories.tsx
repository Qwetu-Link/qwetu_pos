"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/types/categories";
import type { CategoryFormValues } from "@/validators/category";
import { toast } from "sonner";
import {
  computeCategoryStats,
  filterCategories,
} from "@/utils/category-utils";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "@/hooks/useCategory";
import CategoryStatsCards from "./CategoryStatsCards";
import CategoryCard from "./CategoryCard";
import CategoryModal from "../forms/CategoryModal";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { FolderOpen, Loader2, Plus, Search } from "lucide-react";
import DeleteModal from "@/components/common/DeleteModal";

const categoryToastStyles = {
  created: {
    background: "#dcfce7",
    border: "1px solid #86efac",
    color: "#166534",
  },
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

export default function ProductCategories() {
  const { categories, isLoading, isError, error } = useGetCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Modal state: null = closed, null-value = add mode, Category = edit mode
  const [editTarget, setEditTarget] = useState<Category | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filtered = useMemo(
    () => filterCategories(categories, search),
    [categories, search],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (visiblePage - 1) * perPage,
        visiblePage * perPage,
      ),
    [filtered, visiblePage, perPage],
  );

  const stats = useMemo(() => computeCategoryStats(categories), [categories]);

  // ---- Handlers ----

  const isSaving = createCategory.isPending || updateCategory.isPending;
  const isDeleting = deleteCategory.isPending;

  async function handleSave(values: CategoryFormValues, existingId?: string) {
    try {
      if (existingId) {
        await updateCategory.mutateAsync({ id: existingId, ...values });
        toast.success("Category updated successfully.", {
          style: categoryToastStyles.updated,
        });
      } else {
        await createCategory.mutateAsync(values);
        toast.success("Category created successfully.", {
          style: categoryToastStyles.created,
        });
      }

      setEditTarget(null);
    } catch {
      // Mutation state exposes the error message in the alert above.
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    try {
      await deleteCategory.mutateAsync({ id: deleteTarget.id });
      toast.success("Category deleted successfully.", {
        style: categoryToastStyles.deleted,
      });
      setDeleteTarget(null);
    } catch {
      // Mutation state exposes the error message in the alert above.
    }
  }

  const mutationError =
    createCategory.error?.message ||
    updateCategory.error?.message ||
    deleteCategory.error?.message;

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black flex items-center gap-2">
            <FolderOpen size={32} className="text-emerald-600" /> Product Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Organize your products — manage categories, icons, and descriptions
          </p>
        </div>
        <button
          onClick={() => setEditTarget("new")}
          disabled={isSaving}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 font-medium self-start sm:self-auto"
        >
          <Plus /> Add Category
        </button>
      </div>

      {/* ---- Stats ---- */}
      <CategoryStatsCards stats={stats} />

      {(isError || mutationError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {mutationError || error?.message || "Could not load categories."}
        </div>
      )}

      {/* ---- Search ---- */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search categories by name or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* ---- Grid ---- */}
      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
          <Loader2 className="mr-2 animate-spin text-emerald-600" size={18} />
          Loading categories...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={
            categories.length === 0
              ? "No categories created yet"
              : "No categories match your search"
          }
          description={
            categories.length === 0
              ? "Create apparel categories like Outerwear, Footwear, or Accessories to organize the catalog."
              : "Try a broader category name or clear the search field to see all categories."
          }
          action={
            categories.length === 0 ? (
              <button
                type="button"
                onClick={() => setEditTarget("new")}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Plus size={16} /> Add Category
              </button>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={(c) => setEditTarget(c)}
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

      {/* ---- Modals ---- */}
      {editTarget !== null && (
        <CategoryModal
          category={editTarget === "new" ? null : editTarget}
          isSaving={isSaving}
          onSave={(values, existingId) => {
            void handleSave(values, existingId);
          }}
          onClose={() => {
            if (!isSaving) setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          title={isDeleting ? "Deleting Category" : "Delete Category"}
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
