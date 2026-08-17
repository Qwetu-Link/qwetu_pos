"use client";

import {
  Banknote,
  Boxes,
  ClipboardList,
  CreditCard,
  PackageCheck,
  Receipt,
  ShoppingCart,
  TriangleAlert,
  Users,
  WalletCards,
} from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { DashboardSkeleton } from "@/components/skeletons";
import { dashboardData } from "@/data/dashboard-data";
import { formatCurrency } from "@/data/transaction-data";
import { useDashboardSummary } from "@/hooks/useDashboard";
import type { RoleDashboardData } from "@/types/dashboard";
import type { DashboardRoleKey, DashboardSummary } from "@/types/dashboard-live";
import RoleDashboard from "./RoleDashboard";

const primaryQuickActions = [
  {
    label: "Create order",
    href: "/admin/orders/add",
    detail: "Start a new customer order",
  },
  {
    label: "New customer",
    href: "/admin/customers",
    detail: "Add or manage customer records",
  },
];

function formatCount(value: number) {
  return value.toLocaleString();
}

function withPrimaryQuickActions(base: RoleDashboardData): RoleDashboardData {
  const existingHrefs = new Set(base.actions.map((action) => action.href));

  return {
    ...base,
    actions: [
      ...primaryQuickActions.filter((action) => !existingHrefs.has(action.href)),
      ...base.actions,
    ],
  };
}

function buildDashboard(role: DashboardRoleKey, summary: DashboardSummary): RoleDashboardData {
  const base = withPrimaryQuickActions(dashboardData[role]);
  const sharedActivities = summary.activities;

  if (role === "manager") {
    return {
      ...base,
      metrics: [
        {
          label: "Orders Today",
          value: formatCount(summary.ordersToday),
          detail: `${summary.openOrders} open orders`,
          tone: "blue",
          icon: ClipboardList,
        },
        {
          label: "Completed Sales",
          value: formatCount(summary.completedSalesToday),
          detail: `${formatCurrency(summary.revenueToday)} collected today`,
          tone: "emerald",
          icon: Receipt,
        },
        {
          label: "Low Stock Items",
          value: formatCount(summary.lowStock),
          detail: `${summary.criticalStock} critical`,
          tone: summary.criticalStock > 0 ? "red" : "amber",
          icon: Boxes,
        },
        {
          label: "Customer Follow-ups",
          value: formatCount(summary.awaitingPayment),
          detail: "Orders awaiting payment",
          tone: "amber",
          icon: Users,
        },
      ],
      activities: sharedActivities,
      bars: summary.orderBars,
    };
  }

  if (role === "cashier") {
    return {
      ...base,
      metrics: [
        {
          label: "Cashier Sales",
          value: formatCurrency(summary.revenueToday),
          detail: `${summary.receiptsTodayCount} receipts today`,
          tone: "emerald",
          icon: Receipt,
        },
        {
          label: "Payments Today",
          value: formatCount(summary.receiptsTodayCount),
          detail: `${formatCurrency(summary.receiptsToday)} received`,
          tone: "blue",
          icon: CreditCard,
        },
        {
          label: "New Customers",
          value: formatCount(summary.newCustomersMonth),
          detail: "Captured this month",
          tone: "violet",
          icon: Users,
        },
        {
          label: "Installments Taken",
          value: formatCurrency(summary.installmentsToday),
          detail: `${summary.activePlans} active plans`,
          tone: "amber",
          icon: WalletCards,
        },
      ],
      activities: sharedActivities,
      bars: summary.paymentBars,
    };
  }

  if (role === "accountant") {
    return {
      ...base,
      metrics: [
        {
          label: "Receipts Today",
          value: formatCurrency(summary.receiptsToday),
          detail: `${summary.receiptsTodayCount} transactions`,
          tone: "emerald",
          icon: Banknote,
        },
        {
          label: "Expenses",
          value: formatCurrency(summary.expensesMonth),
          detail: `${summary.pendingExpenses} pending review`,
          tone: "amber",
          icon: CreditCard,
        },
        {
          label: "Reconciliation",
          value: formatCount(summary.pendingReconciliation),
          detail: "Items pending attention",
          tone: summary.pendingReconciliation > 0 ? "blue" : "emerald",
          icon: PackageCheck,
        },
        {
          label: "Reports Ready",
          value: formatCount(summary.reportsReady),
          detail: "Based on current activity",
          tone: "violet",
          icon: ClipboardList,
        },
      ],
      activities: sharedActivities,
      bars: summary.paymentBars,
    };
  }

  if (role === "inventory") {
    return {
      ...base,
      metrics: [
        {
          label: "Stock Value",
          value: formatCurrency(summary.stockValue),
          detail: `Across ${summary.variants} variants`,
          tone: "emerald",
          icon: Boxes,
        },
        {
          label: "Low Stock",
          value: formatCount(summary.lowStock),
          detail: `${summary.criticalStock} critical`,
          tone: summary.criticalStock > 0 ? "red" : "amber",
          icon: PackageCheck,
        },
        {
          label: "Variants Active",
          value: formatCount(summary.variants),
          detail: `${summary.products} products`,
          tone: "blue",
          icon: ClipboardList,
        },
        {
          label: "Stock Adjustments",
          value: formatCount(summary.pendingExpenses),
          detail: "Inventory purchases pending",
          tone: "amber",
          icon: Receipt,
        },
      ],
      activities: sharedActivities,
      bars: summary.stockBars,
    };
  }

  return {
    ...base,
    metrics: [
      {
        label: "Revenue Today",
        value: formatCurrency(summary.revenueToday),
        detail: `${formatCurrency(summary.revenueMonth)} this month`,
        tone: "emerald",
        icon: Banknote,
      },
      {
        label: "Open Orders",
        value: formatCount(summary.openOrders),
        detail: `${summary.awaitingPayment} awaiting payment`,
        tone: "blue",
        icon: ShoppingCart,
      },
      {
        label: "Outstanding arrears",
        value: formatCurrency(summary.collectionsDue),
        detail: `${summary.activePlans} active Lipa Mdogo plans`,
        tone: "amber",
        icon: TriangleAlert,
      },
      {
        label: "Collected this month",
        value: formatCurrency(summary.collectedThisMonth),
        detail: `${summary.receiptsTodayCount} receipts today`,
        tone: "violet",
        icon: WalletCards,
      },
    ],
    activities: sharedActivities,
    bars: summary.paymentBars,
  };
}

export default function LiveRoleDashboard({ role }: { role: DashboardRoleKey }) {
  const { summary, isLoading, isError, error } = useDashboardSummary();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !summary) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          icon={Banknote}
          title="Dashboard data unavailable"
          description={error?.message ?? "Could not load live dashboard data."}
        />
      </div>
    );
  }

  return <RoleDashboard dashboard={buildDashboard(role, summary)} summary={summary} />;
}
