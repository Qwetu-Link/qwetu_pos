"use client";

import { useState, useCallback, useMemo } from "react";
import type { InventoryItem } from "@/types/inventory";
import { DEMO_INVENTORY, filterItems, recalcTotalStock } from "@/utils/inventory-utils";

function getInitialItems(): InventoryItem[] {
  return DEMO_INVENTORY.map((item) => recalcTotalStock(structuredClone(item)));
}

export function useInventory() {
  const items = useMemo(() => getInitialItems(), []);
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

  // Adjust stock (absolute value for a location)
  const adjustStock = useCallback(
    (sku: string, locationName: string, newAbsoluteQty: number) => {
      void sku;
      void locationName;
      void newAbsoluteQty;
      // Laravel API will own stock adjustments.
    },
    []
  );

  // Transfer stock between locations
  const transferStock = useCallback(
    (sku: string, fromLoc: string, toLoc: string, qty: number): boolean => {
      void sku;
      void fromLoc;
      void toLoc;
      void qty;
      return true;
    },
    []
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
  };
}
