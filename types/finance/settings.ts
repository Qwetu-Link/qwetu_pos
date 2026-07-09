import type { FinanceIcon } from "./common";

export interface FinanceSettingsSection {
  title: string;
  description: string;
  icon: FinanceIcon;
  items: string[];
}
