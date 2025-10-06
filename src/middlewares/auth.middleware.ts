import { Request, Response, NextFunction } from "express";
import { JwtHelper } from "../utils/jwt.helper";
import { AppDataSource } from "../config/database.config";
import { User } from "../models/User.model";

/**
 * Interface untuk extend Express Request dengan user info
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Middleware untuk autentikasi JWT
 * Middleware ini akan memverifikasi token dan menambahkan user info ke request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token dari Authorization header
    const token = JwtHelper.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Authentication token is required",
      });
    }

    // Verify token
    const payload = JwtHelper.verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    // Check if user still exists and is active
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: payload.userId, isActive: true },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found or inactive",
      });
    }

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
