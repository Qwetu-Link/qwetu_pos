
import { mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { businessTable } from "./business";
import { randomUUID } from "crypto";


export const categoryTable = mysqlTable("category", {
  id: varchar("id", { length: 36 })
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  businessId: varchar("business_id", { length: 36 })
    .notNull()
    .references(() => businessTable.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  icon: varchar("icon", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  uniqueName: uniqueIndex("category_business_name_idx").on(table.businessId, table.name)
}))
