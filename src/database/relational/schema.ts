import { pgTable, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "user",
  {
    user_id: varchar("user_id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIndex: index("user_id_idx").on(table.user_id),
  }),
);

export const files = pgTable(
  "files",
  {
    file_id: varchar("file_id").primaryKey(),
    user_id: varchar("user_id")
      .references(() => users.user_id)
      .notNull(),
    file_name: text("file_name").notNull(),
    file_path: text("file_path").notNull(),
    file_description: text("file_description").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    fileIDIndex: index("file_id_idx").on(table.file_id),
  }),
);

export const message = pgTable("message", {
  message_id: varchar("message_id").primaryKey(),
  chat_id: varchar("chat_id")
    .references(() => chat.chat_id)
    .notNull(),
  user_id: varchar("user_id")
    .references(() => users.user_id)
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
    .references(() => users.user_id)
    .notNull(),
  file_id: varchar("file_id")
    .references(() => files.file_id)
    .notNull(),
  title: varchar("title").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
