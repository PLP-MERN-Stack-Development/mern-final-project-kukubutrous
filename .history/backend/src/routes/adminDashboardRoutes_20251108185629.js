import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/adminDashboardController.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getDashboardStats);

export default router;
