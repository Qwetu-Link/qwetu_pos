"use client";

import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { InventoryItem } from "@/types/inventory";
import { DEMO_INVENTORY, filterItems, recalcTotalStock } from "@/utils/inventory-utils";

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

  const adjustStockMutation = useMutation(
    trpc.inventory.adjustStock.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.products.pathFilter());
      },
    })
  );

  const transferStockMutation = useMutation(
    trpc.inventory.transferStock.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.products.pathFilter());
      },
    })
  );

  const adjustStock = useCallback(
    async (variantId: string, locationName: string, newAbsoluteQty: number) => {
      await adjustStockMutation.mutateAsync({
        variantId,
        location: locationName as "Main Store" | "Warehouse A" | "Outlet",
        quantity: newAbsoluteQty,
      });
    },
    [adjustStockMutation]
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
    transferStock,
    isAdjusting: adjustStockMutation.isPending,
    isTransferring: transferStockMutation.isPending,
  };
}
