import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "@auth/core/adapters"
import { usersTable } from "./users"

// -----------------------------------------------------------------------------
// 1. Business / Organization Core
// -----------------------------------------------------------------------------
export const businessTable = pgTable("business", {
    id: uuid("id").defaultRandom().primaryKey(),
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


export const accounts = pgTable(
    "account",
    {
        userId: uuid("user_id")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (table) => ({
        compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    })
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (table) => ({
        compositePk: primaryKey({ columns: [table.identifier, table.token] }),
    })
)