import { Router } from "express";
import { getDashboardStats, getQuestions, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitQuiz);
router.get("/dashboard", protect, getDashboardStats);

export default router;
