"use client";

import { useState, useMemo } from "react";
import type { Category, CategoryFormValues } from "@/types/categories";
import { dummyCategories } from "@/data/categories";
import {
  computeCategoryStats,
  addCategory,
  updateCategory,
  deleteCategory,
  filterCategories,
} from "@/lib/category-utils";
import CategoryStatsCards from "./CategoryStatsCards";
import CategoryCard from "./CategoryCard";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { FolderOpen, Plus, Search } from "lucide-react";

export default function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [search, setSearch] = useState("");

  // Modal state: null = closed, null-value = add mode, Category = edit mode
  const [editTarget, setEditTarget] = useState<Category | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const filtered = useMemo(
    () => filterCategories(categories, search),
    [categories, search],
  );

  const stats = useMemo(() => computeCategoryStats(categories), [categories]);

  // ---- Handlers ----

  function handleSave(values: CategoryFormValues, existingId?: number) {
    if (existingId !== undefined) {
      setCategories((prev) => updateCategory(prev, existingId, values));
    } else {
      setCategories((prev) => addCategory(prev, values));
    }
    setEditTarget(null);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setCategories((prev) => deleteCategory(prev, deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FolderOpen size={32} className="text-green-600" /> Product Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Organize your products — manage categories, icons, and descriptions
          </p>
        </div>
        <button
          onClick={() => setEditTarget("new")}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 font-medium self-start sm:self-auto"
        >
          <Plus/> Add Category
        </button>
      </div>

      {/* ---- Stats ---- */}
      <CategoryStatsCards stats={stats} />

      {/* ---- Search ---- */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* ---- Grid ---- */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border text-gray-400">
          <p className="text-5xl mb-3"><FolderOpen size={64} className="text-gray-300" /></p>
          <p className="text-lg font-medium text-gray-500">
            No categories found
          </p>
          <p className="text-sm mt-1">
            {search
              ? "Try adjusting your search"
              : 'Click "Add Category" to create one'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={(c) => setEditTarget(c)}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
            />
          ))}
        </div>
      )}

      {/* ---- Modals ---- */}
      {editTarget !== null && (
        <CategoryModal
          category={editTarget === "new" ? null : editTarget}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteCategoryModal
          categoryName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
