import { randomUUID } from "crypto";
import { boolean, int, mysqlEnum, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { businessTable } from "./business";


const planValues = ["Trial", "Starter", "Professional", "Enterprise"] as const;
const billingValues = ["monthly", "quartely", "semi-annual", "annual"] as const;
const paymentValues = ["paid", "pending", "failed", "refunded"] as const;

export const subscriptionTable = mysqlTable("subscription", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    plan: mysqlEnum("plan", planValues)
        .default("Trial").notNull(),
    billingCycle: mysqlEnum("billing_cycle", billingValues).default("monthly").notNull(),
    description: varchar("description", { length: 255 }),
    price: int("salary").default(0),
    paymentStatus: mysqlEnum("payment_status", paymentValues).default("pending").notNull(),
    renewalDate: varchar("renewal_date", { length: 255 }),
    expiryDate: varchar("expiry_date", { length: 255 }),
    status: varchar("status", { length: 255 }),
    autoRenewal: boolean("auto_renewal").default(false).notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueBusinessRole: uniqueIndex("unique_plan_idx").on(table.businessId, table.plan),
}));