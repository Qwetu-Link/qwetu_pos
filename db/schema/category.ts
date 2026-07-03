import { integer, pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/_relations";
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
  productCount: integer("product_count").default(0)
}, (table) => ({
  uniqueName: uniqueIndex("unique_name").on(table.businessId, table.name)
}))

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productsTable),
}));