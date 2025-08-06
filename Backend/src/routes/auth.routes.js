import express from "express";
import {
  login,
  register,
  getMe,
  refreshTokenHandler,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/user.schema.js";

const router = express.Router();

router.post("/signup", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/refresh", refreshTokenHandler);
router.get("/me", authenticate, getMe);

export default router;
