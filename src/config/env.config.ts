import "dotenv/config";

export const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  database: {
    type: process.env.DB_TYPE || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "typescript_backend_db",
  },
  jwt: {
    secret: (process.env.JWT_SECRET || "default_secret") as string,
    expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as string | number,
  },
};
