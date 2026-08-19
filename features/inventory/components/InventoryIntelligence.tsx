"use client";

import { useMemo, useState } from "react";
import { Boxes, ClipboardList, History, PackageOpen, ShoppingCart } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { InventoryCardsSkeleton } from "@/components/skeletons";
import { SimpleDataTable } from "@/components/datatables";
import { useAdjustmentLogs, useInventory, usePurchaseOrders } from "@/hooks/useInventory";
import { useGetProducts } from "@/hooks/useProduct";
import type { InventoryItem, StockAdjustmentReason } from "@/types/admin/inventory";
import { StatsRow } from "./StatsRow";
import { FilterBar } from "./FilterBar";
import { InventoryCard } from "./InventoryCard";
import { Pagination } from "@/components/common/Pagination";
import { AdjustModal } from "../../forms/AdjustModal";
import { TransferModal } from "../../forms/TransferModal";
import { GeneratePurchaseOrderModal } from "../../forms/GeneratePurchaseOrderModal";
import { computeStats, mapProductsToInventoryItems } from "@/utils/inventory-utils";

const reasonLabels: Record<StockAdjustmentReason, string> = {
  restock: "Restock",
  damaged_goods: "Damaged Goods",
  theft_shrinkage: "Theft/Shrinkage",
  return: "Return",
  physical_count_audit: "Physical Count Audit",
  correction: "Correction",
};

