import { randomUUID } from "crypto";
import { boolean, int, json, mysqlEnum, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
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

export const subscriptionPlansTable = mysqlTable("subscription_plans", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    monthlyPrice: int("monthly_price").default(0).notNull(),
    annualPrice: int("annual_price").default(0).notNull(),
    userLimit: int("user_limit").default(1).notNull(),
    branchLimit: int("branch_limit").default(1).notNull(),
    supportLevel: varchar("support_level", { length: 100 }).default("Standard").notNull(),
    features: json("features").notNull(),
    isPopular: boolean("is_popular").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    nameUnique: uniqueIndex("name_unique").on(table.name),
}));