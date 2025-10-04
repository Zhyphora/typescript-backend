import jwt from "jsonwebtoken";
import { config } from "../config/env.config";

export interface JwtPayload {
  userId: string;
  email: string;
}

export class JwtHelper {
  /**
   * Generate JWT token
   * @param payload - Data yang akan di-encode ke token
   * @returns JWT token string
   */
  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
  }

  /**
   * Verify dan decode JWT token
   * @param token - JWT token string
   * @returns Decoded payload atau null jika invalid
   */
  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract token dari Authorization header
   * @param authHeader - Authorization header value
   * @returns Token string atau null
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.substring(7);
  }
}
