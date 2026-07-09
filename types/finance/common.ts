import type { ComponentType } from "react";

export type FinanceIcon = ComponentType<{ className?: string; size?: number }>;

export interface FinanceMetric {
  label: string;
  value: string;
  helper: string;
  icon?: FinanceIcon;
}

export interface FinanceStatusStyle<TStatus extends string = string> {
  status: TStatus;
}

export interface FinanceSummaryItem {
  label: string;
  value: number;
  count: number;
  icon: FinanceIcon;
}

export interface FinanceChartPayloadItem {
  name: string;
  value: number;
  stroke?: string;
  fill?: string;
}

export interface FinanceChartTooltipProps {
  active?: boolean;
  payload?: FinanceChartPayloadItem[];
  label?: string;
}
