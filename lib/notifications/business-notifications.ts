export type BusinessNotificationType = "order_created" | "order_paid" | "order_status_updated" | "low_stock_alert";

export type BusinessNotificationPayload = {
  orderNo?: string;
  customerName?: string;
  amount?: number;
  productName?: string;
  variantName?: string;
  stock?: number;
  status?: string;
};

export type BusinessNotification = {
  title: string;
  body: string;
  url: string;
  persistent?: boolean;
};

export function buildBusinessNotification(
  type: BusinessNotificationType,
  payload: BusinessNotificationPayload,
): BusinessNotification {
  switch (type) {
    case "order_created":
      return {
        title: "New order created",
        body: `${payload.orderNo ?? "A new order"} was created for ${payload.customerName ?? "a customer"} for ${payload.amount ? `KSh ${payload.amount}` : "a new amount"}.`,
        url: "/orders",
        persistent: false,
      };
    case "order_paid":
      return {
        title: "Order payment received",
        body: `${payload.orderNo ?? "An order"} has a new payment recorded${payload.amount ? ` for KSh ${payload.amount}` : ""}.`,
        url: "/orders",
        persistent: false,
      };
    case "order_status_updated":
      return {
        title: "Order status updated",
        body: `${payload.orderNo ?? "An order"} is now ${payload.status ?? "updated"}.`,
        url: "/orders",
        persistent: false,
      };
    case "low_stock_alert":
      return {
        title: "Low stock alert",
        body: `${payload.productName ?? "A product"} (${payload.variantName ?? "variant"}) is running low with ${payload.stock ?? 0} units remaining.`,
        url: "/inventory",
        persistent: true,
      };
    default:
      return {
        title: "Business update",
        body: "A business update is available.",
        url: "/",
      };
  }
}
