import { Router } from "express";
import { getAdminMessages } from "../controllers/adminController";

const adminRoutes = Router();

adminRoutes.get("/messages", getAdminMessages);

export default adminRoutes;
