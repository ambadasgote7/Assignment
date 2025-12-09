import express from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import {
  getDashboardStats,
  createUser,
  createStore,
  listUsers,
  getUserDetails,
  listStores
} from "../controllers/adminController.js";
import { validateSignup } from "../middleware/validate.js";

const router = express.Router();

router.use(auth, requireRole("ADMIN"));

router.get("/dashboard", getDashboardStats);
router.post("/users", validateSignup, createUser);
router.get("/users", listUsers);
router.get("/users/:id", getUserDetails);
router.post("/stores", createStore);
router.get("/stores", listStores);

export default router;
