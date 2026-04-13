import { Router } from "express";
import {
  addTask,
  deleteTask,
  getStudyPlan,
  toggleTask
} from "../controllers/studyPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getStudyPlan);
router.post("/tasks", protect, addTask);
router.patch("/tasks/:id", protect, toggleTask);
router.delete("/tasks/:id", protect, deleteTask);

export default router;
