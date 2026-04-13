import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { ensureCodingSeed } from "./controllers/codingController.js";
import { ensureDummyLeaderboard } from "./controllers/leaderboardController.js";
import { ensureQuizSeed } from "./controllers/quizController.js";
import authRoutes from "./routes/authRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import studyPlanRoutes from "./routes/studyPlanRoutes.js";

// 1. Load config
dotenv.config();

const app = express();

// 2. Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || ["http://localhost:5173"],
    credentials: true
  })
);

// 3. Routes
app.get("/", (_req, res) => res.send("Smart Placement API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/study-plan", studyPlanRoutes);

const PORT = process.env.PORT || 5000;

// 4. Start Server only AFTER Database connects
const startServer = async () => {
  try {
    // Wait for DB to connect
    await connectDB();
    console.log("✅ Database connected successfully");

    // Start listening
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Seed data only after we know the connection is live
      try {
        await ensureCodingSeed();
        await ensureQuizSeed();
        await ensureDummyLeaderboard();
        console.log("✅ Coding questions seeded/verified");
        console.log("✅ Quiz question bank seeded/verified (Random 20 active)");
        console.log("✅ Leaderboard dummy students seeded/verified");
      } catch (seedError) {
        console.error("❌ Seeding failed:", seedError.message);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Stop the app if DB fails
  }
};

startServer();