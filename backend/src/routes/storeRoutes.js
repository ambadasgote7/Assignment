import express from "express";
import { auth } from "../middleware/auth.js";
import { listStoresForUser } from "../controllers/storeController.js";

const router = express.Router();

router.use(auth);

router.get("/", listStoresForUser);

export default router;
