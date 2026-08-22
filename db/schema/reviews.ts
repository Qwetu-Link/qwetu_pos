import { boolean, index, mysqlTable, text, timestamp, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { businessTable } from "./business";
import { customerTable } from "./customers";
import { productsTable } from "./products";

export const reviewsTable = mysqlTable("reviews", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    productId: varchar("product_id", { length: 36 })
        .notNull()
        .references(() => productsTable.id, {
            onDelete: "cascade",
        }),
    customerId: varchar("customer_id", { length: 36 })
        .notNull()
        .references(() => customerTable.id, {
            onDelete: "cascade",
        }),
    rating: tinyint("rating").notNull(),
    title: varchar("title", { length: 255 }),
    review: text("review").notNull(),
    wouldRecommend: boolean("would_recommend").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    customerProductReviewUnique: uniqueIndex("customer_product_review_unique").on(
        table.customerId,
        table.productId,
    ),
    productIdx: index("reviews_product_id_idx").on(table.productId),
    customerIdx: index("reviews_customer_id_idx").on(table.customerId),
    businessIdx: index("reviews_business_id_idx").on(table.businessId),
}));
