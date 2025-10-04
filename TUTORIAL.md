# 📚 Tutorial Lengkap: Membuat Backend TypeScript dengan MVC Pattern

Tutorial ini akan memandu Anda membuat backend TypeScript dari awal dengan arsitektur MVC, migration database, dan environment variables.

---

## 🎯 Apa yang Akan Dibuat?

Backend API dengan fitur:

- ✅ **Arsitektur MVC** (Model-View-Controller)
- ✅ **TypeScript** untuk type safety
- ✅ **Express.js** sebagai web framework
- ✅ **TypeORM** untuk ORM dan database migration
- ✅ **PostgreSQL** sebagai database
- ✅ **Environment Variables** untuk konfigurasi
- ✅ **CRUD API** untuk User management

---

## 📋 Prasyarat

Pastikan sudah terinstall:

- **Node.js** (v18 atau lebih baru)
- **npm** atau **yarn**
- **PostgreSQL** (sudah running)
- **Git** (opsional)
- **Code Editor** (VS Code, WebStorm, dll)

---

## 🚀 Langkah 1: Inisialisasi Proyek

### 1.1 Buat Folder Proyek

```bash
mkdir typescript-backend
cd typescript-backend
```

### 1.2 Inisialisasi npm

```bash
npm init -y
```

Ini akan membuat file `package.json` dasar.

---

## 📦 Langkah 2: Install Dependencies

### 2.1 Install Dependencies Utama

```bash
npm install express dotenv typeorm pg reflect-metadata cors helmet morgan
```

**Penjelasan:**

- `express` - Web framework untuk Node.js
- `dotenv` - Untuk membaca environment variables dari file .env
- `typeorm` - ORM (Object-Relational Mapping) dan migration tool
- `pg` - PostgreSQL driver untuk Node.js
- `reflect-metadata` - Diperlukan oleh TypeORM untuk decorators
- `cors` - Middleware untuk menghandle Cross-Origin Resource Sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logger

### 2.2 Install Dev Dependencies (untuk development)

```bash
npm install --save-dev typescript @types/node @types/express @types/cors @types/morgan ts-node nodemon
```

**Penjelasan:**

- `typescript` - TypeScript compiler
- `@types/*` - Type definitions untuk TypeScript
- `ts-node` - Untuk menjalankan TypeScript tanpa compile dulu
- `nodemon` - Auto-restart server saat ada perubahan file

---

## ⚙️ Langkah 3: Konfigurasi TypeScript

### 3.1 Buat file `tsconfig.json`

```bash
touch tsconfig.json
```

### 3.2 Isi file `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Penjelasan konfigurasi penting:**

- `experimentalDecorators: true` - Diperlukan untuk TypeORM decorators
- `emitDecoratorMetadata: true` - Diperlukan untuk TypeORM decorators
- `strictPropertyInitialization: false` - Agar tidak error pada model TypeORM

---

## 📝 Langkah 4: Konfigurasi Nodemon

### 4.1 Buat file `nodemon.json`

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/server.ts"
}
```

**Penjelasan:**

- Watch folder `src` untuk perubahan
- Restart otomatis jika ada file `.ts` yang berubah
- Jalankan `src/server.ts` sebagai entry point

---

## 🗂️ Langkah 5: Buat Struktur Folder

### 5.1 Buat folder struktur

```bash
mkdir -p src/config
mkdir -p src/models
mkdir -p src/controllers
mkdir -p src/routes
mkdir -p src/middlewares
mkdir -p src/migrations
```

**Penjelasan struktur:**

- `config/` - File konfigurasi (database, env, dll)
- `models/` - Entity/Model database
- `controllers/` - Business logic dan handler request
- `routes/` - Definisi endpoint API
- `middlewares/` - Custom middleware
- `migrations/` - Database migration files

---

## 🔐 Langkah 6: Setup Environment Variables

### 6.1 Buat file `.env.example` (template)

```bash
touch .env.example
```

Isi:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name

# JWT (untuk autentikasi di masa depan)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

### 6.2 Buat file `.env` (aktual - jangan commit ke git!)

```bash
cp .env.example .env
```

Lalu edit `.env` dengan kredensial database Anda:

```env
NODE_ENV=development
PORT=3000

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=Testing1
DB_DATABASE=typescript-backend

