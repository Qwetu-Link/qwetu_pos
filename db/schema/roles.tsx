import {
    integer,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { businessTable } from "./business";

export const roleTable = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 50 })
        .notNull(),
    description: varchar("description", { length: 255 }),
    salary: integer("salary").default(0),
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