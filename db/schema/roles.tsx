import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const roleTable = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 })
        .notNull()
        .unique(),
    description: varchar("description", { length: 255 }),
    salary: integer("salary").default(0).notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});