JWT_SECRET=super_secret_key_123
JWT_EXPIRES_IN=24h
```

### 6.3 Buat `.gitignore`

```bash
touch .gitignore
```

Isi:

```
node_modules
dist
.env
*.log
.DS_Store
```

---

## 🔧 Langkah 7: Buat File Konfigurasi

### 7.1 Buat `src/config/env.config.ts`

File ini untuk membaca environment variables:

```typescript
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
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
};
```

### 7.2 Buat `src/config/database.config.ts`

File ini untuk konfigurasi koneksi database TypeORM:

```typescript
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
```

**Penjelasan:**

- `synchronize: false` - Kita pakai migration, bukan auto-sync
- `logging: true` - Log semua query SQL (untuk development)
- `entities` - Daftar semua model/entity
- `migrations` - Path ke folder migration

---

## 🗄️ Langkah 8: Buat Model (Entity)

### 8.1 Buat `src/models/User.model.ts`

Model untuk tabel users:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Penjelasan Decorators:**

- `@Entity('users')` - Nama tabel di database
- `@PrimaryGeneratedColumn('uuid')` - Primary key dengan UUID
- `@Column()` - Kolom biasa
- `@CreateDateColumn()` - Auto-set saat insert
- `@UpdateDateColumn()` - Auto-update saat update

---

## 🔄 Langkah 9: Buat Database Migration

### 9.1 Update `package.json` scripts

Tambahkan scripts untuk migration:

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run -d src/config/database.config.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/config/database.config.ts",
    "migration:create": "npm run typeorm -- migration:create"
  }
}
```

### 9.2 Buat file migration manual

Buat file `src/migrations/1696400000000-CreateUsersTable.ts`:

```typescript
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1696400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
          },
          {
            name: "email",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // Enable UUID extension if not already enabled
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
```

**Penjelasan:**

- `up()` - Jalankan saat migration run (membuat tabel)
- `down()` - Jalankan saat migration revert (hapus tabel)

### 9.3 Jalankan Migration

```bash
npm run migration:run
```

Output yang diharapkan:

```
Migration CreateUsersTable1696400000000 has been executed successfully.
```

---

## 🎮 Langkah 10: Buat Controller

### 10.1 Buat `src/controllers/User.controller.ts`

Controller untuk handle logic CRUD User:

```typescript
import { Request, Response } from "express";
import { AppDataSource } from "../config/database.config";
import { User } from "../models/User.model";

export class UserController {
  // GET /api/users - Get all users
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/users/:id - Get user by ID
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/users - Create new user
  static async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      // Basic validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      const userRepository = AppDataSource.getRepository(User);

      // Check if email already exists
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Create new user
      const newUser = userRepository.create({
        name,
        email,
        password, // Note: Dalam production, password harus di-hash!
      });

      await userRepository.save(newUser);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // PUT /api/users/:id - Update user
  static async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, isActive } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update user fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (typeof isActive === "boolean") user.isActive = isActive;

      await userRepository.save(user);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error updating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // DELETE /api/users/:id - Delete user
  static async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      await userRepository.remove(user);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
```

**Penjelasan:**

- Setiap method adalah `static` agar bisa dipanggil tanpa instance
- Setiap method return JSON response dengan format konsisten
- Ada error handling di setiap method
- Menggunakan `AppDataSource.getRepository()` untuk akses database

---

## 🛣️ Langkah 11: Buat Routes

### 11.1 Buat `src/routes/user.routes.ts`

Routes untuk User endpoints:

```typescript
import { Router } from "express";
import { UserController } from "../controllers/User.controller";

const router = Router();

// User routes
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;
```

### 11.2 Buat `src/routes/index.ts`

Main router yang menggabungkan semua routes:

```typescript
import { Router } from "express";
import userRoutes from "./user.routes";

const router = Router();

// API routes
router.use("/api", userRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

export default router;
```

---

## 🛡️ Langkah 12: Buat Middleware

### 12.1 Buat `src/middlewares/index.ts`

Setup middleware untuk security, logging, dll:

```typescript
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
```

**Penjelasan middleware:**

- `helmet()` - Set security headers
- `cors()` - Enable CORS untuk frontend
- `morgan('dev')` - Log HTTP requests
- `express.json()` - Parse JSON body
- `express.urlencoded()` - Parse URL-encoded body

---

## 🚀 Langkah 13: Buat Server Entry Point

### 13.1 Buat `src/server.ts`

File utama untuk menjalankan server:

```typescript
import express, { Application, Request, Response } from "express";
import { setupMiddlewares } from "./middlewares";
import routes from "./routes";
import { config } from "./config/env.config";
import { initializeDatabase } from "./config/database.config";

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
```

---

## 🏃 Langkah 14: Jalankan Aplikasi

### 14.1 Pastikan PostgreSQL berjalan

```bash
# Check status PostgreSQL (macOS)
brew services list

# Start PostgreSQL jika belum running
brew services start postgresql
```

