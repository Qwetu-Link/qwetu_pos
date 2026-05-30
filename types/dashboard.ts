import type { LucideIcon } from "lucide-react";

export type DashboardTone =
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "red"
  | "slate";

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  tone: DashboardTone;
  icon: LucideIcon;
}

export interface DashboardAction {
  label: string;
  href: string;
  detail: string;
}

export interface DashboardActivity {
  title: string;
  detail: string;
  time: string;
  tone: DashboardTone;
}

export interface DashboardBar {
  label: string;
  value: number;
  caption: string;
}

export interface RoleDashboardData {
  title: string;
  eyebrow: string;
  description: string;
  metrics: DashboardMetric[];
  actions: DashboardAction[];
  activities: DashboardActivity[];
  bars: DashboardBar[];
}

