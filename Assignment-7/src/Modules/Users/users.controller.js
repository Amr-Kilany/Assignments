import { Router } from "express";
import * as userService from "./users.service.js";

const router = Router();
router.post("/signup", userService.signupUser);
router.put("/:id", userService.upsertUser);
router.get("/by-email", userService.getUserByEmail);
router.get("/:id", userService.getUserById);

export default router;
