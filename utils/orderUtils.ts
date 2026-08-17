import type { Order, OrderStatus } from "../types/orderTypes";
import { ORDER_STATUS_CONFIG } from "@/data/customer-config";
import { formatCompactCurrency, formatCurrency } from "@/utils/formatters";

export const statusStyles: Record<OrderStatus, string> = {
  delivered: ORDER_STATUS_CONFIG.delivered.color,
  shipped: ORDER_STATUS_CONFIG.shipped.color,
  processing: ORDER_STATUS_CONFIG.processing.color,
  cancelled: ORDER_STATUS_CONFIG.cancelled.color,
  pending: ORDER_STATUS_CONFIG.pending.color,
};

export { formatCompactCurrency, formatCurrency };

export const formatDate = (date: string) => new Date(date).toLocaleDateString();

export function getOrderDisplayNumber(order: Pick<Order, "id" | "createdAt" | "orderNumber">) {
  if (order.orderNumber) return order.orderNumber;
  if (order.id.toUpperCase().startsWith("ORD-")) return order.id;

  const orderSegment = order.id.split("-")[1]?.toUpperCase() ?? order.id.slice(0, 4).toUpperCase();
  const minute = String(new Date(order.createdAt).getMinutes()).padStart(2, "0");
  return `ORD-${orderSegment}-${minute}`;
}

export function findOrderById(orders: Order[], id: string) {
  return orders.find((order) => order.id.toLowerCase() === id.toLowerCase());
}
