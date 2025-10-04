import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

/**
 * Global error handler middleware
 * Harus diletakkan setelah semua routes
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error untuk debugging
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError (operational errors)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: error.message,
      stack: error.stack,
    }),
  });
};

/**
 * Async handler wrapper untuk menangkap errors dari async functions
 * Alternatif dari try-catch di setiap controller method
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
