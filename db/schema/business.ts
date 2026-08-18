import {
    mysqlTable,
    varchar,
    timestamp,
    int,
    boolean,
    primaryKey,
} from "drizzle-orm/mysql-core";
import type { AdapterAccountType } from "@auth/core/adapters"
import { usersTable } from "./users"
import { randomUUID } from "crypto";

// -----------------------------------------------------------------------------
// 1. Business / Organization Core
// -----------------------------------------------------------------------------
export const businessTable = mysqlTable("business", {
    id: varchar("id", { length: 36 })
        .$defaultFn(() => randomUUID())
        .primaryKey(),
    businessName: varchar("business_name", { length: 255 }).notNull(),
    legalName: varchar("legal_name", { length: 255 }),
    registrationNumber: varchar("registration_number", { length: 100 }).notNull(),
    taxPin: varchar("tax_pin", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    alternativePhone: varchar("alternative_phone", { length: 20 }),
    address: varchar("address", { length: 500 }),
    city: varchar("city", { length: 100 }),
    county: varchar("county", { length: 100 }),
    country: varchar("country", { length: 100 }).default("Kenya"),
    currency: varchar("currency", { length: 10 }).default("KES"),
    timezone: varchar("timezone", { length: 100 }).default("Africa/Nairobi"),
    logoPath: varchar("logo_path", { length: 1000 }),
    receiptFooter: varchar("receipt_footer", { length: 500 }),
    invoiceTerms: varchar("invoice_terms", { length: 1000 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})


export const accounts = mysqlTable(
    "account",
    {
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),
        type: varchar("type", { length: 255 }).$type<AdapterAccountType>().notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
        refresh_token: varchar("refresh_token", { length: 2048 }),
        access_token: varchar("access_token", { length: 2048 }),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 2048 }),
        id_token: varchar("id_token", { length: 4096 }),
        session_state: varchar("session_state", { length: 255 }),
    },
    (table) => ({
        compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    })
)

export const sessions = mysqlTable("session", {
    sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = mysqlTable(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (table) => ({
        compositePk: primaryKey({ columns: [table.identifier, table.token] }),
    })
)
