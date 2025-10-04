import express, { Application, Request, Response } from "express";
import { setupMiddlewares } from "./middlewares";
import routes from "./routes";
import { config } from "./config/env.config";
import { initializeDatabase } from "./config/database.config";
import { errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

// Setup middlewares
setupMiddlewares(app);

// Setup routes
app.use(routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler (harus di akhir, setelah semua routes)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start listening
    app.listen(config.app.port, () => {
      console.log(`🚀 Server is running on port ${config.app.port}`);
      console.log(`📝 Environment: ${config.app.env}`);
      console.log(
        `🔗 Health check: http://localhost:${config.app.port}/health`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
