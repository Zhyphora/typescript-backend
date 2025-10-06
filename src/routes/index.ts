import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

const router = Router();

// API routes
router.use("/api/auth", authRoutes);
router.use("/api", userRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

export default router;
