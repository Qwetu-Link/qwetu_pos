import { pgTable, varchar, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { categoryTable } from "./category";
import { relations } from "drizzle-orm/_relations";


export const productImages = pgTable("product_images", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, {
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
        product: one(products, {
            fields: [productImages.productId],
            references: [products.id],
        }),
    })
);


export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
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

export const productRelations = relations(products, ({ one, many }) => ({
    category: one(categoryTable, {
        fields: [products.categoryId],
        references: [categoryTable.id],
    }),
    images: many(productImages),
}));