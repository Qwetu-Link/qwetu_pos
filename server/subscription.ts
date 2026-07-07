import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { businessTable } from "@/db/schema/business";
import { usersTable } from "@/db/schema/users";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const subscriptionRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    const businesses = await db
      .select({
        id: businessTable.id,
        businessName: businessTable.businessName,
        email: businessTable.email,
        phone: businessTable.phone,
        isActive: businessTable.isActive,
        createdAt: businessTable.createdAt,
      })
      .from(businessTable)
      .orderBy(desc(businessTable.createdAt));

    return Promise.all(
      businesses.map(async (business) => {
        const owners = await db
          .select({
            id: usersTable.id,
            name: usersTable.name,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            email: usersTable.email,
            phone: usersTable.phone,
            isActive: usersTable.isActive,
            createdAt: usersTable.createdAt,
          })
          .from(usersTable)
          .where(eq(usersTable.businessId, business.id))
          .orderBy(desc(usersTable.createdAt))
          .limit(1);

        return {
          ...business,
          owner: owners[0] ?? null,
        };
      }),
    );
  }),

  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [business] = await db
        .select()
        .from(businessTable)
        .where(eq(businessTable.id, input.id))
        .limit(1);

      if (!business) {
        return null;
      }

      const owners = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.businessId, business.id));

      return { business, owners };
    }),
});
