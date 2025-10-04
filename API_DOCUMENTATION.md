# 🔐 API Documentation - Backend TypeScript MVC

API backend dengan authentication, validation, dan error handling yang lengkap.

## 📋 Base URL

```
http://localhost:3000
```

---

## 🔓 Public Endpoints

### Health Check

Check status server

**Endpoint:** `GET /health`

**Response:**

```json
{
  "success": true,
  "message": "Server is running!",
  "timestamp": "2025-10-04T08:00:00.000Z"
}
```

---

## 🔐 Authentication Endpoints

### 1. Register (Sign Up)

Mendaftarkan user baru

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `name`: Required, must be string
- `email`: Required, must be valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "2025-10-04T08:00:00.000Z",
      "updatedAt": "2025-10-04T08:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

**Error Response (409 - Email exists):**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Error Response (400 - Validation failed):**

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
    }
  ]
}
```

---

### 2. Login

Login user yang sudah terdaftar

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `email`: Required, must be valid email format
- `password`: Required

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "2025-10-04T08:00:00.000Z",
      "updatedAt": "2025-10-04T08:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

**Error Response (401 - Invalid credentials):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error Response (403 - Account inactive):**

```json
{
  "success": false,
  "message": "Account is inactive"
}
```

---

### 3. Get Current User (Protected)

Mendapatkan informasi user yang sedang login

**Endpoint:** `GET /api/auth/me`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "createdAt": "2025-10-04T08:00:00.000Z",
    "updatedAt": "2025-10-04T08:00:00.000Z"
  }
}
```

**Error Response (401 - No token):**

```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

**Error Response (401 - Invalid token):**

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 👥 User Management Endpoints (Protected)

**Note:** Semua endpoint user memerlukan authentication token di header

### 1. Get All Users

Mendapatkan semua user

**Endpoint:** `GET /api/users`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "2025-10-04T08:00:00.000Z",
      "updatedAt": "2025-10-04T08:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "isActive": true,
      "createdAt": "2025-10-04T08:00:00.000Z",
      "updatedAt": "2025-10-04T08:00:00.000Z"
    }
  ]
}
```

---

### 2. Get User By ID

Mendapatkan user berdasarkan ID

**Endpoint:** `GET /api/users/:id`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**

- `id`: User UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "createdAt": "2025-10-04T08:00:00.000Z",
    "updatedAt": "2025-10-04T08:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 3. Create User

Membuat user baru (untuk admin)

**Endpoint:** `POST /api/users`

**Request Body:**

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `name`: Required, must be string
- `email`: Required, must be valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-here",
    "name": "New User",
    "email": "newuser@example.com",
    "isActive": true,
    "createdAt": "2025-10-04T08:00:00.000Z",
    "updatedAt": "2025-10-04T08:00:00.000Z"
  }
}
```

**Error Response (409):**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 4. Update User

Update informasi user

**Endpoint:** `PUT /api/users/:id`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**

- `id`: User UUID

**Request Body (semua field opsional):**

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "isActive": false
}
```

**Validation Rules:**

- `name` (optional): Must be string
- `email` (optional): Must be valid email format
- `isActive` (optional): Must be boolean

**Success Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "isActive": false,
    "createdAt": "2025-10-04T08:00:00.000Z",
    "updatedAt": "2025-10-04T09:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Error Response (409 - Email already used):**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 5. Delete User

Menghapus user

**Endpoint:** `DELETE /api/users/:id`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**

- `id`: User UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 🔧 Testing dengan cURL

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User (dengan token)

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get All Users (dengan token)

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update User (dengan token)

```bash
curl -X PUT http://localhost:3000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated"
  }'
```

---

## 🧪 Testing dengan Postman

1. **Import Collection:**

   - Buat collection baru di Postman
   - Set base URL sebagai variable: `{{baseUrl}} = http://localhost:3000`

2. **Setup Environment:**

   - Buat environment variable `token`
   - Setelah login, copy token ke variable ini

3. **Authorization Header:**
   - Untuk protected endpoints, tambahkan di Headers:
     - Key: `Authorization`
     - Value: `Bearer {{token}}`

---

## ⚠️ Error Responses

### 400 - Bad Request (Validation Error)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "message": "Account is inactive"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 - Conflict

```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔐 Security Features

### 1. Password Hashing

- Menggunakan **bcrypt** dengan salt rounds 10
- Password tidak pernah disimpan dalam plain text
- Password di-hash sebelum disimpan ke database

### 2. JWT Authentication

- Token expires dalam 24 jam (configurable via .env)
- Token harus disertakan di header untuk protected routes
- Format: `Authorization: Bearer <token>`

### 3. Input Validation

- Menggunakan **class-validator**
- Semua input di-validasi sebelum diproses
- Error message yang jelas untuk setiap validation failure

### 4. Error Handling

- Global error handler middleware
- Custom error classes untuk berbagai jenis error
- Stack trace hanya muncul di development mode

---

## 📝 Notes

1. **Password Hashing**: Semua password otomatis di-hash dengan bcrypt sebelum disimpan
2. **JWT Token**: Token valid selama 24 jam, dapat diubah di file `.env`
3. **Protected Routes**: Endpoint `/api/users/*` dan `/api/auth/me` memerlukan authentication
4. **Public Routes**: `/health`, `/api/auth/register`, `/api/auth/login` dapat diakses tanpa token
5. **Validation**: Semua input otomatis di-validasi, error message akan menjelaskan field mana yang bermasalah

---

## 🚀 Next Steps

Untuk pengembangan lebih lanjut, Anda bisa menambahkan:

- Rate limiting untuk mencegah brute force
- Refresh token untuk security yang lebih baik
- Role-based access control (Admin, User, dll)
- Email verification untuk registrasi
- Password reset functionality
- API documentation dengan Swagger
- Unit testing dan integration testing

---

## 📚 Resources

- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [jsonwebtoken Documentation](https://github.com/auth0/node-jsonwebtoken)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [TypeORM Documentation](https://typeorm.io/)
- [Express.js Documentation](https://expressjs.com/)
