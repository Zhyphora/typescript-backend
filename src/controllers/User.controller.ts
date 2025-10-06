import { Request, Response } from "express";
import { AppDataSource } from "../config/database.config";
import { User } from "../models/User.model";
import { PasswordHelper } from "../utils/password.helper";
import { NotFoundError, ConflictError } from "../utils/errors";

export class UserController {
  // GET /api/users - Get all users (Protected route)
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        select: ["id", "name", "email", "isActive", "createdAt", "updatedAt"],
      });

      return res.status(200).json({
        status: "success",
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error retrieving users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/users/:id - Get user by ID (Protected route)
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id },
        select: ["id", "name", "email", "isActive", "createdAt", "updatedAt"],
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
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

  // POST /api/users - Create new user (Admin only - untuk sekarang public)
  // Note: Sebaiknya gunakan /api/auth/register untuk registrasi user biasa
  static async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Check if email already exists
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        throw new ConflictError("Email already exists");
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

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // PUT /api/users/:id - Update user (Protected route)
  static async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, isActive } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Check if email is being changed and already exists
      if (email && email !== user.email) {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
          throw new ConflictError("Email already exists");
        }
      }

      // Update user fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (typeof isActive === "boolean") user.isActive = isActive;

      await userRepository.save(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Error updating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // DELETE /api/users/:id - Delete user (Protected route - Admin only)
  static async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      await userRepository.remove(user);

      return res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Error deleting user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
