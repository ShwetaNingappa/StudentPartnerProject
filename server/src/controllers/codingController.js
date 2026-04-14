import CodingQuestion from "../models/CodingQuestion.js";
import User from "../models/User.js";
import { codingQuestionsSeed } from "../data/codingQuestions.js";

export const ensureCodingSeed = async () => {
  try {
    const existing = await CodingQuestion.countDocuments();
    if (!existing) await CodingQuestion.insertMany(codingQuestionsSeed);
  } catch (error) {
    console.error("ensureCodingSeed error:", error);
  }
};

export const getCodingQuestions = async (req, res) => {
  try {
    const questions = await CodingQuestion.find().sort({ company: 1, difficulty: 1 });
    const solvedArr = (req.user && req.user.solvedCodingQuestions) || [];
    const solvedSet = new Set(solvedArr.map((id) => id.toString()));

    const response = questions.map((q) => ({
      ...q.toObject(),
      solved: solvedSet.has(q._id.toString())
    }));

    return res.json(response);
  } catch (error) {
    console.error("getCodingQuestions error:", error);
    return res.status(500).json({ message: "Failed to load coding questions" });
  }
};

export const toggleSolved = async (req, res) => {
  try {
    const { questionId } = req.params;
    const user = await User.findById(req.user._id);
    const question = await CodingQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Initialize safe defaults
    user.solvedCodingQuestions = user.solvedCodingQuestions || [];
    user.totalScore = user.totalScore || 0;
    user.dailyStreak = user.dailyStreak || 0;

    const solvedIds = user.solvedCodingQuestions.map((id) => id.toString());
    const exists = solvedIds.includes(questionId);

    let pointsEarned = 0;
    const pointsMap = { Easy: 20, Medium: 50, Hard: 100 };

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    if (exists) {
      pointsEarned = -(pointsMap[question.difficulty] || 50);
      user.solvedCodingQuestions = user.solvedCodingQuestions.filter((id) => id.toString() !== questionId);
      user.totalScore = Math.max(0, user.totalScore + pointsEarned);
    } else {
      user.solvedCodingQuestions = [...user.solvedCodingQuestions, questionId];
      pointsEarned = pointsMap[question.difficulty] || 50;
      user.totalScore = user.totalScore + pointsEarned;

      // STREAK LOGIC (midnight-normalized)
      if (user.lastActiveDate) {
        const lastActivity = new Date(user.lastActiveDate);
        const lastDate = new Date(lastActivity);
        lastDate.setHours(0, 0, 0, 0);

        const diffInDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 1) {
          user.dailyStreak = (user.dailyStreak || 0) + 1;
        } else if (diffInDays > 1) {
          user.dailyStreak = 1;
        }
        // diffInDays === 0 -> already active today, do nothing
      } else {
        user.dailyStreak = 1;
      }

      user.lastActiveDate = now;
    }

    await user.save();

    return res.json({
      message: exists ? "Marked as unsolved" : "Success! Problem solved.",
      pointsEarned: !exists ? pointsEarned : 0,
      totalScore: user.totalScore,
      dailyStreak: user.dailyStreak,
      streakMaintained: !exists
    });
  } catch (error) {
    console.error("toggleSolved error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};