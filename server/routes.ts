import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendContactNotificationEmail } from "./email";
import { checkAdminRole } from "./middleware/authMiddleware";
import { adminLogin } from "./controllers/adminController";
import adminRoutes from "./routes/adminRoutes";

const DEFAULT_ADMIN_EMAIL = "tarangvaghani@gmail.com";

async function seedDatabase() {
  try {
    await storage.normalizeUserPasswordHashes();
    await storage.ensureAdminUser(DEFAULT_ADMIN_EMAIL);
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database
  seedDatabase();
  app.post(api.admin.login.path, adminLogin);
  app.use("/api/admin", checkAdminRole, adminRoutes);

  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      const subject =
        typeof req.body?.subject === "string" ? req.body.subject : undefined;
      res.status(201).json(message);

      // Send email after responding so form submission stays fast.
      setImmediate(() => {
        void (async () => {
          try {
            await sendContactNotificationEmail({
              name: input.name,
              email: input.email,
              subject,
              message: input.message,
              submittedAt: new Date(),
            });
          } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            await storage.updateMessageStatus(message.id, "not_sent");
          }
        })();
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  return httpServer;
}
