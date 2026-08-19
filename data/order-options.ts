import type { OrderStatus } from "@/types/admin/customer";

export type { OrderStatus } from "@/types/admin/customer";

export const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
