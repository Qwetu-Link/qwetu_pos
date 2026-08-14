import { db } from "@/db";
import { categoryTable } from "@/db/schema/category";
import { productsTable } from "@/db/schema/products";
import { and, desc, eq, sql } from "drizzle-orm";

export const getCategoriesQuery = async (businessId: string) => {
    return db
        .select({
            id: categoryTable.id,
            name: categoryTable.name,
            description: categoryTable.description,
            icon: categoryTable.icon,
            productCount: sql<number>`count(${productsTable.id})::int`,
        })
        .from(categoryTable)
        .leftJoin(
            productsTable,
            and(
                eq(productsTable.categoryId, categoryTable.id),
                eq(productsTable.businessId, businessId),
            ),
        )
        .where(eq(categoryTable.businessId, businessId))
        .groupBy(
            categoryTable.id,
            categoryTable.name,
            categoryTable.description,
            categoryTable.icon,
            categoryTable.createdAt,
        )
        .orderBy(desc(categoryTable.createdAt))
};

export const getCategoryByIdQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const [category] = await db
        .select({
            id: categoryTable.id,
            name: categoryTable.name,
            description: categoryTable.description,
            icon: categoryTable.icon,
            productCount: sql<number>`count(${productsTable.id})::int`,
        })
        .from(categoryTable)
        .leftJoin(
            productsTable,
            and(
                eq(productsTable.categoryId, categoryTable.id),
                eq(productsTable.businessId, data.businessId),
            ),
        )
        .where(and(
            eq(categoryTable.id, data.id),
            eq(categoryTable.businessId, data.businessId),
        ))
        .groupBy(
            categoryTable.id,
            categoryTable.name,
            categoryTable.description,
            categoryTable.icon,
        );

    return category;
};

export const createCategoryQuery = async (data: {
    businessId: string;
    name: string;
    description: string;
    icon: string;
}) => {
    const [category] = await db
        .insert(categoryTable)
        .values(data)
        .returning();

    return category;
};

export const updateCategoryQuery = async (data: {
    id: string;
    businessId: string;
    name: string;
    description: string;
    icon: string;
}) => {
    const { id, businessId, ...values } = data;

    const [category] = await db
        .update(categoryTable)
        .set(values)
        .where(and(
            eq(categoryTable.id, id),
            eq(categoryTable.businessId, businessId),
        ))
        .returning();

    return category;
};

export const deleteCategoryQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const [category] = await db
        .delete(categoryTable)
        .where(and(
            eq(categoryTable.id, data.id),
            eq(categoryTable.businessId, data.businessId),
        ))
        .returning();

    return category;
};
