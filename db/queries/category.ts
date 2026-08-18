import { db } from "@/db";
import { categoryTable } from "@/db/schema/category";
import { productsTable } from "@/db/schema/products";
import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export const getCategoriesQuery = async (businessId: string) => {
    return db
        .select({
            id: categoryTable.id,
            name: categoryTable.name,
            description: categoryTable.description,
            icon: categoryTable.icon,
            productCount: sql<number>`cast(count(${productsTable.id}) as unsigned)`,
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
            productCount: sql<number>`cast(count(${productsTable.id}) as unsigned)`,
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
    const id = randomUUID();

    const [category] = await db
        .insert(categoryTable)
        .values({ id, ...data })
        .$returningId();

    return getCategoryByIdQuery({ id: category.id, businessId: data.businessId });
};

export const updateCategoryQuery = async (data: {
    id: string;
    businessId: string;
    name: string;
    description: string;
    icon: string;
}) => {
    const { id, businessId, ...values } = data;

    await db
        .update(categoryTable)
        .set(values)
        .where(and(
            eq(categoryTable.id, id),
            eq(categoryTable.businessId, businessId),
        ));

    return getCategoryByIdQuery({ id, businessId });
};

export const deleteCategoryQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const category = await getCategoryByIdQuery(data);

    if (!category) {
        return undefined;
    }

    await db
        .delete(categoryTable)
        .where(and(
            eq(categoryTable.id, data.id),
            eq(categoryTable.businessId, data.businessId),
        ));

    return category;
};
