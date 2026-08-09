import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { authenticate, AuthenticatedRequest } from "../middleware/auth-middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", (req, resp) => authController.register(req, resp));
router.post("/login", (req, resp) => authController.login(req, resp));

router.get("/me", authenticate, (req: AuthenticatedRequest, resp) => {
  return resp.status(200).json({user: req.user});
});
router.get("/verify", (req, resp) => authController.verifyEmail(req, resp));


export default router;