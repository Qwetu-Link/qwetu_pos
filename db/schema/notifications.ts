import { randomUUID } from "crypto";
import { boolean, mysqlEnum, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { businessTable } from "./business";

export const notificationTypeValues = [
  "low_stock_alert",
  "expiry_alert",
  "order_created",
  "order_paid",
  "order_status_updated",
] as const;

export const notificationPreferenceTable = mysqlTable("notification_preference", {
  id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
  businessId: varchar("business_id", { length: 36 })
    .notNull()
    .references(() => businessTable.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", notificationTypeValues).notNull(),
  inApp: boolean("in_app").default(true).notNull(),
  email: boolean("email").default(false).notNull(),
  sms: boolean("sms").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  businessTypeUnique: uniqueIndex("notification_preference_business_type_unique").on(
    table.businessId,
    table.type,
  ),
}));

export type NotificationType = typeof notificationTypeValues[number];
