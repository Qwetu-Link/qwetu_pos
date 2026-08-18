import { boolean, int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { categoryTable } from "./category";
import { defineRelationsPart } from "drizzle-orm";
import { businessTable } from "./business";
import { randomUUID } from "crypto";


export const productImages = mysqlTable("product_images", {
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
    variantId: varchar("variant_id", { length: 36 }),

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
    width: int("width"),
    height: int("height"),
    fileSize: int("file_size"),

    // Product gallery
    displayOrder: int("display_order")
        .default(0)
        .notNull(),
    isPrimary: boolean("is_primary")
        .default(false)
        .notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const productsTable = mysqlTable("products", {
    id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
    businessId: varchar("business_id", { length: 36 })
        .notNull()
        .references(() => businessTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", {
        length: 255,
    }).notNull(),
    categoryId: varchar("category_id", { length: 36 }).references(() => categoryTable.id, { onDelete: 'restrict' }), // or "cascade" if you want products deleted too
    brand: varchar("brand", {
        length: 50,
    }).notNull(),
    description: varchar("description", {
        length: 1000,
    }),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const productImageRelations = defineRelationsPart(
    { productImages, productsTable },
    ({ one, productImages, productsTable }) => ({
        productImages: {
            product: one.productsTable({
                from: productImages.productId,
                to: productsTable.id,
                optional: false,
            }),
        },
    }),
);

export const categoryRelations = defineRelationsPart(
    { categoryTable, productsTable },
    ({ many, categoryTable, productsTable }) => ({
        categoryTable: {
            products: many.productsTable({
                from: categoryTable.id,
                to: productsTable.categoryId,
            }),
        },
    }),
);

export const productRelations = defineRelationsPart(
    { productsTable, categoryTable, productImages },
    ({ one, many, productsTable, categoryTable, productImages }) => ({
        productsTable: {
            category: one.categoryTable({
                from: productsTable.categoryId,
                to: categoryTable.id,
            }),
            images: many.productImages({
                from: productsTable.id,
                to: productImages.productId,
            }),
        },
    }),
);
