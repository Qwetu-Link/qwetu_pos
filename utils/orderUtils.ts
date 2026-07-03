import type { Order, OrderStatus } from "../types/orderTypes";
import { ORDER_STATUS_CONFIG } from "@/data/customer-config";
import { formatCurrency } from "@/utils/formatters";

export const statusStyles: Record<OrderStatus, string> = {
  delivered: ORDER_STATUS_CONFIG.delivered.color,
  shipped: ORDER_STATUS_CONFIG.shipped.color,
  processing: ORDER_STATUS_CONFIG.processing.color,
  cancelled: ORDER_STATUS_CONFIG.cancelled.color,
  pending: ORDER_STATUS_CONFIG.pending.color,
};

export { formatCurrency };

export const formatDate = (date: string) => new Date(date).toLocaleDateString();

export function findOrderById(orders: Order[], id: string) {
  return orders.find((order) => order.id.toLowerCase() === id.toLowerCase());
}
