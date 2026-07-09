import type { ReactNode } from "react";
import type { FinanceIcon } from "./common";

export interface FinancePageLayoutProps {
  title: string;
  subtitle?: string;
  icon?: FinanceIcon;
  actions?: ReactNode;
  children: ReactNode;
}

export interface FinancePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}
