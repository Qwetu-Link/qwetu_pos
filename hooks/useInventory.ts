"use client";

import { useState, useCallback, useMemo } from "react";
import type { InventoryItem } from "@/types/inventory";
import { DEMO_INVENTORY, filterItems, recalcTotalStock } from "@/lib/inventory-utils";

function getInitialItems(): InventoryItem[] {
  return DEMO_INVENTORY.map((item) => recalcTotalStock(structuredClone(item)));
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(getInitialItems);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const updateItems = useCallback((updated: InventoryItem[]) => {
    setItems(updated);
  }, []);

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
      const updated = items.map((item) => {
        if (item.sku !== sku) return item;
        const clone = structuredClone(item);
        const loc = clone.inventory.locations.find((l) => l.name === locationName);
        if (loc) loc.stock = newAbsoluteQty;
        return recalcTotalStock(clone);
      });
      updateItems(updated);
    },
    [items, updateItems]
  );

  // Transfer stock between locations
  const transferStock = useCallback(
    (sku: string, fromLoc: string, toLoc: string, qty: number): boolean => {
      const item = items.find((i) => i.sku === sku);
      if (!item) return false;
      const from = item.inventory.locations.find((l) => l.name === fromLoc);
      if (!from || from.stock < qty) return false;

      const updated = items.map((i) => {
        if (i.sku !== sku) return i;
        const clone = structuredClone(i);
        const f = clone.inventory.locations.find((l) => l.name === fromLoc)!;
        const t = clone.inventory.locations.find((l) => l.name === toLoc)!;
        f.stock -= qty;
        t.stock += qty;
        return recalcTotalStock(clone);
      });
      updateItems(updated);
      return true;
    },
    [items, updateItems]
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
