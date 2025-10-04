import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "./env.config";
import { User } from "../models/User.model";

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false, // Jangan gunakan true di production!
  logging: config.app.env === "development",
  entities: [User], // Tambahkan semua model di sini
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    process.exit(1);
  }
};
