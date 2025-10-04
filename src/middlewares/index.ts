import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export const setupMiddlewares = (app: Application): void => {
  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(cors());

  // Logging middleware
  app.use(morgan("dev"));

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
