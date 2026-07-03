import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const businessProfileTable = pgTable("business_profile", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessName: varchar("business_name", {
        length: 255,
    }).notNull(),
    legalName: varchar("legal_name", {
        length: 255,
    }),
    registrationNumber: varchar("registration_number", {
        length: 100,
    }).notNull(),
    taxPin: varchar("tax_pin", {
        length: 50,
    }).notNull(),
    email: varchar("email", {
        length: 255,
    }).notNull(),
    phone: varchar("phone", {
        length: 20,
    }).notNull(),
    alternativePhone: varchar("alternative_phone", {
        length: 20,
    }),
    address: varchar("address", {
        length: 500,
    }),
    city: varchar("city", {
        length: 100,
    }),
    county: varchar("county", {
        length: 100,
    }),
    country: varchar("country", {
        length: 100,
    }).default("Kenya"),
    currency: varchar("currency", {
        length: 10,
    }).default("KES"),

    timezone: varchar("timezone", {
        length: 100,
    }).default("Africa/Nairobi"),

    logoPath: varchar("logo_path", {
        length: 1000,
    }),

    receiptFooter: varchar("receipt_footer", {
        length: 500,
    }),

    invoiceTerms: varchar("invoice_terms", {
        length: 1000,
    }),

    isActive: boolean("is_active")
        .default(true)
        .notNull(),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date()),
});