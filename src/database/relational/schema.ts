import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  user_id: varchar("user_id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const files = pgTable("files", {
  file_id: varchar("file_id").primaryKey(),
  user_id: varchar("user_id")
    .references(() => user.user_id)
    .notNull(),
  file_name: text("file_name").notNull(),
  file_path: text("file_path").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
