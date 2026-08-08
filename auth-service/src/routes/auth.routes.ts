import { Router } from "express";
import { AuthController } from "../controller/AuthController";

const router = Router();
const authController = new AuthController();

router.post("/register", (req, resp) => authController.register(req, resp));
router.post("/login", (req, resp) => authController.login(req, resp));

export default router;