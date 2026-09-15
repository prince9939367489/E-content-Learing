# E-Content Learning Platform

A full-stack e-learning prototype for browsing courses, creating learner accounts, enrolling in courses, and submitting ratings and feedback.

## Project overview

This repository demonstrates a separated React and Express architecture:

- **Frontend:** React 18, TypeScript, Vite, React Router, Axios, and Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, MongoDB, and Mongoose
- **Authentication:** email/password login, bcrypt password hashing, and 24-hour JWT bearer tokens
- **Core data:** users, profiles, courses, enrollments, ratings, and feedback

## Application output

The full local application includes a landing page, an API-backed course catalogue, sign-up and login forms, a protected feedback form, an honest project About page, and responsive navigation for signed-in and signed-out users.

**Live portfolio demo:** [Open the E-Content Learning Platform](https://prince-learnspace-demo.princekumar120207.chatgpt.site)

The public demo uses representative course data and browser-only account actions so every visitor can explore the interface without sharing credentials. The full API-backed version still runs locally with MongoDB using the instructions below.

## Features

- Validated user registration and login
- Password hashing before database storage
- JWT-protected profile, enrollment, and feedback requests
- API-backed course catalogue with loading, empty, and error states
- Authenticated course enrollment
- Course feedback with ownership checks for editing and deletion
- Central request validation and error handling
- Environment-based API URL, database, CORS, and JWT configuration

## Project structure

```text
.
├── backend/
│   ├── src/
│   │   ├── middleware/     # Authentication, validation, and error handling
│   │   ├── models/         # User, Profile, Course, and Feedback models
│   │   ├── routes/         # Authentication, courses, feedback, and profile routes
│   │   └── index.ts        # API setup and startup
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Shared interface components
│   │   ├── pages/          # Home, Courses, Login, Signup, About, and Feedback
│   │   ├── api.ts          # Shared API client and bearer-token attachment
│   │   └── App.tsx         # Routing and authentication state
│   └── .env.example
└── README.md
```

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB running locally, or a MongoDB connection string

### 1. Start the API

Copy `backend/.env.example` to `backend/.env`, then replace `JWT_SECRET` with a long random value.

```bash
cd backend
npm install
npm run dev
```

The API starts at `http://localhost:5000` after it connects to MongoDB.

### 2. Add sample courses (optional)

With MongoDB running and `backend/.env` configured, run the idempotent seed command from the backend directory:

```bash
npm run seed
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Vite proxies `/api` requests to the local backend. For a deployed API, set `VITE_API_URL` as shown in `frontend/.env.example`.

## Main API routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create an account |
| POST | `/api/auth/login` | Public | Authenticate and receive a JWT |
| GET | `/api/profile/me` | Bearer token | Validate a token and read the current user |
| GET | `/api/courses` | Public | List courses |
| GET | `/api/courses/:id` | Public | Read one course |
| POST | `/api/courses/:id/enroll` | Bearer token | Enroll in a course |
| GET | `/api/feedback/course/:courseId` | Public | Read course feedback |
| GET | `/api/feedback/course/:courseId/stats` | Public | Read feedback statistics |
| POST | `/api/feedback/course` | Bearer token | Submit feedback |
| PUT | `/api/feedback/:feedbackId` | Owner | Update feedback |
| DELETE | `/api/feedback/:feedbackId` | Owner | Delete feedback |

## Integration fixes included

- The profile router is mounted at the path used during session validation.
- Sign-up sends `confirmPassword` and reads the API's nested response correctly.
- Enrollment uses the correct course URL and MongoDB ID validation.
- Course lists use the API's `{ success, data }` response shape.
- All frontend calls share one environment-aware API client.
- The development proxy preserves the `/api` prefix expected by Express.
- The backend requires an explicit JWT secret instead of using a fallback secret.
- CORS is limited to the configured frontend origin.

## Security scope

This is a learning prototype, not a production identity system. JWTs are stored in browser `localStorage`; there are no refresh tokens, server-side sessions, revocation list, email verification, or password-reset flow. A production version should use secure, HttpOnly cookies, short-lived access tokens, refresh-token rotation, CSRF protection, rate limiting, and account-recovery controls.

## Roadmap

- Add automated frontend and API tests
- Add password reset and email verification
- Add role-based administration
- Add course content and progress tracking
- Deploy the API and database for a persistent production environment
- Add verified screenshots
