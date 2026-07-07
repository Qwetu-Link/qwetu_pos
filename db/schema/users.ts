import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { roleTable } from "./roles";
import { businessTable } from "./business";

export const usersTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name"),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email").unique().notNull()
    .unique(),
  phone: varchar("phone", { length: 20 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: varchar("password_hash", { length: 255 }),
  // Tie the authenticated user straight into a business context
  businessId: uuid("business_id").references(() => businessTable.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").references(() => roleTable.id, { onDelete: "restrict" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date()),
})

// 1. The master registry of permissions available across your entire system
export const permissionTable = pgTable("permission", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., "invoice:create", "business:settings"
  description: varchar("description", { length: 255 }),      // Friendly text for your checkbox label
  group: varchar("group", { length: 50 }).notNull(),          // e.g., "Invoices", "Reports" (Great for grouping your UI checkboxes)
})

// 2. The Junction table tracking which Role holds which Permission
export const rolePermissionTable = pgTable(
  "role_permission",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roleTable.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissionTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({
      name: "role_permissions_pk",
      columns: [table.roleId, table.permissionId],
    }),
  })
)