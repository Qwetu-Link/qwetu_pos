"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { businessTable } from "@/db/schema/business"
import { roleTable } from "@/db/schema/roles"
import { usersTable } from "@/db/schema/users"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { z } from "zod"

const RegisterBusinessSchema = z.object({
    // Business fields
    businessName: z.string().min(2),
    registrationNumber: z.string().min(1),
    taxPin: z.string().min(1),
    businessEmail: z.string().email(),
    phone: z.string().min(5),
    // Owner Fields
    ownerFirstName: z.string().min(2),
    ownerLastName: z.string().min(2),
    ownerEmail: z.string().email(),
    password: z.string().min(6),
})

export async function superAdminCreateBusiness(formData: z.infer<typeof RegisterBusinessSchema>) {
    // 1. Verify authorization state
    const session = await auth()
    if (!session || !session.user) {
        throw new Error("Unauthorized access.")
    }

    // 2. Lock down feature explicitly to the Super User identity
    const isSuperUser = session.user.businessId === null
    if (!isSuperUser) {
        throw new Error("Forbidden: You do not possess the required root privileges.")
    }

    const validatedData = RegisterBusinessSchema.parse(formData)

    // 3. Atomically build Business and User references 
    return await db.transaction(async (tx) => {

        // Find or create a default "Admin / Owner" role layout for this new tenant space
        // Let's assume you have a static template or create one dynamically:
        const businessId = crypto.randomUUID()
        await tx
            .insert(businessTable)
            .values({
                id: businessId,
                businessName: validatedData.businessName,
                registrationNumber: validatedData.registrationNumber,
                taxPin: validatedData.taxPin,
                email: validatedData.businessEmail,
                phone: validatedData.phone,
            })

        // Build the default admin tier role bound strictly to this tenant space
        const adminRoleId = crypto.randomUUID()
        await tx
            .insert(roleTable)
            .values({
                id: adminRoleId,
                name: "Business Admin",
                businessId,
            })

        // Hash operational credentials securely 
        const passwordHash = await bcrypt.hash(validatedData.password, 10)

        // Append owner parameters into Auth.js standard users model
        const ownerId = crypto.randomUUID()
        await tx
            .insert(usersTable)
            .values({
                id: ownerId,
                firstName: validatedData.ownerFirstName,
                lastName: validatedData.ownerLastName,
                email: validatedData.ownerEmail,
                businessId,
                roleId: adminRoleId,
                isActive: true,
                // Make sure to cast/extend if custom fields like passwordHash exist directly on your schema
                ...({ passwordHash } as unknown as { passwordHash: string })
            })

        return {
            success: true,
            businessId,
            ownerId,
        }
    })
}
