import type { OrderStatus } from "@/types/customer";

export type { OrderStatus } from "@/types/customer";

export const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
