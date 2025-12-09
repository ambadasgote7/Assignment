import express from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { getOwnerDashboard } from "../controllers/ownerController.js";

const router = express.Router();

router.use(auth, requireRole("OWNER"));

router.get("/dashboard", getOwnerDashboard);

export default router;
