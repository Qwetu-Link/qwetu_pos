import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { BusinessFormValues } from "@/validators/business";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function createBusiness(data: BusinessFormValues) {
  const id = randomUUID();

  await db
    .insert(businessTable)
    .values({ id, ...data });

  return db
    .select()
    .from(businessTable)
    .where(eq(businessTable.id, id));
}
