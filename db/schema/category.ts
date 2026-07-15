import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productsTable } from "./products";
import { businessTable } from "./business";


export const categoryTable = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businessTable.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description"),
  icon: varchar("icon", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  uniqueName: uniqueIndex("category_business_name_idx").on(table.businessId, table.name)
}))

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productsTable),
}));