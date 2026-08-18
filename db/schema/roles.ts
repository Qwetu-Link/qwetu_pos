import {
    int,
    mysqlTable,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { businessTable } from "./business";
import { randomUUID } from "crypto";

export const roleTable = mysqlTable("roles", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 50 })
        .notNull(),
    description: varchar("description", { length: 255 }),
    salary: int("salary").default(0),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    uniqueBusinessRole: uniqueIndex("unique_name_idx").on(table.businessId, table.name),
}));
