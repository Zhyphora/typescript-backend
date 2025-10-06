import { Request, Response } from "express";
import { AppDataSource } from "../config/database.config";
import { User } from "../models/User.model";
import { PasswordHelper } from "../utils/password.helper";
import { JwtHelper } from "../utils/jwt.helper";
import { AppError } from "../utils/errors";

export class AuthController {
  /**
   * POST /api/auth/register - Register new user
   */
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Check if email already exists
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        throw new AppError("Email already exists", 409);
      }

      // Hash password
      const hashedPassword = await PasswordHelper.hashPassword(password);

      // Create new user
      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      // Generate JWT token
      const token = JwtHelper.generateToken({
        userId: newUser.id,
        email: newUser.email,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Error registering user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * POST /api/auth/login - Login user
   */
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Find user by email
      const user = await userRepository.findOneBy({ email });
      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError("Account is inactive", 403);
      }

      // Verify password
      const isPasswordValid = await PasswordHelper.verifyPassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
      }

      // Generate JWT token
      const token = JwtHelper.generateToken({
        userId: user.id,
        email: user.email,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Error logging in",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/auth/me - Get current user info (protected route)
   */
  static async getCurrentUser(req: any, res: Response): Promise<Response> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: req.user.userId });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Error retrieving user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
