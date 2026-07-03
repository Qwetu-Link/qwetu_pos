"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Boxes,
  Layers,
  CheckCircle2,
  XCircle,
  Percent,
  Search,
  PackageOpen,
} from "lucide-react";
import { dummyProducts } from "@/data/products";
import EmptyState from "@/components/common/EmptyState";
import { computeStats, flattenVariants } from "@/utils/variant-utils";
import StatCard from "./StatCard";
import VariantCard from "./VariantCard";
import Pagination from "@/components/common/Pagination";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";


export default function ProductVariantsPage() {
  const products = dummyProducts;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [editSku, setEditSku] = useState<string | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [deleteSku, setDeleteSku] = useState<string | null>(null);

  const inventoryItems = useMemo(() => flattenVariants(products), [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return inventoryItems;

    return inventoryItems.filter(
      (item) =>
        item.productName.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term)
    );
  }, [inventoryItems, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const visiblePage = Math.min(currentPage, totalPages);

  const paginated = filtered.slice(
    (visiblePage - 1) * perPage,
    visiblePage * perPage
  );

  const stats = useMemo(() => computeStats(inventoryItems), [inventoryItems]);

  const editProduct = useMemo(
    () => products.find((product) => product.id === editProductId) ?? null,
    [products, editProductId]
  );

  const editVariant = useMemo(
    () => editProduct?.variants.find((variant) => variant.sku === editSku) ?? null,
    [editProduct, editSku]
  );

  const handleOpenEdit = useCallback((sku: string, productId: string) => {
    setEditSku(sku);
    setEditProductId(productId);
  }, []);

  const handleSaveEdit = useCallback(
    (data: {
      color: string;
      size: string;
      buyPrice: number;
      sellPrice: number;
      reorderPoint: number;
    }) => {
      void data;
      setEditSku(null);
      setEditProductId(null);
    },
    []
  );

  const handleConfirmDelete = useCallback(() => {
    setDeleteSku(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black flex items-center gap-2">
            <Boxes size={28} className="text-emerald-600" />
            Product Variants
          </h1>

          <p className="text-slate-500 mt-1">
            Created to cater to different customer preferences
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Layers}
            label="Total Variants"
            value={stats.totalVariants}
            iconCls="text-blue-600"
          />
          <StatCard
            icon={CheckCircle2}
            label="Active Variants"
            value={stats.activeVariants}
            iconCls="text-emerald-600"
          />
          <StatCard
            icon={XCircle}
            label="Dead Variants"
            value={stats.deadVariants}
            iconCls="text-red-600"
          />
          <StatCard
            icon={Percent}
            label="Gross Profit Margin"
            value={`${stats.grossProfitMargin}%`}
            iconCls="text-purple-600"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-black placeholder:text-gray-500"
            />
          </div>
        </div>

        {paginated.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title={
              inventoryItems.length === 0
                ? "No product variants yet"
                : "No variants match your search"
            }
            description={
              inventoryItems.length === 0
                ? "Add product variants with size, color, and SKU details so they can appear in stock and sales flows."
                : "Try searching by a different product name or SKU."
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map((item) => (
              <VariantCard
                key={item.sku}
                item={item}
                onEdit={handleOpenEdit}
                onDelete={setDeleteSku}
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
      </div>

      {editVariant && editProduct && (
        <EditModal
          key={editVariant.sku}
          isOpen={!!editSku}
          onClose={() => {
            setEditSku(null);
            setEditProductId(null);
          }}
          variant={editVariant}
          product={editProduct}
          onSave={handleSaveEdit}
        />
      )}

      <DeleteModal
        isOpen={!!deleteSku}
        sku={deleteSku ?? undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteSku(null)}
      />
    </div>
  );
}
