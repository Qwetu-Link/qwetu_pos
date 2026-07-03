import { pgTable, varchar, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { categoryTable } from "./category";
import { relations } from "drizzle-orm/_relations";
import { businessTable } from "./business";


export const productImages = pgTable("product_images", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
    .notNull()
    .references(() => businessTable.id, {
        onDelete: "cascade",
    }),
    productId: uuid("product_id")
        .notNull()
        .references(() => productsTable.id, {
            onDelete: "cascade",
        }),

    // Storage paths
    originalPath: varchar("original_path", {
        length: 1000,
    }).notNull(),
    optimizedPath: varchar("optimized_path", {
        length: 1000,
    }),
    thumbnailPath: varchar("thumbnail_path", {
        length: 1000,
    }),
    watermarkedPath: varchar("watermarked_path", {
        length: 1000,
    }),

    // Image metadata
    alt: varchar("alt", {
        length: 255,
    }),
    mimeType: varchar("mime_type", {
        length: 100,
    }),
    width: integer("width"),
    height: integer("height"),
    fileSize: integer("file_size"),

    // Product gallery
    displayOrder: integer("display_order")
        .default(0)
        .notNull(),
    isPrimary: boolean("is_primary")
        .default(false)
        .notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});

export const productImageRelations = relations(
    productImages,
    ({ one }) => ({
        product: one(productsTable, {
            fields: [productImages.productId],
            references: [productsTable.id],
        }),
    })
);


export const productsTable = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
    .notNull()
    .references(() => businessTable.id, {
        onDelete: "cascade",
    }),
    name: varchar("name", {
        length: 255,
    }).notNull(),
    categoryId: uuid("category_id").references(() => categoryTable.id, { onDelete: 'restrict' }), // or "cascade" if you want products deleted too
    brand: varchar("brand", {
        length: 50,
    }).notNull(),
    description: varchar("description", {
        length: 1000,
    }),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});

export const productRelations = relations(productsTable, ({ one, many }) => ({
    category: one(categoryTable, {
        fields: [productsTable.categoryId],
        references: [categoryTable.id],
    }),
    images: many(productImages),
}));