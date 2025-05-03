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
import { userTable } from "@/db/relational/schema/auth";
const iöwerw = {
  id: "1",
  title: "Technical Specification v1.0",
  fileType: "PDF",
  createdAt: new Date("2023-10-15"),
  isFavorite: true,
};
export const filesTable = pgTable("file", {
  fileId: uuid("file_id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  isFavorite: boolean("isFavorite").notNull().default(false),
  thumbnailPath: text("thumbnail_path"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messageRoleEnum = pgEnum("role", ["user", "assistant"]);

export const messageTable = pgTable("message", {
  messageId: uuid("message_id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .references(() => conversationTable.conversationId, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(),
  messageRole: messageRoleEnum("role").default("user").notNull(),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationTable = pgTable("conversation", {
  conversationId: uuid("conversation_id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  fileId: uuid("file_id")
    .references(() => filesTable.fileId)
    .notNull(),
  title: varchar("title").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationRelations = relations(
  conversationTable,
  ({ many }) => ({
    message: many(messageTable),
  }),
);
