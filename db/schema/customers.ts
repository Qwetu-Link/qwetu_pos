import { businessTable } from "./business";
import { int, mysqlEnum, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";

const riskLevelValues = ["low", "medium", "high"] as const;
const segmentValues = ["New", "Regular", "VIP"] as const;

// Customer Table
export const customerTable = mysqlTable("customers", {
    id: varchar("id", { length: 36 })
        .$defaultFn(() => randomUUID())
        .primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 200 }).unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 255 }),
    address: varchar("address", { length: 255 }),
    totalOrders: int("total_orders").default(0),
    totalSpent: int("total_spent").default(0),
    activeInstallments: int("active_installments").default(0),
    paymentScore: int("payment_score").default(0),
    riskLevel: mysqlEnum("risk", riskLevelValues)
        .default("low").notNull(),
    segment: mysqlEnum("segment", segmentValues).default("New").notNull(),
    joinedDate: timestamp("joined_date").defaultNow().notNull(),
    lastPurchase: timestamp("last_purchase"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueEmail: uniqueIndex("business_customer_email_idx").on(table.businessId, table.email)
}));
