import { Router } from "express";
import { UserController } from "../controllers/User.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validation.middleware";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

const router = Router();

// User routes (Protected - memerlukan authentication)
router.get("/users", authenticate, UserController.getAllUsers);
router.get("/users/:id", authenticate, UserController.getUserById);
router.post("/users", validateDto(CreateUserDto), UserController.createUser);
router.put(
  "/users/:id",
  authenticate,
  validateDto(UpdateUserDto),
  UserController.updateUser
);
router.delete("/users/:id", authenticate, UserController.deleteUser);

export default router;
