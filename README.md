# Smart Placement Preparation Portal

A full-stack MERN web application for placement preparation with authentication, aptitude quizzes, coding practice tracking, leaderboard ranking, and a smart study plan generator.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth & Security:** JWT, bcrypt
- **Deployment Ready:** CORS configured for Vercel (frontend) and Render (backend)

## Features

- JWT-based Login and Signup with secure password hashing
- Student dashboard with:
  - Daily streak counter
  - Preparation progress chart
- Aptitude quiz interface with countdown timer and score persistence
- Coding question dashboard categorized by company and difficulty
- Toggle solved/unsolved coding questions
- Leaderboard ranking users by total quiz score
- Smart study plan based on weakest quiz categories

## Project Structure

```text
.
|-- client
|   |-- src
|   |   |-- components
|   |   |-- context
|   |   `-- pages
|-- server
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- data
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   `-- utils
`-- README.md
```

## Setup Instructions

### 1) Install dependencies

```bash
npm run install-all
```

### 2) Environment setup

Create `server/.env` from `server/.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173,https://your-frontend.vercel.app
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3) Run backend and frontend

In two terminals:

```bash
npm run server
```

```bash
npm run client
```

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/quiz/questions`
- `POST /api/quiz/submit`
- `GET /api/quiz/dashboard`
- `GET /api/coding`
- `PATCH /api/coding/:questionId/toggle`
- `GET /api/leaderboard`
- `GET /api/study-plan`

## Smart Study Plan Logic

The backend tracks cumulative correct answers by category (`Quantitative`, `Logical`, `Verbal`, `Technical`) during quiz submissions.  
The study generator sorts categories by lowest score and returns topic recommendations for the weakest two categories, helping students prioritize improvement where they struggle most.

## Deployment Notes

- Deploy backend on Render and set server environment variables.
- Deploy frontend on Vercel and set `VITE_API_URL` to your Render API URL.
- Add Vercel domain(s) in server `CLIENT_URL` for CORS.
