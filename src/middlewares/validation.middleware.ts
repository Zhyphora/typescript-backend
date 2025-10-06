import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";

/**
 * Middleware untuk validasi request body menggunakan class-validator
 * @param dtoClass - Class DTO yang akan digunakan untuk validasi
 */
export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert plain object ke class instance
      const dtoInstance = plainToClass(dtoClass, req.body);

      // Validasi
      const errors: ValidationError[] = await validate(dtoInstance);

      if (errors.length > 0) {
        // Format error messages
        const errorMessages = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));

        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errorMessages,
        });
      }

      // Jika validasi sukses, replace req.body dengan validated DTO
      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
};
