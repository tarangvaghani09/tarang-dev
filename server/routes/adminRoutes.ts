import { Router } from "express";
import {
  getAdminDbSnapshot,
  getAdminMessages,
  smtpTest,
} from "../controllers/adminController";

const adminRoutes = Router();

adminRoutes.get("/messages", getAdminMessages);
adminRoutes.get("/db", getAdminDbSnapshot);
adminRoutes.get("/smtp-test", smtpTest);

export default adminRoutes;
