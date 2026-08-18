import { db } from "../db";
import { usersTable } from "../db/schema/users";
import { roleTable } from "../db/schema/roles";
import { and, eq, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function main() {
  console.log("Starting Super User creation...");

  const email = process.env.SUPER_ADMIN_EMAIL ?? "admin@qwetupos.com";
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "AdminPassword123!";
  const name = process.env.SUPER_ADMIN_NAME ?? "System Super User";

  const [existingRole] = await db
    .select()
    .from(roleTable)
    .where(and(eq(roleTable.name, "SUPERADMIN"), isNull(roleTable.businessId)))
    .limit(1);

  let roleId = existingRole?.id;

  if (!roleId) {
    roleId = crypto.randomUUID();
    await db.insert(roleTable).values({
      id: roleId,
      name: "SUPERADMIN",
      businessId: null,
      description: "System-wide super administrator",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser) {
    await db
      .update(usersTable)
      .set({
        name,
        passwordHash,
        businessId: null,
        roleId,
        isActive: true,
      })
      .where(eq(usersTable.id, existingUser.id));
  } else {
    await db.insert(usersTable).values({
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      businessId: null,
      roleId,
      isActive: true,
    });
  }

  console.log(`Super User successfully seeded: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
