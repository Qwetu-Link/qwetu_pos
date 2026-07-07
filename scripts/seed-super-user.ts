import { db } from "../db"
import { usersTable } from "../db/schema/users"
import { roleTable } from "../db/schema/roles"
import bcrypt from "bcryptjs"

async function main() {
  console.log("⏳ Starting Super User creation...")

  // 1. Create a global "Super Admin" role with no businessId linkage
  const [superRole] = await db
    .insert(roleTable)
    .values({
      name: "Super Admin",
      businessId: null, // Global scope
    })
    .returning({ id: roleTable.id })

  // 2. Hash your root credential securely
  const passwordHash = await bcrypt.hash("YourSecureAdminPassword123!", 10)

  // 3. Create the Super User
  const [superUser] = await db
    .insert(usersTable)
    .values({
      name: "System Super User",
      email: "admin@qwetupos.com", // Change this to your root email
      passwordHash: passwordHash,
      businessId: null, // Belongs to no business; owns the platform
      roleId: superRole.id,
      isActive: true,
    })
    .returning()

  console.log(`✅ Super User successfully seeded: ${superUser.email}`)
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
})