export function InventoryIntelligence() {
  const { products, isLoading, isError, error } = useGetProducts();
  const { purchaseOrders, isLoading: isLoadingPurchaseOrders } = usePurchaseOrders();
  const { logs, isLoading: isLoadingLogs } = useAdjustmentLogs();
  const inventoryItems = useMemo(
    () => mapProductsToInventoryItems(products),
    [products]
  );
  const [activeTab, setActiveTab] = useState<"stock" | "purchase-orders" | "audit-log">("stock");

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
    createPurchaseOrder,
    receivePurchaseOrder,
    transferStock,
    isAdjusting,
    isCreatingPurchaseOrder,
    isReceivingPurchaseOrder,
    isTransferring,
  } = useInventory(inventoryItems);

  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [transferItem, setTransferItem] = useState<InventoryItem | null>(null);
  const [purchaseOrderItem, setPurchaseOrderItem] = useState<InventoryItem | null>(null);
  const [actionError, setActionError] = useState("");

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

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {[
            { id: "stock", label: "Stock Intelligence", Icon: ClipboardList },
            { id: "purchase-orders", label: "Purchase Orders", Icon: ShoppingCart },
            { id: "audit-log", label: "Adjustment Audit Log", Icon: History },
          ].map(({ id, label, Icon }) => {
            const isActive = activeTab === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error?.message || "Could not load inventory from the database."}
          </div>
        )}

        {actionError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        ) : null}

        {activeTab === "stock" ? (
          <>
            <FilterBar
              search={search}
              location={location}
              onSearchChange={setSearch}
              onLocationChange={setLocation}
            />

            {isLoading ? (
              <InventoryCardsSkeleton count={5} />
            ) : paginated.length === 0 ? (
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
                    onGeneratePO={setPurchaseOrderItem}
                  />
                ))}
              </div>
            )}

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
          </>
        ) : activeTab === "purchase-orders" ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Purchase Orders</h2>
              <p className="text-sm text-slate-500">Draft and incoming stock orders generated from reorder triggers.</p>
            </div>
            <SimpleDataTable
              minWidth="min-w-[980px]"
              emptyMessage={isLoadingPurchaseOrders ? "Loading purchase orders..." : "No purchase orders generated yet."}
              headers={[
                "PO No.",
                "Supplier",
                "Items",
                "Qty",
                "Status",
                "Created",
                "Staff",
                { label: "Action", className: "text-right" },
              ]}
              rows={
                isLoadingPurchaseOrders
                  ? []
                  : purchaseOrders.map((order) => {
                      const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

                      return {
                        id: order.id,
                        cells: [
                          <span key="po" className="whitespace-nowrap font-mono font-semibold text-slate-900">{order.poNumber}</span>,
                          <span key="supplier" className="whitespace-nowrap">{order.supplierName}</span>,
                          <span key="items" className="block min-w-64">
                            {order.items.map((item) => `${item.productName} ${item.color} ${item.size} (${item.sku})`).join(", ")}
                          </span>,
                          <span key="qty" className="whitespace-nowrap font-bold text-slate-900">{totalQty}</span>,
                          <span key="status" className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold capitalize text-amber-700">
                            {order.status}
                          </span>,
                          <span key="created" className="whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</span>,
                          <span key="staff" className="whitespace-nowrap">{order.createdByName}</span>,
                          <div key="action" className="whitespace-nowrap text-right">
                            <button
                              type="button"
                              disabled={order.status === "received" || isReceivingPurchaseOrder}
                              onClick={async () => {
                                setActionError("");
                                try {
                                  await receivePurchaseOrder({ id: order.id });
                                } catch (error) {
                                  setActionError(
                                    error instanceof Error
                                      ? error.message
                                      : "Could not receive this purchase order.",
                                  );
                                }
                              }}
                              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                            >
                              {order.status === "received" ? "Received" : "Mark Received"}
                            </button>
                          </div>,
                        ],
                      };
                    })
              }
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Stock Adjustment Audit Log</h2>
              <p className="text-sm text-slate-500">Every manual stock overwrite with staff, delta, reason, and notes.</p>
            </div>
            <SimpleDataTable
              minWidth="min-w-[980px]"
              emptyMessage={isLoadingLogs ? "Loading adjustment logs..." : "No stock adjustments have been recorded yet."}
              headers={["Date & Time", "SKU", "Location", "Staff", "Change", "Reason", "Notes"]}
              rows={
                isLoadingLogs
                  ? []
                  : logs.map((log) => ({
                      id: log.id,
                      cells: [
                        <span key="date" className="whitespace-nowrap">{new Date(log.adjustedAt).toLocaleString()}</span>,
                        <div key="sku" className="min-w-60">
                          <p className="font-semibold text-slate-900">{log.productName}</p>
                          <p className="font-mono text-xs text-slate-400">{log.sku} · {log.color} {log.size}</p>
                        </div>,
                        <span key="location" className="whitespace-nowrap">{log.locationName}</span>,
                        <span key="staff" className="whitespace-nowrap">{log.staffName}</span>,
                        <span
                          key="change"
                          className={`whitespace-nowrap font-bold ${log.quantityChanged >= 0 ? "text-emerald-700" : "text-red-600"}`}
                        >
                          {log.quantityChanged >= 0 ? "+" : ""}
                          {log.quantityChanged}
                          <span className="ml-2 text-xs font-medium text-slate-400">
                            {log.previousQuantity} → {log.newQuantity}
                          </span>
                        </span>,
                        <span key="reason" className="whitespace-nowrap">{reasonLabels[log.reason]}</span>,
                        <span key="notes" className="block min-w-64">{log.notes || "-"}</span>,
                      ],
                    }))
              }
            /></div>
        )}
      </div>

      {/* Modals */}
      {adjustItem && (
        <AdjustModal
          key={adjustItem.sku}
          item={adjustItem}
          isApplying={isAdjusting}
          onClose={() => setAdjustItem(null)}
          onConfirm={async (variantId, loc, qty, reason, notes) => {
            setActionError("");
            try {
              await adjustStock(variantId, loc, qty, reason, notes);
              setAdjustItem(null);
            } catch (error) {
              setActionError(
                error instanceof Error ? error.message : "Could not adjust stock.",
              );
              throw error;
            }
          }}
        />
      )}
      {purchaseOrderItem && (
        <GeneratePurchaseOrderModal
          key={purchaseOrderItem.sku}
          item={purchaseOrderItem}
          isCreating={isCreatingPurchaseOrder}
          onClose={() => setPurchaseOrderItem(null)}
          onConfirm={async (variantId, supplierName, quantity, notes) => {
            setActionError("");
            try {
              await createPurchaseOrder(variantId, supplierName, quantity, notes);
              setPurchaseOrderItem(null);
              setActiveTab("purchase-orders");
            } catch (error) {
              setActionError(
                error instanceof Error
                  ? error.message
                  : "Could not generate this purchase order.",
              );
              throw error;
            }
          }}
        />
      )}
      {transferItem && (
        <TransferModal
          key={transferItem.sku}
          item={transferItem}
          isTransferring={isTransferring}
          onClose={() => setTransferItem(null)}
          onConfirm={async (variantId, from, to, qty) => {
            setActionError("");
            try {
              await transferStock(variantId, from, to, qty);
              setTransferItem(null);
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Could not transfer stock.";
              setActionError(message);
              throw new Error(message);
            }
          }}
        />
      )}
    </div>
  );
}
