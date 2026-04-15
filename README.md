# Student Partner - AI-Powered Career Prep Platform

A MERN stack application designed to help students master DSA and Aptitude with a focus on consistency and real-time progress tracking.

## Key Technical Features
- Dynamic Question Bank: 100+ randomized aptitude and quiz questions using MongoDB's `$sample` aggregation to deliver fresh, randomized sets.
- Midnight-Normalized Streak System: Robust daily streak logic that normalizes by day boundaries to ensure accurate progress tracking across time zones and variances in user activity time-of-day.
- Company-Specific DSA: Problems categorized by top recruiters (TCS, Wipro, Infosys) with targeted practice flows.
- AI Integration: Prompt-engineered explanations and AI-powered resume/feedback features for personalized, actionable guidance.
- Interactive Dashboard: Real-time stats visualization with randomized motivational triggers and progress summaries.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas

## Installation & Setup
1. Clone the repository:

   git clone <repo-url>
   cd Student Partner

2. Install dependencies for both client and server:

   npm run install-all

3. Environment variables
- Frontend (client/.env):
  - `VITE_API_URL` — Example: `http://localhost:5000/api` (used by the client to target the API)
- Backend (server/.env):
  - `MONGODB_URI` — Your MongoDB Atlas connection string (used in `server/src/config/db.js`)
  - `JWT_SECRET` — Secret used to sign JWTs (used in `server/src/utils/generateToken.js`)
  - Optional / helpful envs:
    - `PORT` — Server port (defaults to `5000`)
    - `CLIENT_URL` — Comma-separated allowed origins for CORS (e.g., `https://your-app.vercel.app`)
    - `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_FROM` — For SMTP email features

4. Run locally
- Start server (development):

   npm run server

- Start client (development):

   npm run client

- Build client for production:

   npm run build

- Start server for production (from root):

   npm start

## Deployment Notes
- Frontend:
  - Set `VITE_API_URL` at build time to point to your deployed API (e.g., `https://api.myapp.com/api`).
  - Vite will embed `VITE_*` env values at build time.
- Backend:
  - Ensure `MONGODB_URI` and `JWT_SECRET` are set in your hosting provider's environment (Render, Heroku, Vercel serverless functions, etc.).
  - The server uses `process.env.PORT || 5000` so your host can assign the port.
  - Set `CLIENT_URL` to your frontend origin (or comma-separated origins) so CORS accepts requests from your hosted frontend.

## Security & Best Practices
- Never commit `.env` files. This repo's `.gitignore` already excludes `.env`.
- Use a `server/.env.example` or secrets manager in production instead of committing credentials.

## Where to look in the code
- API client base: `client/src/api.js` — uses `import.meta.env.VITE_API_URL || "http://localhost:5000/api"`
- Server entry: `server/src/server.js` — CORS and `process.env.PORT` handling
- DB connection: `server/src/config/db.js` — reads `MONGODB_URI`
- Token generation: `server/src/utils/generateToken.js` — reads `JWT_SECRET`

## License
- This project is provided as-is. Add your preferred license if you intend to publish.# Smart Placement Preparation Portal

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
