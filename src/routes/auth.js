import express from "express";
import { login, register, resetPassword } from "../controllers/auth";

const router = express.Router();

router.post("/admin-reg", register);
router.post("/admin-login", login);
router.post("/admin-reset-password", resetPassword);

export default router;
