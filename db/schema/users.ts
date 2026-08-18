import {
  boolean,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { roleTable } from "./roles";
import { businessTable } from "./business";
import { randomUUID } from "crypto";

export const usersTable = mysqlTable("user", {
  id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
  name: varchar("name", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique().notNull()
    .unique(),
  phone: varchar("phone", { length: 20 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: varchar("password_hash", { length: 255 }),
  // Tie the authenticated user straight into a business context
  businessId: varchar("business_id", { length: 36 }).references(() => businessTable.id, { onDelete: "cascade" }),
  roleId: varchar("role_id", { length: 36 }).references(() => roleTable.id, { onDelete: "restrict" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date()),
})

// 1. The master registry of permissions available across your entire system
export const permissionTable = mysqlTable("permission", {
  id: varchar("id", { length: 36 }).$defaultFn(() => randomUUID()).primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., "invoice:create", "business:settings"
  description: varchar("description", { length: 255 }),      // Friendly text for your checkbox label
  group: varchar("group", { length: 50 }).notNull(),
  // e.g., "Invoices", "Reports" (Great for grouping your UI checkboxes)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// 2. The Junction table tracking which Role holds which Permission
export const rolePermissionTable = mysqlTable(
  "role_permission",
  {
    roleId: varchar("role_id", { length: 36 })
      .notNull()
      .references(() => roleTable.id, { onDelete: "cascade" }),
    permissionId: varchar("permission_id", { length: 36 })
      .notNull()
      .references(() => permissionTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.roleId, table.permissionId],
    }),
  })
)
