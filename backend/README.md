# Backend - Express.js API Server

RESTful API server for authentication and user management.

## 🚀 Features

- **User Authentication** (Register, Login, Logout)
- **Google OAuth 2.0** integration
- **Email Verification** system
- **Password Reset** functionality
- **JWT Token Management** with refresh tokens
- **Rate Limiting** and security middleware

## 🛠️ Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for emails
- bcrypt for password hashing

## 📦 Installation

```
cd backend
npm install
```

## 🔧 Environment Variables

Create `.env` file:
```
JWT_ACCESS_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
MONGODB_URI=mongodb://localhost:27017/your-db
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=development
PORT=5000
JWT_ACCESS_EXPIRE=
JWT_REFRESH_EXPIRE=
FROM_NAME=your-name
FROM_EMAIL=your-email
RATE_LIMIT_WINDOW_MS=
RATE_LIMIT_MAX_REQUESTS=
AUTH_RATE_LIMIT_MAX=
BCRYPT_SALT_ROUNDS=
ACCOUNT_LOCKOUT_TIME=
MAX_LOGIN_ATTEMPTS=
SESSION_SECRET=your-session-secret
CLIENT_URL=http://localhost:3000
```


## 📁 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/user/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Password Management
- `POST /api/auth/password/forgot` - Request password reset
- `POST /api/auth/password/reset/:token` - Reset password

### Email Verification
- `POST /api/auth/verify-email/send` - Send verification email
- `GET /api/auth/verify-email/:token` - Verify email

### OAuth
- `POST /api/auth/google/token` - Google OAuth login

## 🏗️ Architecture

```
routes/
├── auth/
│ ├── index.js # Route mounting
│ ├── login.js # Login/logout
│ ├── register.js # User registration
│ ├── profile.js # Profile management
│ ├── password.js # Password operations
│ ├── verification.js # Email verification
│ └── oauth.js # Google OAuth
├── middleware/
│ └── auth.js # JWT authentication
├── models/
│ └── User.js # User schema
└── utils/
└── email.js # Email utilities
```

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS protection
- Account lockout mechanism

