"use client";

import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { InventoryItem, StockAdjustmentReason } from "@/types/admin/inventory";
import { DEMO_INVENTORY, filterItems, recalcTotalStock } from "@/utils/inventory-utils";
import { useOfflineMutation } from "./useOfflineMutation";

function getInitialItems(sourceItems?: InventoryItem[]): InventoryItem[] {
  const items = sourceItems ?? DEMO_INVENTORY;

  return items.map((item) => recalcTotalStock(structuredClone(item)));
}

export function useInventory(sourceItems?: InventoryItem[]) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const items = useMemo(() => getInitialItems(sourceItems), [sourceItems]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(
    () => filterItems(items, search, location),
    [items, search, location]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visiblePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (visiblePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, visiblePage, perPage]);

  const updateSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const updateLocation = useCallback((value: string) => {
    setLocation(value);
    setCurrentPage(1);
  }, []);

  const adjustStockMutation = useOfflineMutation(
    trpc.inventory.adjustStock.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.products.pathFilter());
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
      },
    }),
    { procedure: "inventory.adjustStock", label: "Adjust stock" },
  );

  const transferStockMutation = useOfflineMutation(
    trpc.inventory.transferStock.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.products.pathFilter());
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
      },
    }),
    { procedure: "inventory.transferStock", label: "Transfer stock" },
  );

  const createPurchaseOrderMutation = useOfflineMutation(
    trpc.inventory.createPurchaseOrder.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.products.pathFilter());
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
      },
    }),
    { procedure: "inventory.createPurchaseOrder", label: "Create purchase order" },
  );

  const receivePurchaseOrderMutation = useOfflineMutation(
    trpc.inventory.receivePurchaseOrder.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.products.pathFilter());
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
      },
    }),
    { procedure: "inventory.receivePurchaseOrder", label: "Receive purchase order" },
  );

  const adjustStock = useCallback(
    async (
      variantId: string,
      locationName: string,
      quantityToAdd: number,
      reason: StockAdjustmentReason,
      notes?: string,
    ) => {
      await adjustStockMutation.mutateAsync({
        variantId,
        location: locationName as "Main Store" | "Warehouse A" | "Outlet",
        quantity: quantityToAdd,
        reason,
        notes,
      });
    },
    [adjustStockMutation]
  );

  const createPurchaseOrder = useCallback(
    async (variantId: string, supplierName: string, quantity: number, notes?: string) => {
      await createPurchaseOrderMutation.mutateAsync({
        variantId,
        supplierName,
        quantity,
        notes,
      });
    },
    [createPurchaseOrderMutation]
  );

  const transferStock = useCallback(
    async (variantId: string, fromLoc: string, toLoc: string, qty: number): Promise<boolean> => {
      await transferStockMutation.mutateAsync({
        variantId,
        from: fromLoc as "Main Store" | "Warehouse A" | "Outlet",
        to: toLoc as "Main Store" | "Warehouse A" | "Outlet",
        quantity: qty,
      });

      return true;
    },
    [transferStockMutation]
  );

  return {
    items,
    filtered,
    paginated,
    search,
    setSearch: updateSearch,
    location,
    setLocation: updateLocation,
    currentPage: visiblePage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPages,
    adjustStock,
    createPurchaseOrder,
    transferStock,
    isAdjusting: adjustStockMutation.isPending,
    isCreatingPurchaseOrder: createPurchaseOrderMutation.isPending,
    isReceivingPurchaseOrder: receivePurchaseOrderMutation.isPending,
    receivePurchaseOrder: receivePurchaseOrderMutation.mutateAsync,
    isTransferring: transferStockMutation.isPending,
  };
}

export function usePurchaseOrders() {
  const trpc = useTRPC();
  const query = useQuery(trpc.inventory.getPurchaseOrders.queryOptions());

  return {
    ...query,
    purchaseOrders: query.data ?? [],
  };
}

export function useAdjustmentLogs(variantId?: string) {
  const trpc = useTRPC();
  const query = useQuery(
    variantId
      ? trpc.inventory.getVariantAdjustmentLogs.queryOptions({ variantId })
      : trpc.inventory.getAdjustmentLogs.queryOptions(),
  );

  return {
    ...query,
    logs: query.data ?? [],
  };
}