### 14.2 Buat database di PostgreSQL

Anda bisa menggunakan database client seperti:

- pgAdmin
- DBeaver
- TablePlus
- atau psql command line

### 14.3 Jalankan development server

```bash
npm run dev
```

Output yang diharapkan:

```
✅ Database connected successfully!
🚀 Server is running on port 3000
📝 Environment: development
🔗 Health check: http://localhost:3000/health
```

---

## 🧪 Langkah 15: Test API

### 15.1 Test dengan cURL atau Postman

**1. Health Check**

```bash
curl http://localhost:3000/health
```

**2. Create User**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**3. Get All Users**

```bash
curl http://localhost:3000/api/users
```

**4. Get User by ID**

```bash
curl http://localhost:3000/api/users/{USER_ID}
```

**5. Update User**

```bash
curl -X PUT http://localhost:3000/api/users/{USER_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "isActive": false
  }'
```

**6. Delete User**

```bash
curl -X DELETE http://localhost:3000/api/users/{USER_ID}
```

---

## 📊 Struktur Folder Akhir

```
typescript-backend/
├── node_modules/           # Dependencies (auto-generated)
├── src/
│   ├── config/
│   │   ├── env.config.ts       # Environment variables config
│   │   └── database.config.ts  # Database connection
│   ├── controllers/
│   │   └── User.controller.ts  # User business logic
│   ├── models/
│   │   └── User.model.ts       # User entity
│   ├── routes/
│   │   ├── index.ts            # Main router
│   │   └── user.routes.ts      # User routes
│   ├── middlewares/
│   │   └── index.ts            # Middleware setup
│   ├── migrations/
│   │   └── 1696400000000-CreateUsersTable.ts
│   └── server.ts               # Entry point
├── dist/                   # Compiled JS (auto-generated)
├── .env                    # Environment variables (jangan commit!)
├── .env.example            # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies & scripts
├── package-lock.json      # Lock file
├── tsconfig.json          # TypeScript config
├── nodemon.json           # Nodemon config
└── README.md              # Project documentation
```

---

## 🔄 Command Reference

### Development

```bash
npm run dev              # Jalankan server dengan hot reload
npm run build            # Compile TypeScript ke JavaScript
npm start                # Jalankan compiled server (production)
```

### Migration

```bash
npm run migration:run    # Jalankan migration
npm run migration:revert # Rollback migration terakhir
```

---

## 📚 Konsep MVC yang Digunakan

### Model (M)

- **Location**: `src/models/`
- **Purpose**: Representasi struktur data & database schema
- **Example**: `User.model.ts` - definisi tabel users dengan TypeORM

### View (V)

- **Location**: Response JSON dari Controller
- **Purpose**: Format data yang dikirim ke client
- **Example**:

```typescript
{
  success: true,
  message: 'User created successfully',
  data: user
}
```

### Controller (C)

- **Location**: `src/controllers/`
- **Purpose**: Business logic & handle request/response
- **Example**: `UserController` - handle CRUD operations untuk User

### Routes

- **Location**: `src/routes/`
- **Purpose**: Mapping URL ke Controller method
- **Example**: `GET /api/users` → `UserController.getAllUsers()`

---

## 🎓 Yang Sudah Dipelajari

✅ Setup project TypeScript dari awal
✅ Konfigurasi TypeORM dengan PostgreSQL
✅ Membuat dan menjalankan database migration
✅ Implementasi MVC pattern
✅ Setup environment variables dengan dotenv
✅ Membuat CRUD API dengan Express
✅ Error handling yang proper
✅ Security dengan Helmet & CORS
✅ Logging dengan Morgan

---

## 🚀 Next Steps (Pengembangan Lanjutan)

1. **Authentication & Authorization**

   - Implement JWT authentication
   - Password hashing dengan bcrypt
   - Role-based access control

2. **Validation**

   - Install `class-validator`
   - Validate request body

3. **Error Handling**

   - Global error handler middleware
   - Custom error classes

4. **Testing**

   - Unit testing dengan Jest
   - Integration testing
   - E2E testing

5. **Documentation**

   - API documentation dengan Swagger
   - Generate OpenAPI spec

6. **Deployment**
   - Docker containerization
   - Deploy ke cloud (AWS, Azure, Heroku)
   - CI/CD pipeline

---

## 📖 Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeORM Documentation](https://typeorm.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## ❓ Troubleshooting

### Error: "Cannot find module 'typeorm'"

**Solusi**: Jalankan `npm install`

### Error: "database does not exist"

