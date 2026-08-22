"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { businessTable } from "@/db/schema/business"
import { roleTable } from "@/db/schema/roles"
import { usersTable } from "@/db/schema/users"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const planValues = ["trial", "starter", "professional", "enterprise"] as const
const statusValues = ["trial", "active", "suspended", "expired"] as const

const SuperAdminCreateBusinessSchema = z.object({
    businessName: z.string().min(2),
    registrationNumber: z.string().min(1),
    taxPin: z.string().min(1).default("N/A"),
    email: z.string().email(),
    phone: z.string().min(5),
    industry: z.string().optional(),
    status: z.enum(statusValues).default("trial"),
    description: z.string().optional(),
    country: z.string().min(2).default("Kenya"),
    city: z.string().optional(),
    address: z.string().optional(),
    plan: z.enum(planValues).default("trial"),
    users: z.coerce.number().int().min(0).default(1),
    branches: z.coerce.number().int().min(0).default(1),
    whatsappStatus: z.coerce.boolean().default(false),
    ownerFirstName: z.string().min(2),
    ownerLastName: z.string().min(2),
    ownerEmail: z.string().email(),
    ownerPhone: z.string().min(5),
    password: z.string().min(6),
})

export type SuperAdminCreateBusinessInput = z.infer<typeof SuperAdminCreateBusinessSchema>

export async function superAdminCreateBusiness(formData: SuperAdminCreateBusinessInput) {
    // 1. Verify authorization state
    const session = await auth()
    if (!session || !session.user) {
        return {
            success: false as const,
            error: "Unauthorized access.",
        }
    }

    // 2. Lock down feature explicitly to the Super User identity
    const isSuperUser = session.user.roleName === "SUPERADMIN" || session.user.businessId === null
    if (!isSuperUser) {
        return {
            success: false as const,
            error: "Forbidden: You do not possess the required root privileges.",
        }
    }

    const parsedData = SuperAdminCreateBusinessSchema.safeParse(formData)
    if (!parsedData.success) {
        return {
            success: false as const,
            error: parsedData.error.issues[0]?.message ?? "Invalid business details.",
        }
    }

    const validatedData = parsedData.data

    // 3. Atomically build Business and User references 
    try {
        const result = await db.transaction(async (tx) => {

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
                    email: validatedData.email,
                    phone: validatedData.phone,
                    industry: validatedData.industry,
                    status: validatedData.status,
                    description: validatedData.description,
                    country: validatedData.country,
                    city: validatedData.city,
                    address: validatedData.address,
                    plan: validatedData.plan,
                    users: validatedData.users,
                    branches: validatedData.branches,
                    whatsappStatus: validatedData.whatsappStatus,
                    isActive: validatedData.status !== "suspended" && validatedData.status !== "expired",
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
                    name: `${validatedData.ownerFirstName} ${validatedData.ownerLastName}`,
                    firstName: validatedData.ownerFirstName,
                    lastName: validatedData.ownerLastName,
                    email: validatedData.ownerEmail,
                    phone: validatedData.ownerPhone,
                    businessId,
                    roleId: adminRoleId,
                    isActive: true,
                    // Make sure to cast/extend if custom fields like passwordHash exist directly on your schema
                    ...({ passwordHash } as unknown as { passwordHash: string })
                })

            return {
                success: true as const,
                businessId,
                ownerId,
            }
        })

        revalidatePath("/superadmin/businesses")
        return result
    } catch (error) {
        console.error("SUPERADMIN_CREATE_BUSINESS_ERROR:", error)
        return {
            success: false as const,
            error: "Failed to create business. Check that the owner email and registration number are unique.",
        }
    }
}
