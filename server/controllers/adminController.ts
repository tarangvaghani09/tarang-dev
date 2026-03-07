import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { storage } from "../storage";
import { comparePassword } from "../schema/User";

const querySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(["sent", "not_sent"]).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
const ADMIN_EMAIL = "tarangvaghani@gmail.com";

function toDayStart(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000`);
}

function toDayEnd(dateString: string): Date {
  return new Date(`${dateString}T23:59:59.999`);
}

export async function getAdminMessages(req: Request, res: Response) {
  try {
    const parsed = querySchema.parse(req.query);

    const result = await storage.getAdminMessages({
      startDate: parsed.startDate ? toDayStart(parsed.startDate) : undefined,
      endDate: parsed.endDate ? toDayEnd(parsed.endDate) : undefined,
      status: parsed.status,
      sort: parsed.sort,
      page: parsed.page,
      limit: parsed.limit,
    });

    return res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0]?.message ?? "Invalid query parameters",
      });
    }

    return res.status(500).json({ message: "Failed to fetch admin messages" });
  }
}

export async function adminLogin(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    if (email.toLowerCase() !== ADMIN_EMAIL) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserByEmail(ADMIN_EMAIL);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      email: user.email,
      role: "admin" as const,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0]?.message ?? "Invalid email" });
    }

    return res.status(500).json({ message: "Failed to login as admin" });
  }
}
