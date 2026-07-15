import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { usersTable } from "./db/schema/users"
import { db } from "./db"
import { roleTable } from "./db/schema/roles"

// 1. Safe Module Overrides via Direct Interface Merging
declare module "next-auth" {
    interface User {
        businessId?: string | null
        roleId?: string | null
        passwordHash?: string | null
        isActive?: boolean
        roleName?: string // Added here cleanly
    }

    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
            businessId?: string | null
            roleId?: string | null
            roleName?: string // Added here cleanly
        }
    }
}

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: authSecret,
    trustHost: true,
    session: { strategy: "jwt" },
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials)

                    const [foundUser] = await db
                        .select()
                        .from(usersTable)
                        .where(eq(usersTable.email, email))
                        .limit(1)

                    // Explicitly cast to include passwordHash safely without using 'any'
                    const targetUser = foundUser as typeof foundUser & { passwordHash?: string | null }

                    if (!targetUser || !targetUser.passwordHash) {
                        return null
                    }

                    const isValid = await bcrypt.compare(password, targetUser.passwordHash)
                    if (!isValid) return null

                    if (!targetUser.isActive) {
                        throw new Error("Account is deactivated.")
                    }

                    return {
                        id: targetUser.id,
                        name: targetUser.name,
                        email: targetUser.email,
                        image: targetUser.image,
                        businessId: targetUser.businessId,
                        roleId: targetUser.roleId,
                    }
                } catch {
                    return null
                }
            },
        }),
    ],
    // Add this helper function at the top of your auth.ts file to query role strings
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id
                token.businessId = user.businessId
                token.roleId = user.roleId


                // Fetch the friendly name of the role (e.g., "Super Admin") to make routing decisions easier
                if (user.roleId) {
                    const [roleRecord] = await db
                        .select({ name: roleTable.name })
                        .from(roleTable)
                        .where(eq(roleTable.id, user.roleId))
                        .limit(1)

                    token.roleName = roleRecord?.name || "Member"
                } else if (user.businessId === null) {
                    // If no business context exists, they are structurally a global system manager
                    token.roleName = "Super Admin"
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.userId as string;
                session.user.businessId = token.businessId as string | null | undefined
                session.user.roleId = token.roleId as string | null | undefined
                session.user.roleName = token.roleName as string | undefined /// Expose role string to client components
            }
            return session
        },
    },
})