**Solusi**: Buat database di PostgreSQL dulu sebelum migration

### Error: "Port 3000 already in use"

**Solusi**:

- Ganti PORT di `.env`
- Atau kill process yang menggunakan port 3000

### Migration error

**Solusi**:

- Pastikan database credentials di `.env` benar
- Pastikan PostgreSQL running
- Check database connection

---

## 🔒 Langkah 16: Implementasi Security Features (ADVANCED)

Sekarang kita akan menambahkan 4 fitur security penting untuk production-ready backend.

### 16.1 Install Security Dependencies

```bash
npm install bcrypt jsonwebtoken class-validator class-transformer
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

**Penjelasan Dependencies:**

- `bcrypt` - Password hashing yang aman
- `jsonwebtoken` - JWT token generation dan verification
- `class-validator` - Validation dengan decorators
- `class-transformer` - Transform plain objects to class instances

---

### 16.2 Password Hashing dengan bcrypt

Buat file `src/utils/password.helper.ts`:

```typescript
import bcrypt from "bcrypt";

export class PasswordHelper {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash password menggunakan bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password dengan hash yang tersimpan
   * @param password - Plain text password
   * @param hashedPassword - Hashed password dari database
   * @returns true jika password cocok, false jika tidak
   */
  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
```

**Cara Penggunaan:**

```typescript
// Hash password sebelum save ke database
const hashedPassword = await PasswordHelper.hashPassword("password123");

// Verify password saat login
const isValid = await PasswordHelper.verifyPassword(
  "password123",
  hashedPassword
);
```

---

### 16.3 JWT Helper untuk Authentication

Buat file `src/utils/jwt.helper.ts`:

```typescript
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
```

---

### 16.4 Custom Error Classes

Buat file `src/utils/errors.ts`:

```typescript
/**
 * Base class untuk custom application errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error untuk resource tidak ditemukan (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);xwx`
  }
}

/**
 * Error untuk validasi gagal (400)
 */
export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400);
  }
}

/**
 * Error untuk authentication gagal (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401);
  }
}

/**
 * Error untuk forbidden access (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403);
  }
}

/**
 * Error untuk conflict (409)
 */
export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409);
  }
}
```

---

### 16.5 Global Error Handler Middleware

Buat file `src/middlewares/error.middleware.ts`:

```typescript
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
```

**Update `src/server.ts`** - Tambahkan error handler:

```typescript
import { errorHandler } from "./middlewares/error.middleware";

// ... existing code ...

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler (harus di akhir, setelah semua routes)
app.use(errorHandler);
```

---

### 16.6 Validation dengan class-validator

Buat file `src/dtos/user.dto.ts`:

```typescript
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from "class-validator";

/**
 * DTO untuk membuat user baru
 */
export class CreateUserDto {
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;
}

/**
 * DTO untuk update user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Email must be a valid email address" })
  email?: string;

  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;
}

/**
 * DTO untuk login
 */
export class LoginDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  password: string;
}
```

Buat file `src/middlewares/validation.middleware.ts`:

```typescript
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
          success: false,
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
```

---

### 16.7 Authentication Middleware

Buat file `src/middlewares/auth.middleware.ts`:

```typescript
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
        success: false,
        message: "Authentication token is required",
      });
    }

    // Verify token
    const payload = JwtHelper.verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
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
        success: false,
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
```

---

### 16.8 Authentication Controller

Buat file `src/controllers/Auth.controller.ts`:

```typescript
import { Request, Response } from "express";
import { AppDataSource } from "../config/database.config";
import { User } from "../models/User.model";
import { PasswordHelper } from "../utils/password.helper";
import { JwtHelper } from "../utils/jwt.helper";
import { AppError } from "../utils/errors";

export class AuthController {
  /**
   * POST /api/auth/register - Register new user
   */
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Check if email already exists
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        throw new AppError("Email already exists", 409);
      }

      // Hash password
      const hashedPassword = await PasswordHelper.hashPassword(password);

      // Create new user
      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      // Generate JWT token
      const token = JwtHelper.generateToken({
        userId: newUser.id,
        email: newUser.email,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error registering user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * POST /api/auth/login - Login user
   */
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Find user by email
      const user = await userRepository.findOneBy({ email });
      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError("Account is inactive", 403);
      }

      // Verify password
      const isPasswordValid = await PasswordHelper.verifyPassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
      }

      // Generate JWT token
      const token = JwtHelper.generateToken({
        userId: user.id,
        email: user.email,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error logging in",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/auth/me - Get current user info (protected route)
   */
  static async getCurrentUser(req: any, res: Response): Promise<Response> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: req.user.userId });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error retrieving user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
