import { integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { businessTable } from "./business";

export const riskLevelEnum = pgEnum("risk", ["low", "medium", "high"]);
export const segmentEnum = pgEnum("segment", ["New", "Regular", "VIP"]);

// Customer Table
export const customerTable = pgTable("customers", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 255 }),
    address: varchar("address", { length: 255 }),
    totalOrders: integer("total_orders").default(0),
    totalSpent: integer("total_spent").default(0),
    activeInstallments: integer("active_installments").default(0),
    paymentScore: integer("payment_score").default(0),
    riskLevel: riskLevelEnum("risk_level").default("low").notNull(),
    segment: segmentEnum("segment").default("New").notNull(),
    joinedDate: timestamp("joined_date").defaultNow().notNull(),
    lastPurchase: timestamp("last_purchase"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    uniqueEmail: uniqueIndex("business_customer_email").on(table.businessId, table.email)
}));