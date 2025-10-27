# Tweet Application

A full-stack Twitter-like application built with React, Redux, TypeScript, NestJS, Prisma, and PostgreSQL.

## Features

- User authentication (Register, Login, Change Password)
- Create and view tweets
- Share tweets with specific users
- Email notifications (mock implementation)
- View tweets shared with you
- Responsive UI with clean design

## Tech Stack

### Frontend
- **React** 18+ with TypeScript
- **Redux Toolkit** for state management
- **React Router** for routing
- **Vite** for fast development and building
- **Axios** for API calls
- **Vitest** and **React Testing Library** for unit tests

### Backend
- **NestJS** with TypeScript
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Class-validator** for request validation
- **Jest** for unit tests

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- npm or yarn
- PostgreSQL (v12 or higher)

## Project Structure

```
.
├── backend/           # NestJS backend application
│   ├── src/
│   │   ├── auth/      # Authentication module
│   │   ├── users/     # Users module
│   │   ├── tweets/    # Tweets module
│   │   ├── email/     # Email service module
│   │   └── prisma/    # Prisma service
│   └── prisma/        # Prisma schema and migrations
└── frontend/          # React frontend application
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── store/       # Redux store and slices
    │   ├── services/    # API services
    │   └── types/       # TypeScript types
```

## Quick Start (5 Minutes)

### 1. Setup Database

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE tweet_app;
\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Update .env with your PostgreSQL credentials if different
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tweet_app?schema=public"

# Run migrations
npx prisma migrate dev --name init

# Start backend
npm run start:dev
```

**Backend runs on:** http://localhost:3001

### 3. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

**Frontend runs on:** http://localhost:5173

### 4. Test the Application

1. Open http://localhost:5173
2. Click "Register here"
3. Create an account (Name: Test User, Email: test@example.com, Password: password123)
4. Create a tweet and share it with users
5. Check the **backend terminal** to see email notifications!

### Environment Variables

The `.env` file has default values. Update `backend/.env` if needed:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tweet_app?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"
```

## Features Guide

- **Register/Login**: Create account and authenticate with email/password
- **Create Tweet**: Write tweets and optionally share with specific users
- **My Tweets**: View all your tweets and see who they're shared with
- **Shared with Me**: View tweets others have shared with you
- **Change Password**: Update your password securely
- **Email Notifications**: Check backend console for mock email logs when sharing tweets

## API Endpoints

**Base URL:** `http://localhost:3001/api`

All endpoints except register and login require JWT authentication via `Authorization: Bearer <token>` header.

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `PUT /auth/change-password` - Change password

### Users
- `GET /users` - Get all users
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID

### Tweets
- `POST /tweets` - Create tweet (optionally share with users)
- `GET /tweets/my-tweets` - Get your tweets
- `GET /tweets/shared-with-me` - Get tweets shared with you
- `GET /tweets/:id` - Get tweet by ID

## Testing

**Backend Tests** (17 tests in 3 suites)
```bash
cd backend
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage
```

**Frontend Tests** (8 tests in 2 suites)
```bash
cd frontend
npm run test:run        # Run tests once
npm test                # Run in watch mode
npm run test:ui         # Run with UI
```

## Email Notifications

The email service is a mock implementation that logs email content to the console. When a tweet is shared with users, you'll see formatted email notifications in the backend console output.

To integrate a real email service:
1. Open `backend/src/email/email.service.ts`
2. Replace the console.log statements with actual email provider calls (SendGrid, AWS SES, etc.)

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String)
- `created_at` (DateTime)

### Tweets Table
- `id` (UUID, Primary Key)
- `content` (Text)
- `author_id` (UUID, Foreign Key → Users)
- `created_at` (DateTime)

### Tweet Shares Table
- `id` (UUID, Primary Key)
- `tweet_id` (UUID, Foreign Key → Tweets)
- `shared_with_id` (UUID, Foreign Key → Users)
- `created_at` (DateTime)
- Unique constraint on `(tweet_id, shared_with_id)`

## Development Notes

### Backend Development

The backend uses:
- **Global validation pipes** for automatic DTO validation
- **JWT authentication** with Passport strategies
- **Prisma** for type-safe database access
- **CORS** enabled for frontend communication

### Frontend Development

The frontend uses:
- **Redux Toolkit** for predictable state management
- **Protected routes** requiring authentication
- **Axios interceptors** for automatic token injection
- **TypeScript** for type safety

## Troubleshooting

**Port Already in Use**
- Backend (3001): Stop other services or change port in `backend/src/main.ts`
- Frontend (5173): Vite will automatically use next available port

**Database Connection Error**
- Ensure PostgreSQL is running: `pg_ctl status`
- Verify credentials in `backend/.env`
- Check if database exists: `psql -U postgres -l`

**Prisma Client Error**
```bash
cd backend
npx prisma generate
```

## Production Deployment

### Backend

1. Set proper environment variables
2. Run database migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm run start:prod`

### Frontend

1. Update API URL in `frontend/src/services/api.ts`
2. Build: `npm run build`
3. Serve the `dist` folder with a static server


## Author

Created for Banksforte Technologies assessment.
