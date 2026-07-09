import type { FinanceIcon } from "./common";

export interface FinanceNavItem {
  section: string;
  label: string;
  icon: FinanceIcon;
  href: string;
}

export interface FinanceSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export interface FinanceTopNavProps {
  onMenuClick: () => void;
}
