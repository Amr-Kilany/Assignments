import { Router } from "express";
import * as usersService from "./users.service.js";
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router();

router.post("/signup", usersService.signup);
router.post("/login", usersService.login);

router.patch("/", auth, usersService.updateUser);
router.delete("/", auth, usersService.deleteUser);
router.get("/", auth, usersService.getUserData);

export default router;
