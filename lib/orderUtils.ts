import type { Order, OrderStatus } from "../types/orderTypes";
import { ORDER_STATUS_CONFIG } from "../types/customer";

export const statusStyles: Record<OrderStatus, string> = {
  delivered: ORDER_STATUS_CONFIG.delivered.color,
  shipped: ORDER_STATUS_CONFIG.shipped.color,
  processing: ORDER_STATUS_CONFIG.processing.color,
  cancelled: ORDER_STATUS_CONFIG.cancelled.color,
  pending: ORDER_STATUS_CONFIG.pending.color,
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

export const formatDate = (date: string) => new Date(date).toLocaleDateString();

export function generateOrderId(orders: Order[]) {
  const lastId = Math.max(
    ...orders.map((order) => Number(order.id.split("-")[1])),
    12841,
  );
  return `ORD-${lastId + 1}`;
}

export function findOrderById(orders: Order[], id: string) {
  return orders.find((order) => order.id.toLowerCase() === id.toLowerCase());
}
