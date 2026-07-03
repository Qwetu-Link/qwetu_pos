import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { businessTable } from "./business";

export const roleTable = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
    .notNull()
    .references(() => businessTable.id, {
        onDelete: "cascade",
    }),
    name: varchar("name", { length: 50 })
        .notNull()
        .unique(),
    description: varchar("description", { length: 255 }),
    salary: integer("salary").default(0).notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});