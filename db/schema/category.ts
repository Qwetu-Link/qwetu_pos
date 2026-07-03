import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products";
import { relations } from "drizzle-orm/_relations";


export const categoryTable = pgTable("category", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: varchar("description"),
    icon: varchar("icon", { length: 255 }),
    productCount: integer("product_count").default(0)
}) 

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(products),
}));