import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { roleTable } from "./roles";
import { businessTable } from "./business";

export const businessTeamTable = pgTable("business_team", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businessTable.id, {
        onDelete: "cascade",
    }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),
  phone: varchar("phone", { length: 20 }),
  passwordHash: varchar("password_hash", {
    length: 255,
  }).notNull(),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roleTable.id, {
      onDelete: "restrict",
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