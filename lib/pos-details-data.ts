export { formatCompactCurrency, formatCurrency } from "@/lib/formatters";
export {
  businessProfile,
  businessRoles,
  categoryData,
  collectionData,
  customerSegmentData,
  paymentMethodData,
  previousRevenueData,
  revenueData,
  rolePermissionOptions,
  teamUsers,
} from "@/data/pos-details-data";
export type {
  BusinessProfile,
  BusinessRole,
  CategoryMetric,
  CollectionMetric,
  PaymentMethodMetric,
  RevenueMonth,
  RolePermission,
  SegmentMetric,
  TeamUser,
} from "@/types/settings";

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
