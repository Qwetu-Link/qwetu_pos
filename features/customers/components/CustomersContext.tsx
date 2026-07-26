"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCustomers } from "@/hooks/useCustomers";

type CustomersContextType = ReturnType<typeof useCustomers>;

const CustomersContext = createContext<CustomersContextType | null>(null);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const value = useCustomers();
  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomersContext(): CustomersContextType {
  const ctx = useContext(CustomersContext);
  if (!ctx) throw new Error("useCustomersContext must be used inside <CustomersProvider>");
  return ctx;
}
