import test from "node:test";
import assert from "node:assert/strict";
import { buildBusinessNotification } from "../lib/notifications/business-notifications";

test("builds an order-created notification for the business team", () => {
  const notification = buildBusinessNotification("order_created", {
    orderNo: "ORD-100",
    customerName: "Jane Doe",
    amount: 1250,
  });

  assert.equal(notification.title, "New order created");
  assert.match(notification.body, /ORD-100/);
  assert.match(notification.body, /Jane Doe/);
  assert.equal(notification.url, "/orders");
});

test("builds a low-stock alert with the affected variant details", () => {
  const notification = buildBusinessNotification("low_stock_alert", {
    productName: "Classic Tee",
    variantName: "Blue / M",
    stock: 2,
  });

  assert.equal(notification.title, "Low stock alert");
  assert.match(notification.body, /Classic Tee/);
  assert.match(notification.body, /Blue \/ M/);
  assert.match(notification.body, /2/);
  assert.equal(notification.url, "/inventory");
});
