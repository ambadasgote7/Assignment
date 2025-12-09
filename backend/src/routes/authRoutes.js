import express from "express";
import { register, login, changePassword } from "../controllers/authController.js";
import { validateSignup, validatePasswordOnly } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateSignup, register);
router.post("/login", login);
router.post("/change-password", auth, validatePasswordOnly, changePassword);
router.post("/logout", logout);

export default router;
