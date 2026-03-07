import { mysqlEnum, mysqlTable, text, int, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["admin", "user"]).notNull().default("user"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex("users_email_unique").on(table.email),
  }),
);

const baseInsertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertMessageSchema = baseInsertMessageSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, "Name must contain at least 3 characters")
    .refine((val) => !/^\".*\"$/.test(val), {
      message: 'Name cannot be inside quotes like "John Doe"',
    }),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(3, "Message must contain at least 3 characters")
    .refine((val) => val !== "", {
      message: "Message cannot be empty or spaces",
    }),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type User = typeof users.$inferSelect;
