# 🚀 Backend TypeScript dengan MVC Pattern

Proyek backend TypeScript lengkap dengan arsitektur MVC (Model-View-Controller), JWT Authentication, Input Validation, Password Hashing, dan Error Handling yang robust.

## ✨ Features

- ✅ **MVC Architecture** - Struktur kode yang terorganisir
- ✅ **JWT Authentication** - Secure authentication dengan JSON Web Token
- ✅ **Password Hashing** - Bcrypt untuk keamanan password
- ✅ **Input Validation** - Validasi otomatis dengan class-validator
- ✅ **Error Handling** - Global error handler middleware
- ✅ **TypeORM Migration** - Database migration yang mudah
- ✅ **Environment Variables** - Konfigurasi yang aman dengan dotenv
- ✅ **Security Middleware** - Helmet untuk security headers

## 🚀 Teknologi yang Digunakan

- **TypeScript** - Programming language dengan type safety
- **Express.js** - Web framework untuk Node.js
- **TypeORM** - ORM dan migration tool untuk database
- **PostgreSQL** - Relational database
- **JWT** (jsonwebtoken) - Authentication token
- **bcrypt** - Password hashing
- **class-validator** - DTO validation
- **Helmet** - Security middleware
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger

## 📁 Struktur Folder

```
typescript-backend/
├── src/
│   ├── config/              # Konfigurasi aplikasi
│   │   ├── env.config.ts    # Environment variables config
│   │   └── database.config.ts  # Database connection config
│   ├── controllers/         # Controllers (business logic)
│   │   ├── Auth.controller.ts  # Authentication logic
│   │   └── User.controller.ts  # User management logic
│   ├── models/             # Models (database entities)
│   │   └── User.model.ts   # User entity dengan TypeORM
│   ├── routes/             # Routes definition
│   │   ├── index.ts        # Main router
│   │   ├── auth.routes.ts  # Authentication routes
│   │   └── user.routes.ts  # User management routes
│   ├── middlewares/        # Custom middlewares
│   │   ├── index.ts        # Setup middlewares
│   │   ├── auth.middleware.ts  # JWT authentication
│   │   ├── validation.middleware.ts  # Input validation
│   │   └── error.middleware.ts  # Global error handler
│   ├── dtos/               # Data Transfer Objects
│   │   └── user.dto.ts     # User DTOs untuk validation
│   ├── utils/              # Utility functions
│   │   ├── password.helper.ts  # Password hashing
│   │   ├── jwt.helper.ts   # JWT token management
│   │   └── errors.ts       # Custom error classes
│   ├── migrations/         # Database migrations
│   │   └── 1696400000000-CreateUsersTable.ts
│   └── server.ts           # Entry point aplikasi
├── .env                    # Environment variables (jangan di-commit!)
├── .env.example            # Template environment variables
├── API_DOCUMENTATION.md    # Dokumentasi API lengkap
├── TUTORIAL.md             # Tutorial step-by-step
├── README.md               # File ini
├── .gitignore
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🛠️ Cara Instalasi

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup database:**

   - Buat database PostgreSQL baru
   - Copy `.env.example` ke `.env`
   - Update kredensial database di file `.env`

3. **Jalankan migration:**
   ```bash
   npm run migration:run
   ```

## 🏃 Cara Menjalankan

### Development mode (dengan hot reload):

```bash
npm run dev
```

### Production mode:

```bash
npm run build
npm start
```

## 📝 API Endpoints

### 🔓 Public Endpoints

- `GET /health` - Check server status
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### 🔐 Protected Endpoints (Requires JWT Token)

- `GET /api/auth/me` - Get current user info
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### 📖 Dokumentasi API Lengkap

Lihat file [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk dokumentasi lengkap dengan contoh request/response.

### Contoh Quick Start:

**1. Register:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**2. Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**3. Access Protected Route:**

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🗄️ Database Migration

### Generate migration baru:

```bash
npm run migration:generate -- src/migrations/NamaMigration
```

### Jalankan migration:

```bash
npm run migration:run
```

### Rollback migration terakhir:

```bash
npm run migration:revert
```

## � Security Features

### 1. Password Hashing dengan bcrypt

- Semua password di-hash dengan bcrypt (salt rounds: 10)
- Password tidak pernah disimpan dalam plain text
- Verifikasi password aman dengan bcrypt.compare()

### 2. JWT Authentication

- Token-based authentication
- Token expires dalam 24 jam (configurable)
- Protected routes memerlukan valid JWT token
- Format header: `Authorization: Bearer <token>`

### 3. Input Validation

- Otomatis validasi dengan class-validator
- DTO (Data Transfer Objects) untuk setiap endpoint
- Error messages yang jelas dan informatif
- Validasi email format, password length, dll

### 4. Global Error Handling

- Custom error classes (AppError, NotFoundError, dll)
- Centralized error handling middleware
- Stack trace hanya muncul di development mode
- Consistent error response format

### 5. Security Middleware

- **Helmet**: Set security HTTP headers
- **CORS**: Configure Cross-Origin Resource Sharing
- **Morgan**: HTTP request logging

## 📌 Catatan Penting

1. ✅ **Password Hashing**: Sudah diimplementasikan dengan bcrypt
2. ✅ **Validation**: Sudah menggunakan class-validator untuk validasi robust
3. ✅ **Authentication**: JWT authentication sudah diimplementasikan
4. ✅ **Error Handling**: Global error handler sudah ditambahkan

## 🔐 Environment Variables

Lihat file `.env.example` untuk daftar lengkap environment variables yang dibutuhkan.

## 📚 Belajar Lebih Lanjut

- TypeORM Documentation: https://typeorm.io/
- Express.js Guide: https://expressjs.com/
- TypeScript Handbook: https://www.typescriptlang.org/docs/

## 📄 License

ISC
# typescript-backend
