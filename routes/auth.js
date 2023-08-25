import express from "express";
import {
  loginWithEmail,
  loginWithPhone,
  registerUser,
  verifyOtp,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login/email", loginWithEmail);
router.post("/login/phone", loginWithPhone);
router.post("/verifyOtp", verifyOtp);

export { router as authRoutes };
