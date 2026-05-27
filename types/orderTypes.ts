export type { LineItem, Order, OrderStatus, PaymentType, PaymentStatus } from "./customer";
import type { OrderStatus } from "./customer";

export const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
