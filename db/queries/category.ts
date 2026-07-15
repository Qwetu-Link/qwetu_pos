import { db } from "@/db";
import { categoryTable } from "@/db/schema/category";
import { desc, eq } from "drizzle-orm";

export const getCategoriesQuery = async () => {
    return db
        .select()
        .from(categoryTable)
        .orderBy(desc(categoryTable.createdAt));
};

export const getCategoryByIdQuery = async (id: string) => {
    const [category] = await db
        .select()
        .from(categoryTable)
        .where(eq(categoryTable.id, id));

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
    name: string;
    description: string;
    icon: string;
}) => {
    const { id, ...values } = data;

    const [category] = await db
        .update(categoryTable)
        .set(values)
        .where(eq(categoryTable.id, id))
        .returning();

    return category;
};

export const deleteCategoryQuery = async (id: string) => {
    const [category] = await db
        .delete(categoryTable)
        .where(eq(categoryTable.id, id))
        .returning();

    return category;
};