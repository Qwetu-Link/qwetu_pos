"use client";

import { useState } from "react";
import { Boxes, PackageOpen } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { useInventory } from "@/hooks/useInventory";
import type { InventoryItem } from "@/types/inventory";
import { StatsRow } from "./StatsRow";
import { FilterBar } from "./FilterBar";
import { InventoryCard } from "./InventoryCard";
import { Pagination } from "@/components/common/Pagination";
import { AdjustModal } from "./AdjustModal";
import { TransferModal } from "./TransferModal";
import { computeStats } from "@/utils/inventory-utils";

export function InventoryIntelligence() {
  const {
    items,
    filtered,
    paginated,
    search,
    setSearch,
    location,
    setLocation,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPages,
    adjustStock,
    transferStock,
  } = useInventory();

  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [transferItem, setTransferItem] = useState<InventoryItem | null>(null);

  const stats = computeStats(items);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-black flex items-center gap-2">
            <Boxes size={28} className="text-emerald-600" />
            Inventory Intelligence
          </h1>
          <p className="text-slate-500 mt-1">
            Multi-location visibility · Real-time stock health &amp; reorder triggers
          </p>
        </div>

        {/* Stats */}
        <StatsRow stats={stats} />

        {/* Filters */}
        <FilterBar
          search={search}
          location={location}
          onSearchChange={setSearch}
          onLocationChange={setLocation}
        />

        {/* Cards */}
        {paginated.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title={
              items.length === 0
                ? "No inventory items yet"
                : "No inventory items match this view"
            }
            description={
              items.length === 0
                ? "Once products and variants are available from the backend, stock records will appear here."
                : "Try a different search term or switch the location filter back to all locations."
            }
          />
        ) : (
          <div className="space-y-5">
            {paginated.map((item) => (
              <InventoryCard
                key={item.sku}
                item={item}
                onAdjust={setAdjustItem}
                onTransfer={setTransferItem}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={filtered.length}
            perPage={perPage}
            onPage={setCurrentPage}
            onPerPage={(v) => { setPerPage(v); setCurrentPage(1); }}
          />
        )}
      </div>

      {/* Modals */}
      {adjustItem && (
        <AdjustModal
          key={adjustItem.sku}
          item={adjustItem}
          onClose={() => setAdjustItem(null)}
          onConfirm={(sku, loc, qty) => {
            adjustStock(sku, loc, qty);
            setAdjustItem(null);
          }}
        />
      )}
      {transferItem && (
        <TransferModal
          key={transferItem.sku}
          item={transferItem}
          onClose={() => setTransferItem(null)}
          onConfirm={(sku, from, to, qty) => transferStock(sku, from, to, qty)}
        />
      )}
    </div>
  );
}