```

---

### 16.9 Authentication Routes

Buat file `src/routes/auth.routes.ts`:

```typescript
import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { validateDto } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";

const router = Router();

// Public routes
router.post("/register", validateDto(CreateUserDto), AuthController.register);
router.post("/login", validateDto(LoginDto), AuthController.login);

// Protected routes
router.get("/me", authenticate, AuthController.getCurrentUser);

export default router;
```

---

### 16.10 Update User Controller dengan Security

Update `src/controllers/User.controller.ts`:

```typescript
import { Request, Response } from "express";
import { AppDataSource } from "../config/database.config";
import { User } from "../models/User.model";
import { PasswordHelper } from "../utils/password.helper";
import { NotFoundError, ConflictError } from "../utils/errors";

export class UserController {
  // GET /api/users - Get all users (Protected route)
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        select: ["id", "name", "email", "isActive", "createdAt", "updatedAt"],
      });

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/users/:id - Get user by ID (Protected route)
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id },
        select: ["id", "name", "email", "isActive", "createdAt", "updatedAt"],
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error retrieving user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/users - Create new user
  static async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Check if email already exists
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        throw new ConflictError("Email already exists");
      }

      // Hash password
      const hashedPassword = await PasswordHelper.hashPassword(password);

      // Create new user
      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // PUT /api/users/:id - Update user (Protected route)
  static async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, isActive } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Check if email is being changed and already exists
      if (email && email !== user.email) {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
          throw new ConflictError("Email already exists");
        }
      }

      // Update user fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (typeof isActive === "boolean") user.isActive = isActive;

      await userRepository.save(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // DELETE /api/users/:id - Delete user (Protected route)
  static async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      await userRepository.remove(user);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error deleting user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
```

---

### 16.11 Update User Routes dengan Validation & Auth

Update `src/routes/user.routes.ts`:

```typescript
import { Router } from "express";
import { UserController } from "../controllers/User.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validation.middleware";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

const router = Router();

// User routes (Protected - memerlukan authentication)
router.get("/users", authenticate, UserController.getAllUsers);
router.get("/users/:id", authenticate, UserController.getUserById);
router.post("/users", validateDto(CreateUserDto), UserController.createUser);
router.put(
  "/users/:id",
  authenticate,
  validateDto(UpdateUserDto),
  UserController.updateUser
);
router.delete("/users/:id", authenticate, UserController.deleteUser);

export default router;
```

---

### 16.12 Update Main Routes

Update `src/routes/index.ts`:

```typescript
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
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

export default router;
```

---

### 16.13 Update Environment Config

Update `src/config/env.config.ts` untuk type yang lebih baik:

```typescript
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
```

---

## 🧪 Langkah 17: Test Security Features

### 17.1 Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 17.2 Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 17.3 Test Protected Route

```bash
# Get token dari login/register response
TOKEN="your_jwt_token_here"

# Access protected route
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### 17.4 Test Get Current User

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 17.5 Test Validation Error

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "123"
  }'
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "constraints": {
        "isEmail": "Email must be a valid email address"
      }
    },
    {
      "field": "password",
      "constraints": {
        "minLength": "Password must be at least 6 characters long"
      }
    }
  ]
}
```

### 17.6 Test Unauthorized Access

```bash
# Tanpa token
curl http://localhost:3000/api/users
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

---

## 📊 Security Features Summary

### ✅ Yang Telah Diimplementasikan:

1. **Password Hashing dengan bcrypt**

   - Salt rounds 10
   - Secure password storage
   - Password verification

2. **JWT Authentication**

   - Token generation
   - Token verification
   - Protected routes
   - Authorization header parsing

3. **Request Validation**

   - DTO-based validation
   - Decorator validation rules
   - Clear error messages
   - Type safety

4. **Global Error Handling**
   - Custom error classes
   - Centralized error handler
   - Consistent error responses
   - Development vs production modes

### 🔒 API Endpoints:

**Public Endpoints:**

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login dan dapat token

**Protected Endpoints (perlu token):**

- `GET /api/auth/me` - Get current user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 🎉 Selamat!

Anda telah berhasil membuat backend TypeScript dengan:

- ✅ MVC Pattern
- ✅ TypeORM & Migrations
- ✅ Password Hashing
- ✅ JWT Authentication
- ✅ Request Validation
- ✅ Global Error Handling
- ✅ Production-Ready Security

Backend Anda sekarang siap untuk production! 🚀

Proyek ini bisa menjadi foundation yang kuat untuk aplikasi yang lebih kompleks.

Happy coding! 🚀
