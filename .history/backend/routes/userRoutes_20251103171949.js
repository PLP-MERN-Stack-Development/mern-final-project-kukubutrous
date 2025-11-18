import express from "express";
import { registerUser, loginUser, updateProfile, getMatches } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", protect, updateProfile);
router.get("/matches", protect, getMatches);

export default router;
