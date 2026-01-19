import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "123123";

/**
 * Authentication middleware for protected routes
 * Validates JWT token from Authorization header
 */
export function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("[Auth] No authorization header provided");
    return res.status(401).json({ message: "Authorization header required" });
  }

  const token = authHeader.split(" ")[1] ?? "";

  if (!token) {
    console.warn("[Auth] No token in authorization header");
    return res.status(401).json({ message: "Invalid authorization header format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded !== "object" || !("userId" in decoded)) {
      console.warn("[Auth] Invalid token structure");
      return res.status(401).json({ message: "Invalid token" });
    }

    (req as any).userId = decoded.userId;
    console.log(`[Auth] Token verified for user: ${decoded.userId}`);
    next();
  } catch (error) {
    console.error("[Auth] Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });  }
}