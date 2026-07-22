import { db } from "@/db";
import { categoryTable } from "@/db/schema/category";
import { and, desc, eq } from "drizzle-orm";

export const getCategoriesQuery = async (businessId: string) => {
    return db
        .select()
        .from(categoryTable)
        .where(eq(categoryTable.businessId, businessId))
        .orderBy(desc(categoryTable.createdAt))
};

export const getCategoryByIdQuery = async (data: {
    id: string;
    businessId: string;
}) => {
    const [category] = await db
        .select()
        .from(categoryTable)
        .where(and(
            eq(categoryTable.id, data.id),
            eq(categoryTable.businessId, data.businessId),
        ));

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
