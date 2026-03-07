import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { storage } from "../storage";

type AdminJwtPayload = JwtPayload & {
  role?: string;
  email?: string;
};
const ADMIN_EMAIL = "tarangvaghani@gmail.com";

declare global {
  namespace Express {
    interface Request {
      user?: AdminJwtPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  if (typeof req.headers["x-access-token"] === "string") {
    return req.headers["x-access-token"];
  }

  return null;
}

export async function checkAdminRole(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractToken(req);
  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as AdminJwtPayload;
    const userEmail = payload.email;
    if (!userEmail) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    if (userEmail.toLowerCase() !== ADMIN_EMAIL) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const user = await storage.getUserByEmail(ADMIN_EMAIL);
    if (!user || user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    req.user = payload;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
