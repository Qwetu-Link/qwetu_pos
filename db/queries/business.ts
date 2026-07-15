import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { BusinessFormValues } from "@/validators/business";

export async function createBusiness(data: BusinessFormValues) {
  return await db
    .insert(businessTable)
    .values(data)
    .returning();
}