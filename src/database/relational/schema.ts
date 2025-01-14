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

export const message = pgTable("message", {
  message_id: varchar("message_id").primaryKey(),
  chat_id: varchar("chat_id")
    .references(() => chat.chat_id)
    .notNull(),
  user_id: varchar("user_id")
    .references(() => user.user_id)
    .notNull(),
  file_id: varchar("file_id")
    .references(() => files.file_id)
    .notNull(),
  content: varchar("content").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const chat = pgTable("chat", {
  chat_id: varchar("chat_id").primaryKey(),
  user_id: varchar("user_id")
    .references(() => user.user_id)
    .notNull(),
  file_id: varchar("file_id")
    .references(() => files.file_id)
    .notNull(),
  title: varchar("title").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
