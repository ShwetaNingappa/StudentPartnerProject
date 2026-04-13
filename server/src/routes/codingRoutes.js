import { Router } from "express";
import { getCodingQuestions, toggleSolved } from "../controllers/codingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getCodingQuestions);
router.patch("/:questionId/toggle", protect, toggleSolved);

export default router;
