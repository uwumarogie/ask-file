import {
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import * as z from "zod";

export const userTable = pgTable("user", {
  user_id: uuid("user_id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const filesTable = pgTable("file", {
  file_id: uuid("file_id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => userTable.user_id, { onDelete: "cascade" })
    .notNull(),
  file_name: text("file_name").notNull(),
  file_path: text("file_path").notNull(),
  isFavorite: boolean("isFavorite").notNull().default(false),
  thumbnail_path: text("thumbnail_path"),
  created_at: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

const messageRoleSchema = z.enum(["system", "user", "assistant"]);
export const messageRoleEnum = pgEnum(
  "message_role",
  messageRoleSchema.options,
);

export const messageTable = pgTable("message", {
  message_id: uuid("message_id").defaultRandom().primaryKey(),
  chat_id: uuid("chat_id")
    .references(() => conversationTable.chat_id, { onDelete: "cascade" })
    .notNull(),
  user_id: uuid("user_id")
    .references(() => userTable.user_id, { onDelete: "cascade" })
    .notNull(),
  message_role: messageRoleEnum("message_role").notNull(),
  content: varchar("content").notNull(),
  created_at: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationTable = pgTable("chat", {
  chat_id: uuid("chat_id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => userTable.user_id, { onDelete: "cascade" })
    .notNull(),
  file_id: uuid("file_id")
    .references(() => filesTable.file_id)
    .notNull(),
  title: varchar("title").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const chatRelations = relations(conversationTable, ({ many }) => ({
  message: many(messageTable),
}));
