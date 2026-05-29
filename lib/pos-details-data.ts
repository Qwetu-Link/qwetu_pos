export { formatCompactCurrency, formatCurrency } from "@/lib/formatters";

export type RevenueMonth = {
  month: string;
  fullPayments: number;
  installments: number;
};

export type CategoryMetric = {
  name: string;
  value: number;
  color: string;
};

export type SegmentMetric = {
  segment: string;
  customers: number;
  revenue: number;
};

export type PaymentMethodMetric = {
  method: string;
  transactions: number;
  amount: number;
};

export type RolePermission = {
  key: string;
  label: string;
};

export type BusinessRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export const revenueData: RevenueMonth[] = [
  { month: "Dec 25", fullPayments: 480000, installments: 130000 },
  { month: "Jan 26", fullPayments: 530000, installments: 155000 },
  { month: "Feb 26", fullPayments: 610000, installments: 190000 },
  { month: "Mar 26", fullPayments: 585000, installments: 210000 },
  { month: "Apr 26", fullPayments: 720000, installments: 260000 },
  { month: "May 26", fullPayments: 775000, installments: 310000 },
];

export const previousRevenueData: RevenueMonth[] = [
  { month: "Jun 25", fullPayments: 360000, installments: 90000 },
  { month: "Jul 25", fullPayments: 420000, installments: 97000 },
  { month: "Aug 25", fullPayments: 390000, installments: 110000 },
  { month: "Sep 25", fullPayments: 445000, installments: 120000 },
  { month: "Oct 25", fullPayments: 465000, installments: 128000 },
  { month: "Nov 25", fullPayments: 500000, installments: 135000 },
];

export const categoryData: CategoryMetric[] = [
  { name: "Phones", value: 1420000, color: "#2563eb" },
  { name: "Laptops", value: 980000, color: "#7c3aed" },
  { name: "Accessories", value: 520000, color: "#db2777" },
  { name: "TVs", value: 740000, color: "#d97706" },
  { name: "Home Appliances", value: 430000, color: "#059669" },
];

export const customerSegmentData: SegmentMetric[] = [
  { segment: "VIP", customers: 42, revenue: 1180000 },
  { segment: "Regular", customers: 168, revenue: 2050000 },
  { segment: "New", customers: 96, revenue: 860000 },
];

export const paymentMethodData: PaymentMethodMetric[] = [
  { method: "M-Pesa", transactions: 1230, amount: 2860000 },
  { method: "Cash", transactions: 312, amount: 690000 },
  { method: "Bank Transfer", transactions: 96, amount: 520000 },
  { method: "Airtel Money", transactions: 188, amount: 315000 },
];

export const collectionData = [
  { month: "Dec 25", expected: 190000, collected: 160000 },
  { month: "Jan 26", expected: 220000, collected: 197000 },
  { month: "Feb 26", expected: 255000, collected: 231000 },
  { month: "Mar 26", expected: 280000, collected: 246000 },
  { month: "Apr 26", expected: 325000, collected: 301000 },
  { month: "May 26", expected: 360000, collected: 328000 },
];

export const businessProfile = {
  name: "Qwetu Links POS",
  email: "admin@qwetulinks.co.ke",
  phone: "+254 712 345 678",
  location: "Nairobi, Kenya",
  description:
    "Retail POS and Lipa Mdogo operations for electronics, accessories, and customer installment plans.",
};

export const rolePermissionOptions: RolePermission[] = [
  { key: "dashboard.view", label: "View Dashboard" },
  { key: "catalog.manage", label: "Manage Catalog" },
  { key: "inventory.manage", label: "Manage Inventory" },
  { key: "sales.manage", label: "Manage Sales" },
  { key: "customers.manage", label: "Manage Customers" },
  { key: "finance.manage", label: "Manage Finance" },
  { key: "lipa_mdogo.manage", label: "Manage Lipa Mdogo" },
  { key: "analytics.view", label: "View Analytics" },
  { key: "settings.manage", label: "Manage Settings" },
  { key: "whatsapp.manage", label: "Manage WhatsApp" },
  { key: "roles.manage", label: "Manage Roles" },
];

export const businessRoles: BusinessRole[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full access to every POS module and setting.",
    permissions: rolePermissionOptions.map((permission) => permission.key),
  },
  {
    id: "manager",
    name: "Manager",
    description: "Operational control with limited settings access.",
    permissions: [
      "dashboard.view",
      "catalog.manage",
      "inventory.manage",
      "sales.manage",
      "customers.manage",
      "finance.manage",
      "lipa_mdogo.manage",
      "analytics.view",
    ],
  },
  {
    id: "cashier",
    name: "Cashier",
    description: "Sales, customers, and payment collection workflows.",
    permissions: ["dashboard.view", "sales.manage", "customers.manage", "lipa_mdogo.manage"],
  },
];

export const teamUsers: TeamUser[] = [
  { id: "U-001", name: "Mary Wanjiku", email: "mary@qwetulinks.co.ke", role: "owner", status: "Active" },
  { id: "U-002", name: "James Otieno", email: "james@qwetulinks.co.ke", role: "manager", status: "Active" },
  { id: "U-003", name: "Grace Njeri", email: "grace@qwetulinks.co.ke", role: "cashier", status: "Invited" },
];

export function getPercentChange(current: number, previous: number) {
  if (!previous && !current) {
    return null;
  }

  if (!previous) {
    return 100;
  }

  return ((current - previous) / previous) * 100;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
