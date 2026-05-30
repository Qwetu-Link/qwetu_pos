import {
  Banknote,
  Boxes,
  ClipboardList,
  CreditCard,
  PackageCheck,
  Receipt,
  ShoppingCart,
  Users,
  WalletCards,
} from "lucide-react";
import type { RoleDashboardData } from "@/types/dashboard";

export type {
  DashboardAction,
  DashboardActivity,
  DashboardBar,
  DashboardMetric,
  DashboardTone,
  RoleDashboardData,
} from "@/types/dashboard";

export const dashboardData: Record<string, RoleDashboardData> = {
  owner: {
    title: "Owner Dashboard",
    eyebrow: "Executive overview",
    description: "Revenue, collections, stock health, and team performance.",
    metrics: [
      {
        label: "Revenue Today",
        value: "KES 286K",
        detail: "+12% vs yesterday",
        tone: "emerald",
        icon: Banknote,
      },
      {
        label: "Open Orders",
        value: "42",
        detail: "8 awaiting payment",
        tone: "blue",
        icon: ShoppingCart,
      },
      {
        label: "Collections Due",
        value: "KES 98K",
        detail: "11 Lipa Mdogo plans",
        tone: "amber",
        icon: WalletCards,
      },
      {
        label: "Active Customers",
        value: "306",
        detail: "+24 this month",
        tone: "violet",
        icon: Users,
      },
    ],
    actions: [
      {
        label: "Review analytics",
        href: "/admin/analytics",
        detail: "Open revenue and collection charts",
      },
      {
        label: "View reports",
        href: "/admin/reports",
        detail: "Generate executive summaries",
      },
      {
        label: "Manage settings",
        href: "/admin/settings",
        detail: "Billing, team, and business setup",
      },
    ],
    activities: [
      {
        title: "Sales target is tracking ahead",
        detail: "May revenue is at 86% of target with two days remaining.",
        time: "10 min ago",
        tone: "emerald",
      },
      {
        title: "Collections need attention",
        detail: "Four installment plans are overdue by more than 7 days.",
        time: "28 min ago",
        tone: "amber",
      },
      {
        title: "Inventory reorder created",
        detail: "Accessories reorder draft is ready for approval.",
        time: "1 hr ago",
        tone: "blue",
      },
    ],
    bars: [
      { label: "Men's Clothing", value: 82, caption: "Top sales category" },
      { label: "Accessories", value: 64, caption: "Fastest moving" },
      { label: "Footwear", value: 48, caption: "Stable demand" },
    ],
  },
  manager: {
    title: "Manager Dashboard",
    eyebrow: "Operations control",
    description: "Orders, customer service, stock tasks, and store execution.",
    metrics: [
      {
        label: "Orders Today",
        value: "76",
        detail: "14 in fulfillment",
        tone: "blue",
        icon: ClipboardList,
      },
      {
        label: "Completed Sales",
        value: "58",
        detail: "KES 214K collected",
        tone: "emerald",
        icon: Receipt,
      },
      {
        label: "Low Stock Items",
        value: "17",
        detail: "5 critical",
        tone: "red",
        icon: Boxes,
      },
      {
        label: "Customer Follow-ups",
        value: "23",
        detail: "Due before close",
        tone: "amber",
        icon: Users,
      },
    ],
    actions: [
      {
        label: "Open orders",
        href: "/admin/orders",
        detail: "Track pending and fulfilled orders",
      },
      {
        label: "Check inventory",
        href: "/admin/inventory",
        detail: "Resolve low-stock alerts",
      },
      {
        label: "Customer hub",
        href: "/admin/customers",
        detail: "Handle follow-ups and balances",
      },
    ],
    activities: [
      {
        title: "Order queue updated",
        detail: "Three paid orders moved to fulfillment.",
        time: "6 min ago",
        tone: "blue",
      },
      {
        title: "Critical stock alert",
        detail: "Classic Oxford shirts are below reorder point.",
        time: "21 min ago",
        tone: "red",
      },
      {
        title: "Customer visit scheduled",
        detail: "Grace Njeri follow-up assigned to cashier desk.",
        time: "45 min ago",
        tone: "amber",
      },
    ],
    bars: [
      { label: "Fulfillment", value: 74, caption: "Orders moving today" },
      { label: "Stock checks", value: 58, caption: "Tasks completed" },
      { label: "Follow-ups", value: 46, caption: "Customer calls done" },
    ],
  },
  cashier: {
    title: "Cashier Dashboard",
    eyebrow: "Front desk",
    description: "Sales, payments, customer lookup, and collection tasks.",
    metrics: [
      {
        label: "Cashier Sales",
        value: "KES 86K",
        detail: "24 receipts",
        tone: "emerald",
        icon: Receipt,
      },
      {
        label: "M-Pesa Payments",
        value: "31",
        detail: "2 pending match",
        tone: "blue",
        icon: CreditCard,
      },
      {
        label: "New Customers",
        value: "9",
        detail: "Captured today",
        tone: "violet",
        icon: Users,
      },
      {
        label: "Installments Taken",
        value: "KES 18K",
        detail: "7 customers",
        tone: "amber",
        icon: WalletCards,
      },
    ],
    actions: [
      {
        label: "Create order",
        href: "/admin/orders",
        detail: "Start or complete a sale",
      },
      {
        label: "Find customer",
        href: "/admin/customers",
        detail: "Open customer records",
      },
      {
        label: "Record transaction",
        href: "/admin/transactions",
        detail: "Review payments and receipts",
      },
    ],
    activities: [
      {
        title: "Payment matched",
        detail: "M-Pesa QAX123KL linked to TXN-1001.",
        time: "4 min ago",
        tone: "emerald",
      },
      {
        title: "Receipt printed",
        detail: "Cash sale CSH-2094 completed at front desk.",
        time: "12 min ago",
        tone: "blue",
      },
      {
        title: "Installment reminder",
        detail: "One walk-in collection requires customer confirmation.",
        time: "30 min ago",
        tone: "amber",
      },
    ],
    bars: [
      { label: "Cash", value: 38, caption: "Tender split" },
      { label: "M-Pesa", value: 78, caption: "Tender split" },
      { label: "Card", value: 22, caption: "Tender split" },
    ],
  },
  accountant: {
    title: "Accountant Dashboard",
    eyebrow: "Finance desk",
    description: "Payments, expenses, reconciliations, and report exports.",
    metrics: [
      {
        label: "Receipts Today",
        value: "KES 304K",
        detail: "96 transactions",
        tone: "emerald",
        icon: Banknote,
      },
      {
        label: "Expenses",
        value: "KES 42K",
        detail: "5 submitted",
        tone: "amber",
        icon: CreditCard,
      },
      {
        label: "Reconciliation",
        value: "92%",
        detail: "8 items pending",
        tone: "blue",
        icon: PackageCheck,
      },
      {
        label: "Reports Ready",
        value: "6",
        detail: "2 scheduled",
        tone: "violet",
        icon: ClipboardList,
      },
    ],
    actions: [
      {
        label: "Transactions",
        href: "/admin/transactions",
        detail: "Review sales and collections",
      },
      {
        label: "Expenses",
        href: "/admin/transactions/expenses",
        detail: "Approve or reject expense entries",
      },
      {
        label: "Reports",
        href: "/admin/reports",
        detail: "Download finance summaries",
      },
    ],
    activities: [
      {
        title: "Expense awaiting review",
        detail: "Kenya Power utility expense is pending approval.",
        time: "8 min ago",
        tone: "amber",
      },
      {
        title: "Bank transfer reconciled",
        detail: "BNK-8377 was matched to installment ledger.",
        time: "35 min ago",
        tone: "emerald",
      },
      {
        title: "Report export ready",
        detail: "Sales performance CSV is ready for download.",
        time: "1 hr ago",
        tone: "blue",
      },
    ],
    bars: [
      { label: "M-Pesa", value: 86, caption: "Matched receipts" },
      { label: "Bank", value: 72, caption: "Matched receipts" },
      { label: "Cash", value: 54, caption: "Counted receipts" },
    ],
  },
  inventory: {
    title: "Inventory Dashboard",
    eyebrow: "Stock control",
    description: "Stock alerts, product movement, variants, and reorder tasks.",
    metrics: [
      {
        label: "Stock Value",
        value: "KES 3.8M",
        detail: "Across 248 SKUs",
        tone: "emerald",
        icon: Boxes,
      },
      {
        label: "Low Stock",
        value: "17",
        detail: "5 critical",
        tone: "red",
        icon: PackageCheck,
      },
      {
        label: "Variants Active",
        value: "142",
        detail: "9 added this week",
        tone: "blue",
        icon: ClipboardList,
      },
      {
        label: "Stock Adjustments",
        value: "12",
        detail: "Needs audit",
        tone: "amber",
        icon: Receipt,
      },
    ],
    actions: [
      {
        label: "Inventory",
        href: "/admin/inventory",
        detail: "Open stock intelligence",
      },
      {
        label: "Products",
        href: "/admin/products",
        detail: "Manage product catalog",
      },
      {
        label: "Variants",
        href: "/admin/variants",
        detail: "Review product variants",
      },
    ],
    activities: [
      {
        title: "Low stock threshold crossed",
        detail: "Leather sneakers require reorder approval.",
        time: "9 min ago",
        tone: "red",
      },
      {
        title: "Stock count completed",
        detail: "Men's clothing count variance is within tolerance.",
        time: "24 min ago",
        tone: "emerald",
      },
      {
        title: "Variant update",
        detail: "Denim jacket size variants were refreshed.",
        time: "53 min ago",
        tone: "blue",
      },
    ],
    bars: [
      { label: "Men's Clothing", value: 69, caption: "Stock coverage" },
      { label: "Accessories", value: 42, caption: "Stock coverage" },
      { label: "Footwear", value: 76, caption: "Stock coverage" },
    ],
  },
};
