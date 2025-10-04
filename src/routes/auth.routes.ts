import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { validateDto } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";

const router = Router();

// Public routes
router.post("/register", validateDto(CreateUserDto), AuthController.register);
router.post("/login", validateDto(LoginDto), AuthController.login);

// Protected routes
router.get("/me", authenticate, AuthController.getCurrentUser);

export default router;
