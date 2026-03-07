import { db } from "./db";
import { and, asc, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { hashPasswordForSave, isPasswordHashed } from "./schema/User";
import {
  messages,
  users,
  type Message,
  type InsertMessage,
  type User,
} from "@shared/schema";

export interface IStorage {
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: "pending" | "sent" | "not_sent"): Promise<void>;
  normalizeUserPasswordHashes(): Promise<void>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: {
    email: string;
    password: string;
    role?: "admin" | "user";
  }): Promise<User>;
  ensureAdminUser(email: string): Promise<User>;
  getAdminMessages(params: {
    startDate?: Date;
    endDate?: Date;
    status?: "sent" | "not_sent";
    sort?: "newest" | "oldest";
    page: number;
    limit: number;
  }): Promise<{
    items: Message[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats: {
      sent: number;
      notSent: number;
    };
  }>;
}

export class DatabaseStorage implements IStorage {
  async createMessage(message: InsertMessage): Promise<Message> {
    const [insertResult] = await db
      .insert(messages)
      .values({ ...message, status: "pending" })
      .$returningId();
    const insertedId = insertResult?.id;
    if (insertedId === undefined) {
      throw new Error("Failed to create message");
    }

    const [newMessage] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, insertedId))
      .limit(1);

    if (!newMessage) {
      throw new Error("Failed to fetch created message");
    }

    return newMessage;
  }

  async updateMessageStatus(id: number, status: "pending" | "sent" | "not_sent"): Promise<void> {
    await db
      .update(messages)
      .set({ status })
      .where(eq(messages.id, id));
  }

  async normalizeUserPasswordHashes(): Promise<void> {
    const allUsers = await db.select().from(users);

    for (const user of allUsers) {
      if (!isPasswordHashed(user.password)) {
        const hashedPassword = await hashPasswordForSave(user.password);
        await db
          .update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, user.id));
      }
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  async createUser(user: {
    email: string;
    password: string;
    role?: "admin" | "user";
  }): Promise<User> {
    const passwordHash = await hashPasswordForSave(user.password);
    const [insertResult] = await db.insert(users).values({
      email: user.email,
      password: passwordHash,
      role: user.role ?? "user",
    }).$returningId();

    const insertedId = insertResult?.id;
    if (insertedId === undefined) {
      throw new Error("Failed to create user");
    }

    const [createdUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, insertedId))
      .limit(1);

    if (!createdUser) {
      throw new Error("Failed to fetch created user");
    }

    return createdUser;
  }

  async ensureAdminUser(email: string): Promise<User> {
    const existing = await this.getUserByEmail(email);
    if (!existing) {
      return this.createUser({
        email,
        // Placeholder random plaintext; createUser hashes before insert.
        password: randomUUID(),
        role: "admin",
      });
    }

    if (existing.role !== "admin") {
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.id, existing.id));

      const updated = await this.getUserByEmail(email);
      if (!updated) {
        throw new Error("Failed to load ensured admin user");
      }
      return updated;
    }

    return existing;
  }

  async getAdminMessages(params: {
    startDate?: Date;
    endDate?: Date;
    status?: "sent" | "not_sent";
    sort?: "newest" | "oldest";
    page: number;
    limit: number;
  }): Promise<{
    items: Message[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats: {
      sent: number;
      notSent: number;
    };
  }> {
    const { startDate, endDate, status, sort = "newest", page, limit } = params;
    const filters = [];
    const dateFilters = [];

    if (startDate) {
      filters.push(gte(messages.createdAt, startDate));
      dateFilters.push(gte(messages.createdAt, startDate));
    }
    if (endDate) {
      filters.push(lte(messages.createdAt, endDate));
      dateFilters.push(lte(messages.createdAt, endDate));
    }
    if (status === "sent") {
      filters.push(eq(messages.status, "sent"));
    }
    if (status === "not_sent") {
      filters.push(
        or(
          eq(messages.status, "not_sent"),
          eq(messages.status, "failed"),
          eq(messages.status, "pending"),
        ),
      );
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;
    const dateWhereClause = dateFilters.length > 0 ? and(...dateFilters) : undefined;
    const offset = (page - 1) * limit;
    const orderByClause =
      sort === "oldest"
        ? [asc(messages.createdAt), asc(messages.id)]
        : [desc(messages.createdAt), desc(messages.id)];

    const items = await db
      .select()
      .from(messages)
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    const [countRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(whereClause);

    const total = Number(countRow?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const [statsRow] = await db
      .select({
        sent: sql<number>`coalesce(sum(case when ${messages.status} = 'sent' then 1 else 0 end), 0)`,
        notSent: sql<number>`coalesce(sum(case when ${messages.status} in ('not_sent', 'failed', 'pending') then 1 else 0 end), 0)`,
      })
      .from(messages)
      .where(dateWhereClause);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      stats: {
        sent: Number(statsRow?.sent ?? 0),
        notSent: Number(statsRow?.notSent ?? 0),
      },
    };
  }

}

export const storage = new DatabaseStorage();
