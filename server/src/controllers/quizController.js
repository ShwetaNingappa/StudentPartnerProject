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
  const randomTwenty = await QuizQuestion.aggregate([{ $sample: { size: 20 } }]);
  const sanitized = randomTwenty.map(({ _id, category, question, options }) => ({
    id: String(_id),
    category,
    question,
    options
  }));
  res.json(sanitized);
};

export const submitQuiz = async (req, res) => {
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
  user.totalQuizScore += score;

  Object.keys(categoryScores).forEach((category) => {
    user.categoryPerformance[category] += categoryScores[category];
  });

  const today = new Date();
  const previous = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  if (!previous) {
    user.dailyStreak = 1;
  } else {
    const daysDiff = Math.floor((today - previous) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) user.dailyStreak += 1;
    if (daysDiff > 1) user.dailyStreak = 1;
  }
  user.lastActiveDate = today;
  await user.save();

  res.json({ score, totalQuestions: selectedQuestions.length, categoryScores });
};

export const getDashboardStats = async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: 1 });
  const progressChart = attempts.map((attempt, index) => ({
    name: `Attempt ${index + 1}`,
    score: attempt.score
  }));

  res.json({
    dailyStreak: req.user.dailyStreak,
    totalQuizScore: req.user.totalQuizScore,
    progressChart
  });
};
