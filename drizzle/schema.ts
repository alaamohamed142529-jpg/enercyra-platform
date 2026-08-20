import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const wasteReferenceData = mysqlTable("waste_reference_data", {
  id: int("id").autoincrement().primaryKey(),
  classId: varchar("classId", { length: 96 }).notNull().unique(),
  displayNameEn: varchar("displayNameEn", { length: 160 }).notNull(),
  displayNameAr: varchar("displayNameAr", { length: 160 }).notNull(),
  category: varchar("category", { length: 96 }).notNull(),
  priceEgpPerKg: decimal("priceEgpPerKg", { precision: 10, scale: 3 }),
  lhvMjPerKg: decimal("lhvMjPerKg", { precision: 10, scale: 3 }),
  combustible: boolean("combustible").default(false).notNull(),
  status: mysqlEnum("status", ["reference", "pending"]).default("pending").notNull(),
  sourceNote: text("sourceNote").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const wasteListings = mysqlTable("waste_listings", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  classId: varchar("classId", { length: 96 }).notNull(),
  displayNameEn: varchar("displayNameEn", { length: 160 }).notNull(),
  displayNameAr: varchar("displayNameAr", { length: 160 }).notNull(),
  weightKg: decimal("weightKg", { precision: 10, scale: 3 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  condition: varchar("condition", { length: 120 }),
  notes: text("notes"),
  imageUrl: text("imageUrl"),
  imageMetadata: text("imageMetadata"),
  status: mysqlEnum("status", ["active", "removed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type WasteReferenceData = typeof wasteReferenceData.$inferSelect;
export type InsertWasteReferenceData = typeof wasteReferenceData.$inferInsert;
export type WasteListing = typeof wasteListings.$inferSelect;
export type InsertWasteListing = typeof wasteListings.$inferInsert;
