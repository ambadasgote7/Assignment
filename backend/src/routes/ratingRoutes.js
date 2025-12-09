import express from "express";
import { auth } from "../middleware/auth.js";
import { submitRating } from "../controllers/ratingController.js";

const router = express.Router();

router.use(auth);

router.post("/", submitRating);

export default router;
