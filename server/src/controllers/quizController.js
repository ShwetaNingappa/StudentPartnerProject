import QuizAttempt from "../models/QuizAttempt.js";
import QuizQuestion from "../models/QuizQuestion.js";
import User from "../models/User.js";
import { quizQuestions } from "../data/quizQuestions.js";

const buildQuestionBank = () => {
  const generated = [];
  for (let i = 0; i < 100; i += 1) {
    const base = quizQuestions[i % quizQuestions.length];
    generated.push({
      category: base.category,
      question: `${base.question} (Practice Set ${Math.floor(i / quizQuestions.length) + 1})`,
      options: base.options,
      answer: base.answer
    });
  }
  return generated;
};

export const ensureQuizSeed = async () => {
  const existing = await QuizQuestion.countDocuments();
  if (existing < 100) {
    if (existing) {
      await QuizQuestion.deleteMany({});
    }
    await QuizQuestion.insertMany(buildQuestionBank());
  }
};

export const getQuestions = async (_req, res) => {
  try {
    const count = await QuizQuestion.countDocuments();
    if (!count) return res.json([]);

    const size = Math.min(20, count);
    const randomTwenty = await QuizQuestion.aggregate([{ $sample: { size } }]);
    const sanitized = randomTwenty.map(({ _id, category, question, options }) => ({
      id: String(_id),
      category,
      question,
      options
    }));
    return res.json(sanitized);
  } catch (error) {
    console.error("getQuestions error:", error);
    return res.status(500).json({ message: "Failed to load quiz questions" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ message: "Invalid submission format" });
    }

    const questionIds = Object.keys(answers);
    const selectedQuestions = await QuizQuestion.find({ _id: { $in: questionIds } });

    if (!selectedQuestions.length) {
      return res.status(400).json({ message: "No valid quiz questions were submitted" });
    }

    let score = 0;
    const categoryScores = { Quantitative: 0, Logical: 0, Verbal: 0, Technical: 0 };

    selectedQuestions.forEach((question) => {
      if (answers[String(question._id)] === question.answer) {
        score += 1;
        categoryScores[question.category] += 1;
      }
    });

    await QuizAttempt.create({
      user: req.user._id,
      score,
      totalQuestions: selectedQuestions.length,
      categoryScores
    });

    const user = await User.findById(req.user._id);
    user.totalQuizScore = (user.totalQuizScore || 0) + score;
    user.categoryPerformance = user.categoryPerformance || {};

    Object.keys(categoryScores).forEach((category) => {
      user.categoryPerformance[category] = (user.categoryPerformance[category] || 0) + categoryScores[category];
    });

    // --- REFACTORED STREAK LOGIC (midnight normalization) ---
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const previousDate = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    let streakMaintained = false;

    if (!previousDate) {
      // Brand new user activity
      user.dailyStreak = 1;
      streakMaintained = true;
    } else {
      const lastActivityDay = new Date(previousDate);
      lastActivityDay.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // It was yesterday!
        user.dailyStreak = (user.dailyStreak || 0) + 1;
        streakMaintained = true;
      } else if (daysDiff === 0) {
        // Already active today, streak stays same
        streakMaintained = true;
      } else {
        // Missed a day or more, reset to 1
        user.dailyStreak = 1;
        streakMaintained = true;
      }
    }

    user.lastActiveDate = now;
    await user.save();

    return res.json({
      score,
      totalQuestions: selectedQuestions.length,
      categoryScores,
      dailyStreak: user.dailyStreak,
      streakMaintained
    });
  } catch (error) {
    console.error("submitQuiz error:", error);
    return res.status(500).json({ message: "Failed to submit quiz" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // CRITICAL: Fetching fresh user data from DB instead of using req.user
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const attempts = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: 1 });

    const progressChart = attempts.map((attempt, index) => ({
      name: `Attempt ${index + 1}`,
      score: attempt.score
    }));

    // weeklyScore: sum of scores for attempts in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyAttempts = attempts.filter((a) => new Date(a.createdAt) >= sevenDaysAgo);
    const weeklyScore = weeklyAttempts.reduce((sum, a) => sum + (a.score || 0), 0);

    // random motivation string for dashboard
    const motivations = [
      "Keep going — consistency beats intensity.",
      "Small steps each day lead to big wins.",
      "You're building momentum. Stay focused!",
      "Great progress — push for one more!",
      "Practice makes progress, not perfection."
    ];
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

    res.json({
      dailyStreak: user.dailyStreak || 0,
      totalQuizScore: user.totalQuizScore || 0,
      progressChart,
      weeklyScore,
      motivation: randomMotivation
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};